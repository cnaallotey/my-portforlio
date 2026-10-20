"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

// Full-page topographic contour field.
// Raw WebGL2 — one fullscreen triangle, simplex-noise height field,
// iso-lines anti-aliased with fwidth. The cursor raises a soft hill
// (rings appear around it), scroll drifts the terrain.

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uScroll;
uniform vec3 uLine;
uniform vec3 uAccent;
uniform float uIntensity;

out vec4 outColor;

// Simplex 3D noise — Ashima Arts / Stefan Gustavson (MIT)
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0 / 7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0);

  float t = uTime * 0.03;
  vec3 q = vec3(p * 1.1 + vec2(0.0, uScroll * 0.3), t);
  float f = snoise(q) * 0.62
          + snoise(q * 2.1 + 3.7) * 0.24
          + snoise(q * 4.3 - 1.3) * 0.07;

  float d = length(p - m);
  float hill = exp(-d * d * 10.0) * uMouseStrength;
  f += hill * 0.6;

  float v = f * 9.0;
  float w = fwidth(v);
  float dist = abs(fract(v + 0.5) - 0.5);
  float line = 1.0 - smoothstep(0.0, w * 1.15, dist);

  // every fifth contour is an "index" line, slightly stronger
  float major = step(mod(floor(v + 0.5), 5.0), 0.5);
  float weight = mix(0.42, 1.0, major);

  vec2 vq = (uv - 0.5) * vec2(1.0, 1.25);
  float vignette = smoothstep(0.95, 0.15, length(vq));

  vec3 col = mix(uLine, uAccent, smoothstep(0.05, 0.7, hill));
  float a = line * weight * uIntensity * vignette;
  a = mix(a, a * 2.2, smoothstep(0.1, 0.8, hill));

  outColor = vec4(col * a, a);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

const PALETTE = {
  dark: { line: [0.93, 0.93, 0.91], accent: [0.78, 0.97, 0.3], alpha: 0.17 },
  light: { line: [0.08, 0.08, 0.08], accent: [0.33, 0.47, 0.0], alpha: 0.16 },
} as const;

export default function ContourField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const themeRef = useRef<"dark" | "light">("dark");
  const redrawRef = useRef<() => void>(() => {});

  useEffect(() => {
    themeRef.current = resolvedTheme === "light" ? "light" : "dark";
    redrawRef.current();
  }, [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: "low-power",
    });
    if (!gl) return; // graceful: the page reads fine without it

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes"), uTime = u("uTime"), uMouse = u("uMouse"),
      uMouseStrength = u("uMouseStrength"), uScroll = u("uScroll"),
      uLine = u("uLine"), uAccent = u("uAccent"), uIntensity = u("uIntensity");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const state = {
      mouse: [0.5, 0.6], target: [0.5, 0.6],
      strength: 0, targetStrength: 0,
      scroll: 0, intensity: 1,
      time: 12, last: performance.now(),
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = window.innerWidth, h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    // Strong in the hero, quiet through the content, back up near the footer
    const targetIntensity = () => {
      const vh = window.innerHeight;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - vh;
      const top = 1 - Math.min(y / vh, 1) * 0.6;
      const bottom = 1 - Math.min(Math.max(max - y, 0) / vh, 1) * 0.6;
      return Math.max(top, bottom);
    };

    const draw = () => {
      const pal = PALETTE[themeRef.current];
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, state.time);
      gl.uniform2f(uMouse, state.mouse[0], state.mouse[1]);
      gl.uniform1f(uMouseStrength, state.strength);
      gl.uniform1f(uScroll, state.scroll);
      gl.uniform3fv(uLine, pal.line);
      gl.uniform3fv(uAccent, pal.accent);
      gl.uniform1f(uIntensity, state.intensity * pal.alpha);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let raf = 0;
    let firstFrame = true;
    const tick = (now: number) => {
      const dt = Math.min((now - state.last) / 1000, 0.05);
      state.last = now;
      state.time += dt;

      const k = 1 - Math.pow(0.001, dt); // frame-rate independent easing
      state.mouse[0] += (state.target[0] - state.mouse[0]) * k * 0.9;
      state.mouse[1] += (state.target[1] - state.mouse[1]) * k * 0.9;
      state.strength += (state.targetStrength - state.strength) * k * 0.5;
      state.scroll += (window.scrollY / window.innerHeight - state.scroll) * k * 0.6;
      state.intensity += (targetIntensity() - state.intensity) * k * 0.5;

      draw();
      if (firstFrame) {
        canvas.style.opacity = "1";
        firstFrame = false;
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      state.last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      state.target[0] = e.clientX / window.innerWidth;
      state.target[1] = 1 - e.clientY / window.innerHeight;
      state.targetStrength = 1;
    };
    const onLeave = () => { state.targetStrength = 0; };
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduce) start();
    };

    resize();

    if (reduce) {
      // A single still frame — no motion
      state.intensity = 1;
      const still = () => { resize(); draw(); };
      redrawRef.current = still;
      still();
      canvas.style.opacity = "1";
      window.addEventListener("resize", still);
      return () => {
        window.removeEventListener("resize", still);
        redrawRef.current = () => {};
      };
    }

    redrawRef.current = () => {};
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-0 transition-opacity duration-[2000ms]"
    />
  );
}
