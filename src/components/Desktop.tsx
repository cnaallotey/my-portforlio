"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Pixels, PixelDog, ICONS } from "./PixelArt";
import { PROJECTS, type Project } from "@/data/projects";

// CA-OS: a tiny retro desktop where every app icon is a shipped product.
// Windows open, focus, drag by the title bar and close; the dog walks.

type WinId = "readme" | Project["slug"];

const MENU = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
];

function Clock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Accra", hour: "2-digit", minute: "2-digit" });
    const tick = () => setTime(fmt.format(new Date()));
    const raf = requestAnimationFrame(tick);
    const id = window.setInterval(tick, 20_000);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(id);
    };
  }, []);
  return (
    <span className="tabular-nums">
      Accra {time ?? "--:--"}
    </span>
  );
}

function Window({
  title,
  z,
  constraints,
  className,
  style,
  onFocus,
  onClose,
  children,
}: {
  title: string;
  z: number;
  constraints: React.RefObject<HTMLDivElement | null>;
  className: string;
  style?: React.CSSProperties;
  onFocus: () => void;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const controls = useDragControls();
  return (
    <motion.div
      role="dialog"
      aria-label={title}
      drag
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0.06}
      dragConstraints={constraints}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
      onPointerDown={onFocus}
      style={{ zIndex: z, ...style }}
      className={`absolute flex max-h-[86%] flex-col border-2 border-cream bg-[#1B1814] text-cream shadow-[6px_6px_0_rgba(0,0,0,0.5)] ${className}`}
    >
      <div
        onPointerDown={(e) => controls.start(e)}
        className="flex h-7 shrink-0 touch-none select-none items-center gap-2 border-b-2 border-cream px-1.5"
      >
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onClose}
          aria-label={`Close ${title}`}
          className="h-3.5 w-3.5 shrink-0 border-2 border-cream transition-colors hover:bg-accent"
        />
        <span className="title-stripes h-[9px] flex-1" />
        <span className="font-pixel text-[11px] uppercase leading-none">{title}</span>
        <span className="title-stripes h-[9px] flex-1" />
      </div>
      <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto">
        {children}
      </div>
    </motion.div>
  );
}

