"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";

const CURTAIN = [0.76, 0, 0.24, 1] as const;

// 0 → 100 counter, then a double curtain (ink, then lime) wipes upward
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
      duration: 1.7,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        timer = window.setTimeout(finish, 220);
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
          key="lime"
          className="fixed inset-0 z-[99] bg-accent"
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 0.9, ease: CURTAIN, delay: 0.12 }}
        />
      )}
      {show && (
        <motion.div
          key="ink"
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#0A0A0B] p-5 text-[#EDEDEA] md:p-10"
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 0.8, ease: CURTAIN }}
        >
          <div className="flex justify-between font-mono text-[11px] uppercase tracking-[0.1em] text-[#85857F]">
            <span>Charles Allotey</span>
            <span>Portfolio ©{new Date().getFullYear()}</span>
          </div>
          <div className="flex items-end justify-between gap-6">
            <div className="overflow-hidden">
              <motion.p
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: CURTAIN, delay: 0.1 }}
                className="font-display text-xl md:text-4xl"
              >
                Loading something <span className="italic text-accent">loud</span>
              </motion.p>
            </div>
            <span className="font-display text-[26vw] font-semibold leading-[0.78] tracking-[-0.06em] tabular-nums md:text-[15vw]">
              {count}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-accent" style={{ width: `${count}%` }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
