"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Blend-mode dot + trailing ring. Anything with data-cursor="Label"
// turns the ring into a lime label bubble; links/buttons just grow it.
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.5 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;
    const raf = requestAnimationFrame(() => setEnabled(true));
    document.documentElement.classList.add("has-cursor");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as Element | null;
      setHidden(!!t?.closest?.("[data-cursor-hide]"));
      const labelled = t?.closest?.("[data-cursor]") as HTMLElement | null;
      setLabel(labelled?.dataset.cursor ?? null);
      setHovering(!!t?.closest?.("a, button"));
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    const onLeave = () => setHidden(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  const size = label ? 92 : hovering ? 64 : 38;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference"
        style={{ x, y, opacity: hidden || label ? 0 : 1 }}
      />
      <motion.div
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-[199] flex items-center justify-center rounded-full ${
          label ? "bg-accent" : "border border-white mix-blend-difference"
        }`}
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: size, height: size, opacity: hidden ? 0 : 1, scale: down ? 0.8 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        {label && (
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-[#0A0A0B]">{label}</span>
        )}
      </motion.div>
    </>
  );
}
