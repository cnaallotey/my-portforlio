"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// "Break my stack" — Breakout where every brick is a tool I use.
// Canvas 2D, frame-rate independent, sub-stepped collisions,
// particles, combo popups, screen shake and a locally saved best score.

const WORDS = [
  "VUE", "NUXT", "REACT", "NEXT.JS", "TS", "NODE", "LARAVEL", "TAILWIND",
  "FIREBASE", "POSTGRES", "MONGO", "GEMINI", "GENKIT", "FIGMA", "GSAP", "PINIA",
  "EXPRESS", "STRAPI", "VERCEL", "GIT", "JWT", "REST", "CLAUDE", "CURSOR",
  "HTML", "CSS", "JS", "NPM", "SOCKET", "MYSQL", "NETLIFY", "AI",
  "WEBGL", "SCSS", "VITE", "RESEND", "ZOD", "UI", "UX", "API",
];
const ROW_COLORS = ["#C8F94D", "#EDEDEA", "#6366F1", "#22D3EE", "#FF6AD5"];
const ROWS = 5;
const BEST_KEY = "break-my-stack-best";

type Status = "idle" | "playing" | "won" | "lost";

type Brick = { col: number; row: number; label: string; color: string; alive: boolean };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string; size: number };
type Popup = { x: number; y: number; text: string; life: number; color: string };