function DesktopIcon({
  icon,
  label,
  onClick,
  href,
}: {
  icon: keyof typeof ICONS;
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const inner = (
    <>
      <Pixels rows={ICONS[icon]} className="h-10 w-10 transition-transform duration-200 group-hover:-translate-y-0.5 sm:h-12 sm:w-12 md:h-14 md:w-14" />
      <span className="px-1 py-px font-pixel text-[10px] leading-tight text-cream group-hover:bg-accent group-hover:text-ink group-focus-visible:bg-accent group-focus-visible:text-ink">
        {label}
      </span>
    </>
  );
  const cls = "group flex w-[84px] flex-col items-center gap-1.5 outline-none sm:w-[92px] md:w-[104px]";
  return href ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export default function Desktop() {
  const screenRef = useRef<HTMLDivElement>(null);
  const [wins, setWins] = useState<WinId[]>(["readme"]);

  const open = (id: WinId) => setWins((w) => [...w.filter((x) => x !== id), id]);
  const close = (id: WinId) => setWins((w) => w.filter((x) => x !== id));

  // Wider screens have room for a product window behind the readme
  useEffect(() => {
    if (!window.matchMedia("(min-width: 640px)").matches) return;
    const raf = requestAnimationFrame(() => setWins((w) => (w.length === 1 && w[0] === "readme" ? ["formdrop", "readme"] : w)));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="notch notch-lg relative bg-surface-elevated p-2.5 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.7)] sm:p-4">
      <div className="mb-2 flex items-center justify-between px-1 font-pixel text-[10px] uppercase text-text-muted">
        <span>CA-OS v2.6</span>
        <span className="hidden sm:inline">6 apps · all live</span>
        <span className="flex items-center gap-1.5">
          <span className="blink h-1.5 w-1.5 bg-accent" />
          On air
        </span>
      </div>

      <div
        ref={screenRef}
        className="dither @container relative aspect-[2/3] overflow-hidden border-2 border-black/60 [--os-fill:#2B2721] [--os-line:#F0E8DA] sm:aspect-[16/10]"
      >
        {/* Menu bar */}
        <div className="relative z-[60] flex h-7 items-center justify-between border-b-2 border-cream bg-[#1B1814] px-2 font-pixel text-[11px] uppercase text-cream">
          <div className="flex items-center gap-1">
            <span className="mr-2 flex items-center gap-1.5">
              <span className="h-3 w-3 bg-accent" />
              CA-OS
            </span>
            {MENU.map((m) => (
              <a key={m.label} href={m.href} className="hidden px-1.5 hover:bg-cream hover:text-ink sm:inline">
                {m.label}
              </a>
            ))}
          </div>
          <Clock />
        </div>

        {/* Icons */}
        <div className="absolute inset-x-0 top-10 grid grid-cols-3 justify-items-center gap-y-3 px-2 sm:left-auto sm:right-3 sm:top-12 sm:gap-x-1 sm:gap-y-5 md:gap-y-7">
          {PROJECTS.map((p) => (
            <DesktopIcon key={p.slug} icon={p.slug} label={p.title} onClick={() => open(p.slug)} />
          ))}
          <DesktopIcon icon="readme" label="Readme.txt" onClick={() => open("readme")} />
          <DesktopIcon icon="mail" label="Mail" href="mailto:charlesallotey1995@gmail.com" />
          <DesktopIcon icon="play" label="Play.exe" href="#play" />
        </div>

        {/* Windows */}
        <AnimatePresence>
          {wins.map((id, order) => {
            const z = 20 + order;
            if (id === "readme") {
              return (
                <Window
                  key={id}
                  title="Readme.txt"
                  z={z}
                  constraints={screenRef}
                  onFocus={() => open(id)}
                  onClose={() => close(id)}
                  className="left-[3%] top-[54%] w-[94%] sm:left-[38%] sm:top-[50%] sm:w-[34%]"
                >
                  <div className="space-y-3 p-4 font-mono text-[12px] leading-relaxed text-cream/75">
                    <p className="font-serif text-[1.65rem] leading-none text-cream">Hi, I&apos;m Charles.</p>
                    <p className="hidden sm:block">
                      Everything on this desktop is something I built. Each one is live on the internet right now.
                    </p>
                    <ul className="space-y-0.5 text-cream/60">
                      <li>→ Click an icon to open a product.</li>
                      <li className="hidden sm:list-item">→ Drag windows by the title bar.</li>
                      <li>→ The dog is friendly.</li>
                    </ul>
                  </div>
                </Window>
              );
            }
            const k = PROJECTS.findIndex((p) => p.slug === id);
            const p = PROJECTS[k];
            return (
              <Window
                key={id}
                title={`${p.title}.app`}
                z={z}
                constraints={screenRef}
                onFocus={() => open(id)}
                onClose={() => close(id)}
                className="left-[3%] top-[var(--ym)] w-[94%] sm:left-[var(--x)] sm:top-[var(--y)] sm:w-[min(500px,60%)]"
                style={{ "--x": `${4 + k * 5}%`, "--y": `${8 + k * 3.5}%`, "--ym": `${7 + k * 2}%` } as React.CSSProperties}
              >
                <div className="relative aspect-[16/10] border-b-2 border-cream bg-black">
                  <Image src={p.image} alt={`${p.title} homepage`} fill sizes="(max-width: 640px) 90vw, 500px" className="object-cover object-top" />
                </div>
                <div className="space-y-2.5 p-4">
                  <p className="font-pixel text-[10px] uppercase text-accent">{p.kind}</p>
                  <h3 className="font-serif text-3xl leading-none">{p.title}</h3>
                  <p className="font-mono text-[12px] leading-relaxed text-cream/70">{p.blurb}</p>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="notch inline-flex items-center gap-2 bg-accent px-3 py-2 font-pixel text-[11px] uppercase text-ink transition-transform active:translate-y-px"
                  >
                    Open {p.domain}
                    <ArrowUpRight size={13} weight="bold" />
                  </a>
                </div>
              </Window>
            );
          })}
        </AnimatePresence>

        {/* The dog (DummyPet cameo) */}
        <button
          type="button"
          onClick={() => open("dummypet")}
          aria-label="Pat the dog (opens DummyPet)"
          className="dog-walk absolute bottom-2 left-0 z-10 h-[24px] w-[44px] sm:bottom-3 sm:h-[36px] sm:w-[66px]"
        >
          <PixelDog className="h-full w-full" />
        </button>

        {/* Glass: scanlines + vignette */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[70] bg-[repeating-linear-gradient(to_bottom,rgba(0,0,0,0.16)_0_1px,transparent_1px_3px)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[70] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.45))]" />
      </div>

      <div className="mt-2 flex items-center justify-between px-1">
        <span className="font-pixel text-[10px] uppercase text-text-faint">Clientra</span>
        <span className="flex gap-1" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="h-1 w-4 bg-border-strong" />
          ))}
        </span>
      </div>
    </div>
  );
}
