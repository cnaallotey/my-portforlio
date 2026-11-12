"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";

const CURTAIN = [0.76, 0, 0.24, 1] as const;

// Counter on a grainy black sheet, then the sheet lifts away
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const raf = requestAnimationFrame(() => {
        setShow(false);
        onDone();
      });
      return () => cancelAnimationFrame(raf);
    }
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = "hidden";
    let timer = 0;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setShow(false);
      onDone();
      document.documentElement.style.overflow = "";
    };
    const controls = animate(0, 100, {
      duration: 1.5,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        timer = window.setTimeout(finish, 200);
      },
    });
    // Safety net: never trap the visitor if animation frames are starved
    const failsafe = window.setTimeout(finish, 4000);
    return () => {
      controls.stop();
      window.clearTimeout(timer);
      window.clearTimeout(failsafe);
      document.documentElement.style.overflow = "";
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="sheet"
          className="grain fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-5 text-cream md:p-10"
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 0.8, ease: CURTAIN }}
        >
          <div className="flex justify-between font-mono text-[11px] uppercase tracking-wide text-cream/60">
            <span>Charles Allotey</span>
            <span>Portfolio 2020—{new Date().getFullYear() % 100}©</span>
          </div>
          <div className="flex items-end justify-between gap-6">
            <span className="font-script text-3xl text-accent md:text-5xl">loading…</span>
            <span className="text-[30vw] font-semibold leading-[0.75] tracking-[-0.07em] tabular-nums md:text-[17vw]">
              {count}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-accent" style={{ width: `${count}%` }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
