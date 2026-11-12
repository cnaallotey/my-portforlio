"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  animate,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight, ArrowDown, GithubLogo, XLogo } from "@phosphor-icons/react";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import Scramble from "@/components/Scramble";
import BreakoutGame from "@/components/BreakoutGame";
import { Logo, type LogoName } from "@/components/TechLogos";
import { PROJECTS, type Project } from "@/data/projects";
import { ARTICLES, ARTICLE_COUNT, BLOG_URL } from "@/data/articles";

const EASE = [0.32, 0.72, 0, 1] as const;
const EMAIL = "charlesallotey1995@gmail.com";

// Every section uses this frame and a 4-column grid, so content lines up
// with the hairline columns drawn over the page.
const WRAP = "mx-auto w-full max-w-[1440px] px-5 md:px-10";

const NAV = [
  { name: "Work", href: "#work", count: PROJECTS.length },
  { name: "About", href: "#about" },
  { name: "Toolbox", href: "#stack" },
  { name: "Process", href: "#process" },
  { name: "Experience", href: "#experience" },
  { name: "Writing", href: "#writing", count: ARTICLE_COUNT },
  { name: "Contact", href: "#contact" },
];

const STACK: { name: string; logo: LogoName; kind: string }[] = [
  { name: "Vue 3", logo: "vuedotjs", kind: "Frontend" },
  { name: "Nuxt", logo: "nuxt", kind: "Frontend" },
  { name: "React", logo: "react", kind: "Frontend" },
  { name: "Next.js", logo: "nextdotjs", kind: "Frontend" },
  { name: "TypeScript", logo: "typescript", kind: "Language" },
  { name: "Tailwind", logo: "tailwindcss", kind: "Styling" },
  { name: "GSAP", logo: "gsap", kind: "Motion" },
  { name: "Node.js", logo: "nodedotjs", kind: "Backend" },
  { name: "Express", logo: "express", kind: "Backend" },
  { name: "Laravel", logo: "laravel", kind: "Backend" },
  { name: "PostgreSQL", logo: "postgresql", kind: "Data" },
  { name: "MongoDB", logo: "mongodb", kind: "Data" },
  { name: "Firebase", logo: "firebase", kind: "Platform" },
  { name: "Gemini API", logo: "googlegemini", kind: "AI" },
  { name: "Genkit", logo: "kit", kind: "AI" },
  { name: "Claude", logo: "claude", kind: "AI" },
  { name: "Cursor", logo: "cursor", kind: "Tools" },
  { name: "Figma", logo: "figma", kind: "Design" },
  { name: "Pinia", logo: "pinia", kind: "State" },
  { name: "Strapi", logo: "strapi", kind: "CMS" },
  { name: "Vercel", logo: "vercel", kind: "Hosting" },
  { name: "WebGL", logo: "webgl", kind: "Graphics" },
];

const PROCESS = [
  { tag: "Design", title: "Start from the problem", desc: "Not the template. Who is it for, what do they do today, and what would make them switch?" },
  { tag: "Build", title: "Typed, tested, fast", desc: "Vue or React, whatever fits the job. Clean APIs, sensible data, no magic." },
  { tag: "Ship", title: "Real users, early", desc: "Small releases in front of real people, then iterate on what they actually do." },
  { tag: "Run", title: "Launch is the start", desc: "Monitoring, upgrades and support long after the confetti settles." },
];

const EXPERIENCE = [
  {
    years: "2023—Now",
    role: "Web Developer",
    org: "Vue School",
    desc: "Internal tools and applications across the Vue/Nuxt stack, including affiliate and marketing tooling and course-supporting apps.",
  },
  {
    years: "2022—2025",
    role: "Frontend Mentor",
    org: "Thrive Program",
    desc: "Taught HTML, CSS, JavaScript and Vue through hands-on classes, codebase walkthroughs and team projects.",
  },
  {
    years: "2021—Now",
    role: "Full-Stack Dev",
    org: "Freelance",
    desc: "SaaS apps, e-commerce dashboards, registration systems and marketing sites, from Figma to deployment.",
  },
];

const SOCIALS = [
  { l: "GitHub", h: "https://github.com/cnaallotey" },
  { l: "X", h: "https://x.com/adotey_" },
  { l: "npm", h: "https://www.npmjs.com/package/@cnaallotey/auto-form-filler" },
  { l: "Email", h: `mailto:${EMAIL}` },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthYear = (iso: string) => {
  const [y, m] = iso.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
};

function useAccraTime() {
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
  return time ?? "--:--";
}

export default function Home() {
  const reduce = !!useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const onLoaded = useCallback(() => setLoaded(true), []);
  const [menu, setMenu] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Preloader onDone={onLoaded} />
      <Cursor />
      <GridLines />

      <motion.div aria-hidden style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-accent" />

      <MenuButton open={menu} onToggle={() => setMenu((m) => !m)} />
      <Menu open={menu} onClose={() => setMenu(false)} />
      <HirePill hidden={menu} />

      <main className="relative">
        <Hero reduce={reduce} loaded={loaded} />
        <About reduce={reduce} />
        <Work reduce={reduce} />
        <Stack reduce={reduce} />
        <Process reduce={reduce} />
        <Experience reduce={reduce} />
        <Writing reduce={reduce} />
        <Contact reduce={reduce} />
        <Play reduce={reduce} />
      </main>
    </div>
  );
}

