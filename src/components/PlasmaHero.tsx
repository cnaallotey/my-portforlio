"use client";

import { useEffect, useRef } from "react";

// Hero liquid: domain-warped fbm (q → r → f) in indigo / cyan / lime,
// with a lens bulge that follows the cursor and thin iridescent bands.
// Rendered at reduced resolution — the content is soft, so nobody can tell.

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform float uScroll;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
// Simplex 2D — Ashima Arts / Stefan Gustavson (MIT). Gradient noise keeps
// the warp liquid; value noise gave faceted, blocky shapes here.
vec3 permute3(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute3(permute3(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float noise(vec2 p) { return snoise(p) * 0.5 + 0.5; }
const mat2 R = mat2(0.8, 0.6, -0.6, 0.8);
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { v += a * noise(p); p = R * p * 2.02 + 1.7; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * vec2(asp, 1.0);
  vec2 m = (uMouse - 0.5) * vec2(asp, 1.0);
  vec2 dm = p - m;
  float d = length(dm);
  float lens = exp(-d * d * 6.0) * uHover;
  p -= dm * lens * 0.45;

  float t = uTime * 0.11;
  vec2 sp = p * 0.95 + vec2(0.0, uScroll * 1.2);
  vec2 q = vec2(fbm(sp + vec2(0.0, t)), fbm(sp + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(sp + 3.6 * q + vec2(1.7, 9.2) + t * 0.6),
                fbm(sp + 3.6 * q + vec2(8.3, 2.8) - t * 0.4));
  float f = fbm(sp + 3.6 * r);

  vec3 base = vec3(0.03, 0.03, 0.04);
  vec3 indigo = vec3(0.39, 0.40, 0.95);
  vec3 cyan = vec3(0.13, 0.83, 0.93);
  vec3 lime = vec3(0.78, 0.98, 0.30);

  vec3 col = base;
  col = mix(col, indigo * 0.7, smoothstep(0.3, 0.8, f));
  col = mix(col, cyan * 0.55, smoothstep(0.75, 1.15, length(q)) * 0.7);
  col = mix(col, lime, smoothstep(0.62, 0.95, r.x * f * 1.7) * 0.9);

  float bands = abs(fract(f * 6.0 - t * 2.0) - 0.5);
  float line = 1.0 - smoothstep(0.0, 0.035, bands);
  col += mix(cyan, lime, uv.x) * line * 0.18 * smoothstep(0.35, 0.7, f);

  col += lime * lens * 0.12;
  col *= smoothstep(1.5, 0.25, length((uv - 0.5) * vec2(asp * 0.75, 1.0)));
  col += (hash(gl_FragCoord.xy + fract(uTime) * 91.0) - 0.5) * 0.06;

  outColor = vec4(col, 1.0);
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

const SCALE = 0.4;
const FRAME = 1000 / 30;

export default function PlasmaHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) return;

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

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uHover = gl.getUniformLocation(prog, "uHover");
    const uScroll = gl.getUniformLocation(prog, "uScroll");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = { mouse: [0.5, 0.5], target: [0.5, 0.5], hover: 0, targetHover: 0, time: 4, last: performance.now() };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * SCALE));
      canvas.height = Math.max(1, Math.round(r.height * SCALE));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = () => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, s.time);
      gl.uniform2f(uMouse, s.mouse[0], s.mouse[1]);
      gl.uniform1f(uHover, s.hover);
      gl.uniform1f(uScroll, window.scrollY / window.innerHeight);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let raf = 0;
    let visible = true;
    let lastDraw = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - lastDraw < FRAME) return; // 30fps cap: liquid motion is slow
      lastDraw = now;
      const dt = Math.min((now - s.last) / 1000, 0.1);
      s.last = now;
      s.time += dt;
      const k = 1 - Math.pow(0.002, dt);
      s.mouse[0] += (s.target[0] - s.mouse[0]) * k;
      s.mouse[1] += (s.target[1] - s.mouse[1]) * k;
      s.hover += (s.targetHover - s.hover) * k * 0.6;
      draw();
    };
    const start = () => {
      cancelAnimationFrame(raf);
      s.last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      s.target[0] = (e.clientX - r.left) / r.width;
      s.target[1] = 1 - (e.clientY - r.top) / r.height;
      s.targetHover = e.clientY < r.bottom ? 1 : 0;
    };

    resize();
    if (reduce) {
      draw();
      const still = () => { resize(); draw(); };
      window.addEventListener("resize", still);
      return () => window.removeEventListener("resize", still);
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden) start();
      else cancelAnimationFrame(raf);
    });
    io.observe(canvas);
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (visible) start();
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}