export default function BreakoutGame() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ start: () => void } | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [best, setBest] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d")!;

    let W = 0, H = 0, cols = 8;
    let state: Status = "idle";
    let scoreVal = 0, livesVal = 3, combo = 0, shake = 0, speed = 0, time = 0;
    let bestVal = 0;
    try { bestVal = Number(localStorage.getItem(BEST_KEY)) || 0; } catch {}
    const bestRaf = requestAnimationFrame(() => setBest(bestVal));

    const paddle = { x: 0, target: 0, w: 120, h: 12, y: 0 };
    const ball = { x: 0, y: 0, vx: 0, vy: 0, r: 7, stuck: true };
    let bricks: Brick[] = [];
    let particles: Particle[] = [];
    let popups: Popup[] = [];
    let trail: { x: number; y: number }[] = [];
    const keys = { left: false, right: false };

    const baseSpeed = () => Math.max(380, Math.min(W, 1100) * 0.55);

    const brickRect = (b: Brick) => {
      const side = W < 640 ? 14 : 28, gap = W < 640 ? 6 : 8, top = 64;
      const bw = (W - side * 2 - gap * (cols - 1)) / cols;
      const bh = W < 640 ? 24 : 30;
      return { x: side + b.col * (bw + gap), y: top + b.row * (bh + gap), w: bw, h: bh };
    };

    const buildBricks = () => {
      cols = W < 640 ? 5 : 8;
      bricks = [];
      for (let row = 0; row < ROWS; row++)
        for (let col = 0; col < cols; col++)
          bricks.push({
            col, row,
            label: WORDS[(row * cols + col) % WORDS.length],
            color: ROW_COLORS[row % ROW_COLORS.length],
            alive: true,
          });
    };

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const prevCols = cols;
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paddle.w = Math.max(80, Math.min(140, W * 0.16));
      paddle.y = H - 40;
      if (!paddle.x) paddle.x = paddle.target = W / 2;
      if (bricks.length === 0 || (W < 640 ? 5 : 8) !== prevCols) buildBricks();
      if (ball.stuck) resetBall();
    };

    const resetBall = () => {
      ball.stuck = true;
      ball.x = paddle.x;
      ball.y = paddle.y - ball.r - 2;
      ball.vx = 0;
      ball.vy = 0;
      trail = [];
    };

    const launch = () => {
      if (!ball.stuck) return;
      ball.stuck = false;
      speed = baseSpeed();
      const a = (Math.random() - 0.5) * 0.8;
      ball.vx = speed * Math.sin(a);
      ball.vy = -speed * Math.cos(a);
    };

    const setState = (s: Status) => {
      state = s;
      setStatus(s);
    };

    const newGame = () => {
      scoreVal = 0; livesVal = 3; combo = 0;
      setScore(0); setLives(3);
      buildBricks();
      particles = []; popups = [];
      resetBall();
      setState("playing");
      startLoop();
    };

    const burst = (x: number, y: number, color: string, n = 18) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 80 + Math.random() * 320;
        particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 60, life: 1, color, size: 2 + Math.random() * 4 });
      }
    };

    const saveBest = () => {
      if (scoreVal > bestVal) {
        bestVal = scoreVal;
        setBest(bestVal);
        try { localStorage.setItem(BEST_KEY, String(bestVal)); } catch {}
      }
    };

    const physics = (dt: number) => {
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;

      if (ball.x < ball.r) { ball.x = ball.r; ball.vx = Math.abs(ball.vx); }
      if (ball.x > W - ball.r) { ball.x = W - ball.r; ball.vx = -Math.abs(ball.vx); }
      if (ball.y < ball.r) { ball.y = ball.r; ball.vy = Math.abs(ball.vy); }

      // paddle
      if (
        ball.vy > 0 &&
        ball.y + ball.r >= paddle.y &&
        ball.y - ball.r <= paddle.y + paddle.h &&
        Math.abs(ball.x - paddle.x) <= paddle.w / 2 + ball.r
      ) {
        const rel = Math.max(-1, Math.min(1, (ball.x - paddle.x) / (paddle.w / 2)));
        const a = rel * 1.05;
        ball.vx = speed * Math.sin(a);
        ball.vy = -speed * Math.cos(a);
        ball.y = paddle.y - ball.r;
        combo = 0;
        burst(ball.x, paddle.y, "#C8F94D", 6);
      }

      // bricks — at most one hit per sub-step
      for (const b of bricks) {
        if (!b.alive) continue;
        const r = brickRect(b);
        const cx = Math.max(r.x, Math.min(ball.x, r.x + r.w));
        const cy = Math.max(r.y, Math.min(ball.y, r.y + r.h));
        const dx = ball.x - cx, dy = ball.y - cy;
        if (dx * dx + dy * dy > ball.r * ball.r) continue;

        b.alive = false;
        const nx = (ball.x - (r.x + r.w / 2)) / (r.w / 2 + ball.r);
        const ny = (ball.y - (r.y + r.h / 2)) / (r.h / 2 + ball.r);
        if (Math.abs(nx) > Math.abs(ny)) ball.vx = Math.sign(nx) * Math.abs(ball.vx);
        else ball.vy = Math.sign(ny) * Math.abs(ball.vy);

        combo++;
        const pts = 10 * combo;
        scoreVal += pts;
        setScore(scoreVal);
        burst(r.x + r.w / 2, r.y + r.h / 2, b.color);
        popups.push({ x: r.x + r.w / 2, y: r.y, text: combo > 1 ? `${b.label} ×${combo}` : `+${pts}`, life: 1, color: b.color });
        shake = Math.min(14, 5 + combo * 1.5);
        speed = Math.min(speed * 1.012, baseSpeed() * 1.7);
        const len = Math.hypot(ball.vx, ball.vy) || 1;
        ball.vx = (ball.vx / len) * speed;
        ball.vy = (ball.vy / len) * speed;

        if (bricks.every((x) => !x.alive)) {
          saveBest();
          burst(W / 2, H / 2, "#C8F94D", 120);
          setState("won");
        }
        break;
      }

      if (ball.y > H + ball.r * 4) {
        livesVal--;
        setLives(livesVal);
        shake = 18;
        combo = 0;
        if (livesVal <= 0) {
          saveBest();
          setState("lost");
        } else resetBall();
      }
    };

    const step = (dt: number) => {
      time += dt;
      if (keys.left) paddle.target -= 900 * dt;
      if (keys.right) paddle.target += 900 * dt;
      paddle.target = Math.max(paddle.w / 2, Math.min(W - paddle.w / 2, paddle.target));
      paddle.x += (paddle.target - paddle.x) * Math.min(1, dt * 22);

      if (state === "playing") {
        if (ball.stuck) {
          ball.x = paddle.x;
          ball.y = paddle.y - ball.r - 2;
        } else {
          const n = Math.ceil(dt / (1 / 240));
          for (let i = 0; i < n && state === "playing"; i++) physics(dt / n);
          trail.push({ x: ball.x, y: ball.y });
          if (trail.length > 14) trail.shift();
        }
      }

      for (const p of particles) {
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.vy += 700 * dt; p.vx *= 0.985;
        p.life -= dt * 1.4;
      }
      particles = particles.filter((p) => p.life > 0);
      for (const p of popups) { p.y -= 50 * dt; p.life -= dt * 1.2; }
      popups = popups.filter((p) => p.life > 0);
      shake *= Math.pow(0.002, dt);
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      if (shake > 0.3) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

      // grid
      ctx.strokeStyle = "rgba(237,237,234,0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); ctx.stroke(); }

      // bricks
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `600 ${W < 640 ? 9 : 11}px "JetBrains Mono", monospace`;
      for (const b of bricks) {
        if (!b.alive) continue;
        const r = brickRect(b);
        const bob = Math.sin(time * 2 + b.col * 0.6 + b.row) * 1.5;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.roundRect(r.x, r.y + bob, r.w, r.h, 6);
        ctx.fill();
        ctx.fillStyle = "#0A0A0B";
        ctx.fillText(b.label, r.x + r.w / 2, r.y + r.h / 2 + bob + 0.5);
      }

      // paddle
      ctx.shadowColor = "#C8F94D";
      ctx.shadowBlur = 24;
      ctx.fillStyle = "#C8F94D";
      ctx.beginPath();
      ctx.roundRect(paddle.x - paddle.w / 2, paddle.y, paddle.w, paddle.h, 6);
      ctx.fill();

      // trail + ball
      ctx.shadowBlur = 0;
      trail.forEach((t, i) => {
        ctx.fillStyle = `rgba(200,249,77,${(i / trail.length) * 0.35})`;
        ctx.beginPath();
        ctx.arc(t.x, t.y, ball.r * (i / trail.length), 0, Math.PI * 2);
        ctx.fill();
      });
      if (state !== "lost") {
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 18;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      for (const p of particles) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
      ctx.font = `700 13px "JetBrains Mono", monospace`;
      for (const p of popups) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillText(p.text, p.x, p.y);
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    };

    let raf = 0;
    let last = performance.now();
    let visible = false;
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      step(dt);
      draw();
      raf = requestAnimationFrame(loop);
    };
    const startLoop = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stopLoop = () => cancelAnimationFrame(raf);

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      paddle.target = e.clientX - r.left;
    };
    const onClick = () => {
      if (state === "playing") launch();
    };
    const onKey = (e: KeyboardEvent) => {
      if (state !== "playing" || !visible) return;
      const isDown = e.type === "keydown";
      if (e.key === "ArrowLeft" || e.key === "a") { keys.left = isDown; e.preventDefault(); }
      if (e.key === "ArrowRight" || e.key === "d") { keys.right = isDown; e.preventDefault(); }
      if (isDown && e.key === " ") { launch(); e.preventDefault(); }
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) startLoop();
      else stopLoop();
    });
    io.observe(wrap);

    const ro = new ResizeObserver(() => { resize(); draw(); });
    ro.observe(wrap);
    resize();

    canvas.addEventListener("pointermove", onPointer);
    canvas.addEventListener("pointerdown", onPointer);
    canvas.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    api.current = { start: newGame };

    return () => {
      cancelAnimationFrame(bestRaf);
      stopLoop();
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerdown", onPointer);
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
      api.current = null;
    };
  }, []);

  const playing = status === "playing";

  return (
    <div className="relative">
      {/* HUD */}
      <div className="mb-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.1em] text-[#85857F]">
        <span>
          Score <span className="text-[#EDEDEA] tabular-nums">{String(score).padStart(4, "0")}</span>
        </span>
        <span className="flex items-center gap-1.5" aria-label={`${lives} lives`}>
          {[0, 1, 2].map((i) => (
            <span key={i} className={`h-2.5 w-2.5 rounded-full transition-colors ${i < lives ? "bg-accent" : "bg-white/10"}`} />
          ))}
        </span>
        <span>
          Best <span className="text-[#EDEDEA] tabular-nums">{String(best).padStart(4, "0")}</span>
        </span>
      </div>

      <div
        ref={wrapRef}
        data-cursor-hide={playing ? "" : undefined}
        className={`relative h-[480px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0d0d10] md:h-[560px] ${
          playing ? "cursor-none touch-none" : ""
        }`}
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        <AnimatePresence>
          {!playing && (
            <motion.div
              key={status}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[#0d0d10]/70 px-6 text-center backdrop-blur-[2px]"
            >
              <p className="font-display text-4xl font-semibold uppercase leading-[0.9] tracking-[-0.04em] text-[#EDEDEA] md:text-7xl">
                {status === "idle" && <>Break my<br /><span className="text-accent">stack.</span></>}
                {status === "lost" && <>Game<br /><span className="text-[#FF6AD5]">over.</span></>}
                {status === "won" && <>Stack<br /><span className="text-accent">broken!</span></>}
              </p>
              <p className="max-w-sm text-sm text-[#85857F]">
                {status === "idle" && "Move to steer, click or press space to launch. Arrow keys work too."}
                {status === "lost" && `You scored ${score}. The stack survives… for now.`}
                {status === "won" && `${score} points. Now that you've broken it — let's build something.`}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => api.current?.start()}
                  data-cursor="Play"
                  className="rounded-full bg-accent px-7 py-3 font-mono text-xs font-medium uppercase tracking-[0.1em] text-[#0A0A0B] transition-transform hover:scale-105 active:scale-95"
                >
                  {status === "idle" ? "Start game" : "Play again"}
                </button>
                {status === "won" && (
                  <a
                    href="mailto:charlesallotey1995@gmail.com"
                    className="rounded-full border border-white/20 px-7 py-3 font-mono text-xs uppercase tracking-[0.1em] text-[#EDEDEA] transition-colors hover:border-white"
                  >
                    Hire me
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