/* ───────────────────────────── Primitives ───────────────────────────── */

function GridLines() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[45]">
      <div className={`${WRAP} h-full`}>
        <div className="grid h-full grid-cols-2 divide-x divide-[rgba(128,128,128,0.16)] border-x border-[rgba(128,128,128,0.16)] md:grid-cols-4">
          <span />
          <span />
          <span className="hidden md:block" />
          <span className="hidden md:block" />
        </div>
      </div>
    </div>
  );
}

function Label({ n, children, className = "" }: { n: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-wide ${className}`}>
      <span className="flex gap-[3px]" aria-hidden>
        <span className="h-2 w-2 bg-accent" />
        <span className="h-2 w-2 bg-accent/60" />
        <span className="h-2 w-2 bg-accent/30" />
      </span>
      <span>
        [ {n} — <span className="text-muted">{children}</span> ]
      </span>
    </p>
  );
}

// Full-width action bar: centred label, "+" on the right
function Bar({
  href,
  children,
  tone = "ink",
  external = false,
  cursor,
  className = "",
  type,
}: {
  href?: string;
  children: React.ReactNode;
  tone?: "ink" | "lime" | "white";
  external?: boolean;
  cursor?: string;
  className?: string;
  type?: "submit";
}) {
  const tones = {
    ink: "bg-ink text-cream hover:bg-accent hover:text-ink",
    lime: "bg-accent text-ink hover:bg-white",
    white: "bg-white text-ink hover:bg-accent",
  };
  const cls = `group grid h-14 w-full grid-cols-[1fr_auto_1fr] items-center px-6 font-mono text-[12px] font-medium uppercase tracking-wide transition-colors duration-300 ${tones[tone]} ${className}`;
  const inner = (
    <>
      <span />
      <span>{children}</span>
      <span className="justify-self-end text-lg leading-none transition-transform duration-300 group-hover:rotate-90">+</span>
    </>
  );
  if (type === "submit") {
    return (
      <button type="submit" data-cursor={cursor} className={cls}>
        {inner}
      </button>
    );
  }
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      data-cursor={cursor}
      className={cls}
    >
      {inner}
    </a>
  );
}

function MaskLines({
  lines,
  reduce,
  delay = 0,
  className = "",
}: {
  lines: React.ReactNode[];
  reduce: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.span
      className={`block ${className}`}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className="block"
            variants={{ hidden: { y: "110%" }, show: { y: "0%" } }}
            transition={{ duration: 1, ease: EASE, delay: delay + i * 0.08 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

function Reveal({
  children,
  reduce,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  reduce: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setVal(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {val}
      {suffix}
    </span>
  );
}

const H2 = "text-[clamp(2.9rem,5.2vw,5.4rem)] font-semibold leading-[0.92] tracking-[-0.06em]";

/* ───────────────────────────── Menu + floating bits ───────────────────────────── */

function MenuButton({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className="fixed right-3 top-3 z-[80] flex h-11 w-11 items-center justify-center bg-cream text-ink transition-colors hover:bg-accent md:right-5 md:top-4"
    >
      <span className={`absolute h-0.5 w-5 bg-ink transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
      <span className={`absolute h-0.5 bg-ink transition-all duration-500 ${open ? "w-5 -rotate-45" : "w-3 translate-x-[4px] translate-y-[4px]"}`} />
    </button>
  );
}

