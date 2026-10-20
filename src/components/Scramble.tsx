"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const GLYPHS = "!<>-_\\/[]{}=+*^?#ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";

// Decodes text from random glyphs when it scrolls into view (and on hover)
export default function Scramble({
  text,
  className = "",
  hover = false,
}: {
  text: string;
  className?: string;
  hover?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  const [out, setOut] = useState(text);
  const raf = useRef(0);

  const run = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cancelAnimationFrame(raf.current);
    let frame = 0;
    const total = text.length + 14;
    const tick = () => {
      frame++;
      setOut(
        text
          .split("")
          .map((c, i) =>
            c === " " ? " " : frame > i + 10 ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          )
          .join("")
      );
      if (frame < total) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [text]);

  useEffect(() => {
    if (inView) run();
  }, [inView, run]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <span ref={ref} className={className} onMouseEnter={hover ? run : undefined} aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  );
}
