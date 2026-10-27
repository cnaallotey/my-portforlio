"use client";

import { useEffect, useRef } from "react";

// Fixed pixel starfield behind the page. Square stars twinkle, a few
// four-point sparkles pulse, and the field drifts slightly with scroll.
// Canvas 2D at ~30fps, paused when the tab is hidden; one still frame
// for reduced motion. Light theme inverts it via CSS.

type Star = { x: number; y: number; size: number; phase: number; speed: number; depth: number; sparkle: boolean };

export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, dpr = 1, builtW = 0;
    let stars: Star[] = [];
    let raf = 0;
    let last = 0;

    const build = () => {
      const count = Math.round(Math.min(220, (W * H) / 7000));
      stars = Array.from({ length: count }, () => {
        const sparkle = Math.random() < 0.035;
        return {
          x: Math.random() * W,
          y: Math.random() * H,
          size: sparkle ? 2 : Math.random() < 0.25 ? 2 : 1,
          phase: Math.random() * Math.PI * 2,
          speed: 0.6 + Math.random() * 1.8,
          depth: 0.02 + Math.random() * 0.08,
          sparkle,
        };
      });
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Mobile URL bars change the height on scroll; only re-seed on width
      if (W !== builtW) {
        builtW = W;
        build();
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const sy = window.scrollY;
      for (const s of stars) {
        const tw = reduce ? 0.7 : 0.45 + 0.55 * Math.abs(Math.sin(t * 0.001 * s.speed + s.phase));
        const y = (((s.y - sy * s.depth) % H) + H) % H;
        const x = Math.round(s.x);
        const yy = Math.round(y);
        ctx.globalAlpha = tw * (s.sparkle ? 1 : 0.55);
        ctx.fillStyle = "#F0E8DA";
        if (s.sparkle) {
          const arm = Math.round(2 + tw * 4);
          ctx.fillRect(x - 1, yy - 1, 3, 3);
          ctx.fillRect(x - arm - 1, yy, arm * 2 + 3, 1);
          ctx.fillRect(x, yy - arm - 1, 1, arm * 2 + 3);
        } else {
          ctx.fillRect(x, yy, s.size, s.size);
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 33) return;
      last = t;
      draw(t);
    };

    resize();

    if (reduce) {
      draw(0);
      const still = () => { resize(); draw(0); };
      window.addEventListener("resize", still);
      window.addEventListener("scroll", still, { passive: true });
      return () => {
        window.removeEventListener("resize", still);
        window.removeEventListener("scroll", still);
      };
    }

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full [.light_&]:opacity-60 [.light_&]:invert"
    />
  );
}