function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const time = useAccraTime();
  return (
    <motion.div
      initial={false}
      animate={{ clipPath: open ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 0.7, ease: EASE }}
      className="on-dark grain fixed inset-0 z-[75] overflow-y-auto"
      style={{ pointerEvents: open ? "auto" : "none" }}
      aria-hidden={!open}
    >
      <div className={`${WRAP} grid min-h-full grid-cols-1 content-between gap-12 py-24 md:grid-cols-4`}>
        <nav className="md:col-span-3">
          {NAV.map((l, i) => (
            <div key={l.name} className="overflow-hidden border-b border-line">
              <motion.a
                href={l.href}
                onClick={onClose}
                tabIndex={open ? 0 : -1}
                animate={{ y: open ? "0%" : "100%" }}
                transition={{ duration: 0.7, ease: EASE, delay: open ? 0.1 + i * 0.04 : 0 }}
                className="flex items-baseline gap-4 py-2 text-[clamp(2.6rem,6vw,5.5rem)] font-semibold leading-none tracking-[-0.06em] transition-colors hover:text-accent"
              >
                <span className="font-mono text-[11px] font-medium tracking-normal text-muted">0{i + 1}</span>
                {l.name}
                {l.count && <sup className="font-mono text-sm font-medium tracking-normal text-accent">{l.count}</sup>}
              </motion.a>
            </div>
          ))}
        </nav>
        <div className="space-y-6 font-mono text-[11px] uppercase text-muted md:self-end">
          <a href={`mailto:${EMAIL}`} tabIndex={open ? 0 : -1} className="block break-all text-base normal-case text-fg hover:text-accent">
            {EMAIL}
          </a>
          <p>Accra, Ghana · {time} GMT</p>
          <ul className="flex gap-4">
            {SOCIALS.slice(0, 3).map((s) => (
              <li key={s.l}>
                <a href={s.h} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} className="text-fg hover:text-accent">
                  {s.l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function HirePill({ hidden }: { hidden: boolean }) {
  return (
    <a
      href={`mailto:${EMAIL}`}
      className={`fixed bottom-3 right-3 z-[60] flex h-11 items-center gap-3 bg-ink px-4 font-mono text-[11px] font-medium uppercase text-cream shadow-[0_0_0_1px_rgba(237,237,237,0.12)] transition-[opacity,background-color] duration-300 hover:bg-[#1c1c1c] md:bottom-5 md:right-5 ${
        hidden ? "pointer-events-none opacity-0" : ""
      }`}
    >
      <span className="pulse h-2 w-2 rounded-full bg-accent" />
      Available · <span className="text-accent">Hire me</span>
    </a>
  );
}

/* ───────────────────────────── Hero ───────────────────────────── */

function Hero({ reduce, loaded }: { reduce: boolean; loaded: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const time = useAccraTime();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const wordY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-30%"]);

  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: loaded ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <section id="home" ref={ref} className="on-dark grain relative min-h-[100svh] overflow-hidden">
      {/* Portrait, faded into the dark at the edges */}
      <motion.div style={{ y: imgY }} className="absolute inset-x-0 bottom-0 top-0 mx-auto w-[min(96vw,820px)]">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 1.08 }}
          animate={loaded ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 1.6, ease: EASE }}
          className="relative h-full w-full [mask-image:radial-gradient(ellipse_58%_62%_at_50%_36%,#000_30%,transparent_74%)]"
        >
          <Image
            src="/portraits/hero.jpg"
            alt="Portrait of Charles Allotey"
            fill
            priority
            sizes="(max-width: 768px) 96vw, 820px"
            className="object-cover object-top opacity-70 grayscale contrast-[1.15]"
          />
        </motion.div>
      </motion.div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/70 to-transparent" />

      <div className={`${WRAP} relative z-10 flex min-h-[100svh] flex-col`}>
        {/* Nav */}
        <motion.header {...fade(0.05)} className="grid h-[4.5rem] grid-cols-2 items-center md:grid-cols-4">
          <a href="#home" className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center bg-accent font-mono text-[11px] font-semibold text-ink">CA</span>
            <span className="text-lg font-semibold tracking-[-0.04em]">allotey</span>
            <span className="ml-1 hidden bg-accent px-2 py-0.5 font-mono text-[10px] font-medium uppercase text-ink lg:inline">
              Open to work
            </span>
          </a>
          <nav className="col-span-2 hidden items-center justify-center gap-8 md:flex">
            {NAV.filter((l) => ["Work", "About", "Writing", "Contact"].includes(l.name)).map((l) => (
              <a key={l.name} href={l.href} className="font-mono text-[11px] font-medium uppercase tracking-wide transition-colors hover:text-accent">
                <Scramble text={l.name} hover />
                {l.count && <sup className="ml-0.5 text-accent">{l.count}</sup>}
              </a>
            ))}
          </nav>
        </motion.header>

        {/* Info rows */}
        <motion.div {...fade(0.15)} className="mt-6 font-mono text-[11px] font-medium uppercase tracking-wide">
          <div className="flex justify-between text-muted">
            <span>2020—{new Date().getFullYear() % 100}©</span>
            <span className="mr-14 flex items-center gap-2 md:mr-0">
              Accra <span className="text-fg tabular-nums">{time}</span> GMT
            </span>
          </div>
          <div className="mt-10 hidden grid-cols-4 md:grid">
            {["Products & SaaS", "Vue · React · Node", "AI in everything"].map((t, i) => (
              <span key={t}>
                <span className="text-muted">0{i + 1}.</span> {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Wordmark */}
        <div className="relative flex flex-1 items-center py-10">
          <motion.div style={{ y: wordY }} className="relative w-full">
            <h1
              aria-label="Charles Allotey"
              className="select-none text-center text-[29vw] font-semibold leading-[0.8] tracking-[-0.075em] text-cream md:text-[min(25vw,372px)]"
            >
              {"allotey".split("").map((c, i) => (
                <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom">
                  <motion.span
                    className="inline-block"
                    initial={reduce ? false : { y: "105%" }}
                    animate={loaded ? { y: "0%" } : undefined}
                    transition={{ duration: 1.1, ease: EASE, delay: 0.1 + i * 0.05 }}
                  >
                    {c}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p
              aria-hidden
              initial={reduce ? false : { opacity: 0, clipPath: "inset(0 100% 0 0)" }}
              animate={loaded ? { opacity: 1, clipPath: "inset(0 0% 0 0)" } : undefined}
              transition={{ duration: 1.4, ease: EASE, delay: 0.8 }}
              className="pointer-events-none absolute -bottom-[0.3em] right-[2%] -rotate-6 whitespace-nowrap font-script text-[7vw] leading-none text-accent md:text-[min(5.4vw,78px)]"
            >
              less talk, more shipping.
            </motion.p>
          </motion.div>
        </div>

        {/* Lead + CTA */}
        <motion.div {...fade(0.5)} className="grid grid-cols-1 items-end gap-8 pb-8 md:grid-cols-4 md:gap-0">
          <ul className="order-3 flex items-center gap-4 md:order-1">
            <li>
              <a href="https://x.com/adotey_" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-accent">
                <XLogo size={16} />
              </a>
            </li>
            <li>
              <a href="https://github.com/cnaallotey" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-accent">
                <GithubLogo size={17} />
              </a>
            </li>
            <li>
              <a href="https://www.npmjs.com/package/@cnaallotey/auto-form-filler" target="_blank" rel="noopener noreferrer" aria-label="npm" className="hover:text-accent">
                <Logo name="npm" className="h-4 w-4" />
              </a>
            </li>
            <li className="ml-2 font-mono text-[10px] font-medium uppercase leading-tight text-muted">
              Stay
              <br />
              connected
            </li>
          </ul>
          <div className="order-1 md:order-2 md:col-span-2 md:px-5">
            <p className="max-w-lg text-[17px] leading-snug md:text-lg">
              I build products people actually use. Full-stack developer at Vue School and the builder behind{" "}
              <a href="https://clientra.tech/" target="_blank" rel="noopener noreferrer" className="underline decoration-accent decoration-2 underline-offset-4">
                Clientra
              </a>
              .
            </p>
            <Bar href={`mailto:${EMAIL}`} tone="lime" className="mt-6" cursor="Write">
              Start a project
            </Bar>
          </div>
          <div className="order-2 flex gap-8 md:order-3 md:justify-end">
            {[
              { n: PROJECTS.length, l: "Products live" },
              { n: ARTICLE_COUNT, l: "Articles" },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-4xl font-semibold tracking-[-0.05em]">{s.n}</p>
                <p className="font-mono text-[10px] font-medium uppercase text-muted">{s.l}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Product strip */}
        <motion.ul {...fade(0.65)} className="grid grid-cols-3 border-t border-line md:grid-cols-6">
          {PROJECTS.map((p) => (
            <li key={p.slug}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 items-center justify-center gap-2 text-[15px] font-semibold tracking-[-0.03em] text-fg/70 transition-colors hover:text-accent"
              >
                <span className="h-1.5 w-1.5 bg-accent" />
                {p.title}
              </a>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/* ───────────────────────────── About ───────────────────────────── */

const BIO =
  "Five years of shipping for the web from Accra, Ghana. Vue and Nuxt are home, React and Next.js are my second language, and lately I'm building AI into everything I touch.";

function ScrollWords({ text, reduce }: { text: string; reduce: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="text-[clamp(1.9rem,3.4vw,3.5rem)] font-medium leading-[1.06] tracking-[-0.045em]">
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} reduce={reduce} accent={/AI|Accra|Vue|React/.test(w)}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  reduce,
  accent,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  reduce: boolean;
  accent: boolean;
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <>
      <motion.span style={reduce ? undefined : { opacity }} className={accent ? "bg-accent px-1.5 text-ink" : ""}>
        {children}
      </motion.span>{" "}
    </>
  );
}

function About({ reduce }: { reduce: boolean }) {
  return (
    <section id="about" className="on-white relative z-10">
      <div className={`${WRAP} grid grid-cols-1 gap-y-12 py-24 md:grid-cols-4 md:py-36`}>
        <div className="flex flex-col justify-between md:pr-6">
          <Label n="01">About</Label>
          <p className="mt-6 hidden font-mono text-[11px] font-medium uppercase md:block">Est. 2020</p>
        </div>
        <div className="md:col-span-3 md:pl-5">
          <ScrollWords text={BIO} reduce={reduce} />
        </div>
      </div>

      <div className={`${WRAP} grid grid-cols-1 border-t border-line md:grid-cols-4`}>
        <Reveal reduce={reduce} className="py-8 md:pr-5">
          <div className="group relative aspect-[4/5] overflow-hidden bg-card" data-cursor="Hi!">
            <Image
              src="/portraits/contact.jpg"
              alt="Charles Allotey smiling, arms crossed"
              fill
              sizes="(max-width: 768px) 90vw, 340px"
              // Anchored left so the crop drops the photo's corner watermark
              className="object-cover object-left-top grayscale transition-[filter,transform] duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
            />
          </div>
        </Reveal>
        <Reveal reduce={reduce} delay={0.06} className="flex flex-col justify-between gap-10 py-8 md:px-5">
          <p className="text-[15px] leading-relaxed text-muted">
            At Vue School I build the internal tools and apps used across the product. Outside it I run Clientra, a
            small studio where I design, build and run my own products and custom systems for clients.
          </p>
          <p className="text-[15px] leading-relaxed text-muted">
            I publish developer tools (hello, npm), mentor upcoming devs, and when I&apos;m off the clock you&apos;ll
            find me gaming and digging for good music.
          </p>
          <div>
            <p className="text-xl font-semibold leading-tight tracking-[-0.03em]">“Use code to put smiles on people&apos;s faces.”</p>
            <p className="mt-3 font-mono text-[11px] font-medium uppercase text-muted">The mission, since day one</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 border-line md:col-span-2 md:border-l">
          {[
            { n: 5, s: "+", l: "Years shipping" },
            { n: PROJECTS.length, s: "", l: "Products live" },
            { n: 76, s: "+", l: "Public repos" },
            { n: ARTICLE_COUNT, s: "", l: "Articles written" },
          ].map((s, i) => (
            <div key={s.l} className={`flex min-h-48 flex-col justify-between p-5 md:p-6 ${i < 2 ? "border-b border-line" : ""} ${i % 2 === 0 ? "border-r border-line" : ""}`}>
              <span className="font-mono text-[11px] font-medium uppercase text-muted">0{i + 1}</span>
              <div>
                <p className="text-[clamp(3.2rem,6vw,6rem)] font-semibold leading-none tracking-[-0.07em]">
                  <Counter to={s.n} suffix={s.s} />
                </p>
                <p className="mt-2 font-mono text-[11px] font-medium uppercase text-muted">{s.l}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Work ───────────────────────────── */

function ProjectEntry({ p, i, reduce }: { p: Project; i: number; reduce: boolean }) {
  return (
    <article className="border-b border-line py-14 first:pt-0 last:border-b-0 md:py-20">
      <Reveal reduce={reduce}>
        <div className="flex items-baseline justify-between gap-4 font-mono text-[11px] font-medium uppercase">
          <span>
            {String(i + 1).padStart(3, "0")} / <span className="text-muted">{p.kind}</span>
          </span>
          <a href={p.href} target="_blank" rel="noopener noreferrer" className="hidden text-muted transition-colors hover:text-accent sm:inline">
            {p.domain} ↗
          </a>
        </div>
        <h3 className="mt-4 text-[clamp(2.6rem,4.8vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.06em]">{p.title}</h3>
      </Reveal>

      <a href={p.href} target="_blank" rel="noopener noreferrer" data-cursor="Open" className="group mt-8 block">
        <div className="relative aspect-[16/10] overflow-hidden bg-card">
          <Image
            src={p.image}
            alt={`${p.title} homepage`}
            fill
            sizes="(max-width: 768px) 92vw, 72vw"
            className="object-cover object-top transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.03]"
          />
        </div>
      </a>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <p className="max-w-xl text-[15px] leading-relaxed text-muted">{p.blurb}</p>
          <a
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase transition-colors hover:text-accent"
          >
            Visit site <ArrowUpRight size={13} weight="bold" />
          </a>
        </div>
        <ul className="flex flex-wrap content-start gap-1.5 sm:justify-end">
          {p.tags.map((t) => (
            <li key={t} className="border border-line px-2.5 py-1.5 font-mono text-[10px] font-medium uppercase">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function Work({ reduce }: { reduce: boolean }) {
  return (
    <section id="work" className="on-dark relative z-10">
      <div className={`${WRAP} grid grid-cols-1 md:grid-cols-4`}>
        <div className="py-24 md:pr-6 md:py-36">
          <div className="md:sticky md:top-24">
            <Label n="02">Selected work</Label>
            <h2 className={`mt-8 ${H2}`}>
              <MaskLines reduce={reduce} lines={["Six", "products.", <span key="c" className="text-accent">All live.</span>]} />
            </h2>
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-muted">
              Things I design, build and run under Clientra. Not mockups, not a side-project graveyard.
            </p>
            <p className="mt-14 font-mono text-[11px] font-medium uppercase">Have one in mind?</p>
            <p className="mb-5 text-[15px] text-muted">Let&apos;s make it number seven.</p>
            <Bar href={`mailto:${EMAIL}`} tone="lime" cursor="Write">
              Discuss your project
            </Bar>
          </div>
        </div>
        <div className="pb-16 md:col-span-3 md:py-36 md:pl-5">
          {PROJECTS.map((p, i) => (
            <ProjectEntry key={p.slug} p={p} i={i} reduce={reduce} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Toolbox ───────────────────────────── */

function Stack({ reduce }: { reduce: boolean }) {
  return (
    <section id="stack" className="on-light relative z-10">
      <div className={`${WRAP} grid grid-cols-1 md:grid-cols-4`}>
        <div className="py-24 md:pr-6 md:py-36">
          <div className="md:sticky md:top-24">
            <Label n="03">Toolbox</Label>
            <h2 className={`mt-8 ${H2}`}>
              <MaskLines reduce={reduce} lines={["Tools of", "the trade."]} />
            </h2>
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-muted">
              What I reach for, from the first commit to production. {STACK.length} tools, one goal: ship it well.
            </p>
          </div>
        </div>
        <div className="pb-24 md:col-span-3 md:py-36 md:pl-5">
          <ul className="grid grid-cols-2 border-l border-t border-line sm:grid-cols-3">
            {STACK.map((s, i) => (
              <motion.li
                key={s.name}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.05 }}
                className="group flex aspect-[4/3] flex-col justify-between border-b border-r border-line bg-card md:aspect-[16/10] p-4 transition-colors duration-300 hover:bg-accent md:p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <Logo name={s.logo} className="h-7 w-7 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 md:h-8 md:w-8" />
                  <span className="font-mono text-[10px] font-medium uppercase text-muted group-hover:text-ink/60">{s.kind}</span>
                </div>
                <p className="text-lg font-semibold tracking-[-0.04em] group-hover:text-ink md:text-2xl">{s.name}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Process ───────────────────────────── */

function Process({ reduce }: { reduce: boolean }) {
  return (
    <section id="process" className="on-white relative z-10">
      <div className={`${WRAP} grid grid-cols-1 py-24 md:grid-cols-4 md:py-36`}>
        <div className="flex flex-col justify-between gap-10 md:pr-6">
          <div>
            <Label n="04">Process</Label>
            <h2 className={`mt-8 ${H2}`}>
              <MaskLines reduce={reduce} lines={["From brief", "to launch."]} />
            </h2>
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-muted">
              From the first rough sketch to a tested product in production, without the bloated discovery phase.
            </p>
          </div>
          <p className="max-w-xs text-xl font-semibold leading-tight tracking-[-0.03em]">
            I don&apos;t jump into solutions. I listen, then build the thing that moves the needle.
          </p>
        </div>

        <Reveal reduce={reduce} className="mt-12 md:mt-0 md:px-5">
          <div className="relative h-full min-h-80 overflow-hidden bg-card">
            <Image
              src="/portraits/workspace.jpg"
              alt="Charles working at his desk"
              fill
              sizes="(max-width: 768px) 90vw, 340px"
              className="object-cover grayscale"
            />
          </div>
        </Reveal>

        <ol className="mt-12 grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 md:col-span-2 md:mt-0">
          {PROCESS.map((s, i) => {
            const dark = i === 0;
            return (
              <motion.li
                key={s.tag}
                initial={reduce ? false : { opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.9, ease: EASE, delay: i * 0.06 }}
                className={`flex min-h-72 flex-col justify-between border-b border-r border-line p-6 ${dark ? "bg-ink text-cream" : "bg-card"}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`grid h-9 w-9 place-items-center font-mono text-[11px] font-medium ${dark ? "bg-accent text-ink" : "bg-white text-ink shadow-[0_0_0_1px_var(--line)]"}`}>
                    0{i + 1}.
                  </span>
                  <span className="font-mono text-[11px] font-medium uppercase">{s.tag}</span>
                </div>
                <div>
                  <p className="text-2xl font-semibold leading-tight tracking-[-0.04em]">{s.title}</p>
                  <p className={`mt-3 text-[14px] leading-relaxed ${dark ? "text-cream/60" : "text-muted"}`}>{s.desc}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ───────────────────────────── Experience ───────────────────────────── */

function Experience({ reduce }: { reduce: boolean }) {
  return (
    <section id="experience" className="on-dark relative z-10">
      <div className={`${WRAP} grid grid-cols-1 py-24 md:grid-cols-4 md:py-36`}>
        <div className="md:pr-6">
          <Label n="05">Experience</Label>
          <h2 className={`mt-8 ${H2}`}>
            <MaskLines reduce={reduce} lines={["Where", "I've been."]} />
          </h2>
        </div>
        <ul className="mt-12 border-t border-line md:col-span-3 md:mt-0">
          {EXPERIENCE.map((e, i) => (
            <motion.li
              key={e.org}
              initial={reduce ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.9, ease: EASE, delay: i * 0.06 }}
              className="group grid grid-cols-1 gap-3 border-b border-line py-8 transition-colors duration-300 hover:bg-card sm:grid-cols-3 md:py-10"
            >
                <div className="md:pl-5">
                  <p className="font-mono text-[11px] font-medium uppercase text-muted">{e.years}</p>
                  <p className="mt-1 font-mono text-[11px] font-medium uppercase text-accent">{e.org}</p>
                </div>
                <h3 className="text-3xl font-semibold leading-none tracking-[-0.05em] transition-transform duration-500 ease-out-expo group-hover:translate-x-2 md:text-4xl">
                  {e.role}
                </h3>
                <p className="text-[14px] leading-relaxed text-muted md:pr-5">{e.desc}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────────── Writing ───────────────────────────── */

function Writing({ reduce }: { reduce: boolean }) {
  return (
    <section id="writing" className="on-light relative z-10">
      <div className={`${WRAP} grid grid-cols-1 gap-y-10 pt-24 md:grid-cols-4 md:pt-36`}>
        <div className="md:pr-6">
          <Label n="06">Writing</Label>
          <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-muted">
            Guides, migrations and deep dives on Mastering Nuxt. A few favourites.
          </p>
        </div>
        <h2 className="text-[clamp(3.6rem,8vw,8rem)] font-semibold leading-[0.85] tracking-[-0.07em] md:col-span-2 md:px-5">
          <MaskLines reduce={reduce} lines={["Articles."]} />
        </h2>
        <div className="md:pl-5 md:text-right">
          <p className="text-[clamp(3rem,5vw,5rem)] font-semibold leading-none tracking-[-0.07em]">{ARTICLE_COUNT}</p>
          <p className="font-mono text-[11px] font-medium uppercase text-muted">Published so far</p>
        </div>
      </div>

      <div className={`${WRAP} mt-16 md:mt-20`}>
        <ul className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 md:grid-cols-4">
          {ARTICLES.map((a, i) => (
            <motion.li
              key={a.href}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5% 0px" }}
              transition={{ duration: 0.8, ease: EASE, delay: (i % 4) * 0.06 }}
              className="border-b border-r border-line"
            >
              <a href={a.href} target="_blank" rel="noopener noreferrer" data-cursor="Read" className="group flex h-full flex-col bg-card">
                <div className="grain relative flex aspect-[4/3] flex-col justify-between overflow-hidden bg-ink p-5 text-cream transition-colors duration-500 group-hover:bg-accent group-hover:text-ink">
                  <span className="relative z-[2] font-mono text-[11px] font-medium">{String(i + 1).padStart(2, "0")}</span>
                  <span className="relative z-[2] text-[clamp(2rem,3vw,2.6rem)] font-semibold leading-none tracking-[-0.06em]">{a.topic}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="font-mono text-[10px] font-medium uppercase text-muted">
                    <time dateTime={a.date}>{monthYear(a.date)}</time> · {a.topic}
                  </p>
                  <h3 className="mt-3 text-[17px] font-semibold leading-snug tracking-[-0.02em]">{a.title}</h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-muted">{a.blurb}</p>
                </div>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className={`${WRAP} grid grid-cols-1 pb-24 md:grid-cols-4 md:pb-36`}>
        <div className="md:col-span-2 md:col-start-2">
          <Bar href={BLOG_URL} external>
            Read all on Mastering Nuxt
          </Bar>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Contact + footer ───────────────────────────── */

// No backend: the form drafts an email in the visitor's own mail app
function ContactForm() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const from = String(f.get("email") ?? "").trim();
    const message = String(f.get("message") ?? "").trim();
    const subject = `Project enquiry${name ? ` from ${name}` : ""}`;
    const body = `${message}\n\n— ${name}${from ? ` (${from})` : ""}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const field =
    "w-full border-b border-line bg-transparent py-4 text-[15px] text-fg outline-none transition-colors placeholder:text-muted focus:border-accent";
  return (
    <form onSubmit={onSubmit} className="space-y-1">
      <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
        <label className="tick block">
          <span className="sr-only">Your name</span>
          <input name="name" required autoComplete="name" placeholder="Your name" className={field} />
        </label>
        <label className="tick block">
          <span className="sr-only">Your email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={field} />
        </label>
      </div>
      <label className="tick block">
        <span className="sr-only">Message</span>
        <textarea name="message" required rows={4} placeholder="Tell me about the thing you want to build" className={`${field} resize-none`} />
      </label>
      <div className="pt-6">
        <Bar type="submit" tone="white" cursor="Send">
          Start a conversation
        </Bar>
      </div>
    </form>
  );
}

function Contact({ reduce }: { reduce: boolean }) {
  const time = useAccraTime();
  return (
    <section id="contact" className="on-dark grain relative z-10 overflow-hidden">
      <div className={`${WRAP} relative z-[2] grid grid-cols-1 gap-y-14 py-24 md:grid-cols-4 md:py-36`}>
        <div className="flex flex-col justify-between gap-10 md:pr-6">
          <div>
            <Label n="07">Contact</Label>
            <a href={`mailto:${EMAIL}`} className="mt-8 block break-all text-xl font-semibold tracking-[-0.03em] transition-colors hover:text-accent">
              {EMAIL}
            </a>
            <p className="mt-2 text-[15px] text-muted">Accra, Ghana</p>
          </div>
          <div className="space-y-6 font-mono text-[11px] font-medium uppercase">
            <div>
              <p className="text-muted">Socials</p>
              <ul className="mt-3 flex gap-4">
                {SOCIALS.slice(0, 3).map((s) => (
                  <li key={s.l}>
                    <a href={s.h} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                      {s.l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <p>
              <span className="text-muted">Local time</span> {time} GMT
            </p>
          </div>
        </div>

        <div className="md:col-span-2 md:px-5">
          <h2 className={H2}>
            <MaskLines reduce={reduce} lines={["Got something", <span key="b">to <span className="text-accent">build?</span></span>]} />
          </h2>
          <div className="mt-10">
            <ContactForm />
          </div>
        </div>

        <div className="font-mono text-[11px] font-medium uppercase md:pl-5 md:text-right">
          <p className="text-muted">Open to</p>
          <ul className="mt-3 space-y-1.5">
            <li>Freelance builds</li>
            <li>Contracts</li>
            <li>Product partnerships</li>
          </ul>
        </div>
      </div>

      <footer className={`${WRAP} relative z-[2] border-t border-line`}>
        <div className="grid grid-cols-2 gap-y-10 py-14 font-mono text-[11px] font-medium uppercase md:grid-cols-4">
          <FooterCol title="Navigation" links={NAV.map((n) => ({ l: n.name, h: n.href }))} />
          <FooterCol title="Products" links={PROJECTS.map((p) => ({ l: p.title, h: p.href, ext: true }))} />
          <FooterCol title="Elsewhere" links={SOCIALS.map((s) => ({ l: s.l, h: s.h, ext: !s.h.startsWith("mailto") }))} />
          <div className="md:text-right">
            <p className="text-muted">Est. 2020</p>
            <p className="mt-3">Built with Next.js</p>
          </div>
        </div>

        <div className="relative">
          <p aria-hidden className="select-none pb-[0.2em] text-center text-[29vw] font-semibold leading-[0.78] tracking-[-0.075em] md:text-[min(25vw,372px)]">
            allotey
          </p>
          <p aria-hidden className="pointer-events-none absolute bottom-[22%] right-[4%] -rotate-6 font-script text-[7vw] leading-none text-accent md:text-[min(5vw,72px)]">
            built in accra.
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-line py-6 font-mono text-[11px] font-medium uppercase sm:flex-row sm:items-center sm:justify-between">
          <span className="text-muted">© {new Date().getFullYear()} Charles Nii Adotey Allotey</span>
          <a href="#play" className="inline-flex items-center gap-2 hover:text-accent">
            Wait, there&apos;s a game <ArrowDown size={12} className="animate-bounce" />
          </a>
        </div>
      </footer>
    </section>
  );
}

function FooterCol({ title, links }: { title: string; links: { l: string; h: string; ext?: boolean }[] }) {
  return (
    <div>
      <p className="mb-4 text-muted">{title}</p>
      <ul className="space-y-2">
        {links.map((x) => (
          <li key={x.l}>
            <a
              href={x.h}
              target={x.ext ? "_blank" : undefined}
              rel={x.ext ? "noopener noreferrer" : undefined}
              className="transition-colors hover:text-accent"
            >
              {x.l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────────────────────── Play (under the footer) ───────────────────────────── */

function Play({ reduce }: { reduce: boolean }) {
  return (
    <section id="play" className="on-dark relative z-10 bg-black pb-16 pt-24 md:pb-24 md:pt-32">
      <div className={`${WRAP} grid grid-cols-1 gap-y-10 md:grid-cols-4`}>
        <div className="md:pr-6">
          <Label n="08">Bonus level</Label>
          <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-muted">
            Every brick is something I build with. Smash them all and you&apos;ve earned an email.
          </p>
        </div>
        <h2 className={`${H2} md:col-span-3 md:pl-5`}>
          <MaskLines reduce={reduce} lines={["Still here?", <span key="b" className="text-accent">Play a round.</span>]} />
        </h2>
        <div className="md:col-span-4">
          <BreakoutGame />
          <p className="mt-10 text-center font-mono text-[11px] font-medium uppercase text-muted">
            You reached the very bottom. Respect.
          </p>
        </div>
      </div>
    </section>
  );
}
