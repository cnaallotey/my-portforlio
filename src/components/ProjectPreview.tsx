"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useVelocity } from "framer-motion";

// Cursor-following project preview rendered in WebGL2.
// Switching projects morphs between textures with a noise-masked
// displacement; cursor velocity adds a soft wave + chromatic split.

const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5); // y=0 at top
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform vec2 uFromRes;
uniform vec2 uToRes;
uniform vec2 uRes;
uniform float uProgress;
uniform float uVel;
uniform float uTime;
out vec4 outColor;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

// object-fit: cover, anchored to the top (screenshots read top-down)
vec2 cover(vec2 uv, vec2 img) {
  float ra = uRes.x / uRes.y;
  float ia = img.x / img.y;
  if (ra > ia) return vec2(uv.x, uv.y * (ia / ra));
  return vec2((uv.x - 0.5) * (ra / ia) + 0.5, uv.y);
}

vec3 sampleSplit(sampler2D tex, vec2 uv, float s) {
  return vec3(
    texture(tex, uv + vec2(s, 0.0)).r,
    texture(tex, uv).g,
    texture(tex, uv - vec2(s, 0.0)).b
  );
}

void main() {
  vec2 uv = vUv;
  uv.x += sin(uv.y * 9.0 + uTime * 3.0) * uVel * 0.018;

  float n = vnoise(uv * 3.5 + uTime * 0.1) * 0.75 + vnoise(uv * 9.0) * 0.25;
  float p = uProgress;
  float mask = smoothstep(n - 0.12, n + 0.12, p * 1.24 - 0.12);

  vec2 dFrom = vec2(0.0, -p * 0.14 * n);
  vec2 dTo = vec2(0.0, (1.0 - p) * 0.14 * n);
  float split = uVel * 0.012;

  vec3 a = sampleSplit(uFrom, cover(uv + dFrom, uFromRes), split);
  vec3 b = sampleSplit(uTo, cover(uv + dTo, uToRes), split);
  outColor = vec4(mix(a, b, mask), 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh));
    return null;
  }
  return sh;
}

// Ask next/image's optimizer for a light version instead of the raw PNG
const optimized = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=828&q=75`;

const W = 320;
const H = 200;

type Tex = { tex: WebGLTexture; w: number; h: number } | null;

export default function ProjectPreview({
  images,
  active,
}: {
  images: string[];
  active: number | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);
  const activeRef = useRef<number | null>(active);
  const api = useRef<{ show: (i: number | null) => void } | null>(null);

  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const sx = useSpring(x, { stiffness: 160, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 160, damping: 22, mass: 0.6 });
  const vx = useVelocity(sx);

  // Only for precise hover pointers, and only with motion allowed
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(mq.matches && !rm.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    // Sit beside the cursor so the hovered title stays readable;
    // flip to the left side once the cursor passes 60% of the viewport
    const onMove = (e: PointerEvent) => {
      const side = e.clientX > window.innerWidth * 0.6 ? -1 : 1;
      x.set(e.clientX + side * (W / 2 + 32));
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, x, y]);

  useEffect(() => {
    activeRef.current = active;
    api.current?.show(active);
  }, [active]);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false });
    if (!gl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uFrom = u("uFrom"), uTo = u("uTo"), uFromRes = u("uFromRes"), uToRes = u("uToRes"),
      uRes = u("uRes"), uProgress = u("uProgress"), uVel = u("uVel"), uTime = u("uTime");
    gl.uniform1i(uFrom, 0);
    gl.uniform1i(uTo, 1);
    gl.uniform2f(uRes, W, H);

    const textures: Tex[] = images.map(() => null);
    let disposed = false;
    images.forEach((src, i) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (disposed) return;
        const tex = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        textures[i] = { tex, w: img.naturalWidth, h: img.naturalHeight };
        if (activeRef.current === i) show(i);
      };
      img.src = optimized(src);
    });

    let from = -1;
    let to = -1;
    let progress = 1;
    let time = 0;
    let vel = 0;
    let raf = 0;
    let last = performance.now();

    const bind = (unit: number, t: Tex, resLoc: WebGLUniformLocation | null) => {
      if (!t) return;
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t.tex);
      gl.uniform2f(resLoc, t.w, t.h);
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;
      progress = Math.min(progress + dt / 0.75, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const targetVel = Math.max(-1, Math.min(1, vx.get() / 2500));
      vel += (targetVel - vel) * Math.min(dt * 10, 1);

      const tTo = textures[to];
      const tFrom = textures[from] ?? tTo;
      if (tTo) {
        bind(0, tFrom, uFromRes);
        bind(1, tTo, uToRes);
        gl.uniform1f(uProgress, eased);
        gl.uniform1f(uVel, vel);
        gl.uniform1f(uTime, time);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      raf = requestAnimationFrame(frame);
    };

    const show = (i: number | null) => {
      if (i === null) {
        // keep rendering briefly so the fade-out isn't frozen
        window.setTimeout(() => {
          if (activeRef.current === null) cancelAnimationFrame(raf);
        }, 500);
        return;
      }
      if (!textures[i]) return; // will be called again on load
      if (to === -1) {
        from = i; to = i; progress = 1;
      } else if (i !== to) {
        from = to;
        to = i;
        progress = 0;
      }
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    // Coming back from hidden: start straight on the image, no morph
    api.current = {
      show: (i) => {
        if (i !== null && to !== -1 && canvas.dataset.visible !== "1") {
          from = i; to = i; progress = 1;
        }
        canvas.dataset.visible = i === null ? "0" : "1";
        show(i);
      },
    };
    if (activeRef.current !== null) api.current.show(activeRef.current);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      api.current = null;
      textures.forEach((t) => t && gl.deleteTexture(t.tex));
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, [enabled, images, vx]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-40"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        initial={false}
        animate={{
          opacity: active === null ? 0 : 1,
          scale: active === null ? 0.85 : 1,
        }}
        transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
        style={{ width: W, height: H, marginLeft: -W / 2, marginTop: -H / 2 }}
        className="overflow-hidden rounded-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]"
      >
        <canvas ref={canvasRef} style={{ width: W, height: H }} className="block" />
      </motion.div>
    </motion.div>
  );
}
