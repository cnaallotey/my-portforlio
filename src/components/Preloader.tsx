"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";

const CURTAIN = [0.76, 0, 0.24, 1] as const;

const BOOT = [
  "CA-OS BIOS v2.6 (c) Accra, GH",
  "Memory test ........ 640K OK",
  "Mounting /clientra .. OK",
  "Found 6 apps, all live",
  "Waking the dog ...... woof",
];

// Boot screen: log lines tick in while a block bar fills, then the
// screen wipes upward.
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
      duration: 1.6,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        timer = window.setTimeout(finish, 260);
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

  const lines = Math.min(BOOT.length, Math.floor(count / 18) + 1);
  const blocks = 24;
  const filled = Math.round((count / 100) * blocks);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-5 text-cream md:p-10"
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 0.8, ease: CURTAIN }}
        >
          <div className="space-y-1.5 font-pixel text-[11px] uppercase text-cream/70 md:text-[13px]">
            {BOOT.slice(0, lines).map((l, i) => (
              <p key={l} className={i === lines - 1 ? "text-cream" : ""}>
                {l}
                {i === lines - 1 && <span className="blink ml-1 inline-block h-[0.9em] w-[0.55em] translate-y-[0.1em] bg-accent" />}
              </p>
            ))}
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex gap-1" aria-hidden>
              {Array.from({ length: blocks }, (_, i) => (
                <span key={i} className={`h-4 w-2 md:h-5 md:w-3 ${i < filled ? "bg-accent" : "bg-cream/10"}`} />
              ))}
            </div>
            <span className="font-dots text-[28vw] font-black leading-[0.75] tabular-nums md:text-[14vw]">
              {String(count).padStart(3, "0")}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
