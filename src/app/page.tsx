"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  motion,
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useMotionValueEvent,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { ArrowUpRight, ArrowDown, Moon, Sun, Asterisk } from "@phosphor-icons/react";
import ContourField from "@/components/ContourField";
import PlasmaHero from "@/components/PlasmaHero";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import VelocityMarquee from "@/components/VelocityMarquee";
import Scramble from "@/components/Scramble";
import BreakoutGame from "@/components/BreakoutGame";

const EASE = [0.32, 0.72, 0, 1] as const;
const BOUNCE = { type: "spring", stiffness: 420, damping: 14 } as const;

const NAV = [
  { name: "Work", href: "#work" },
  { name: "About", href: "#about" },
  { name: "Stack", href: "#stack" },
  { name: "Experience", href: "#experience" },
  { name: "Play", href: "#play" },
];

const PROJECTS = [
  {
    title: "FormDrop",
    blurb: "AI-powered forms backend built on the Google Gemini API.",
    tags: ["Next.js", "Firebase", "Gemini"],
    kind: "AI Product",
    image: "/projects/formdrop2.png",
    href: "https://formdrop-one.vercel.app",
  },
  {
    title: "Auto Form Filler",
    blurb: "Open-source npm library that fills forms from URL query params.",
    tags: ["TypeScript", "npm"],
    kind: "Open Source",
    image: "/projects/auto_form_filler.png",
    href: "https://www.npmjs.com/package/@cnaallotey/auto-form-filler",
  },
  {
    title: "Nuxt JWT Auth",
    blurb: "From-scratch JWT auth for Nuxt 3: tokens, refresh flow, protected routes.",
    tags: ["Nuxt 3", "TypeScript", "JWT"],
    kind: "Most-starred",
    image: "/projects/nuxt_jwt_auth.png",
    href: "https://github.com/cnaallotey/nuxt-jwt-auth",
  },
  {
    title: "Community Chat",
    blurb: "Real-time community chat with live message sync.",
    tags: ["Nuxt", "Socket.io", "Node.js"],
    kind: "Realtime",
    image: "/projects/community_chat.png",
    href: "https://community-chat-lbn6.onrender.com/",
  },
  {
    title: "Kpashi",
    blurb: "E-commerce storefront with full product and order management.",
    tags: ["Nuxt 3", "Node.js", "PostgreSQL"],
    kind: "E-commerce",
    image: "/projects/kpashi.png",
    href: "https://github.com/cnaallotey",
  },
  {
    title: "Nouvelle Maison",
    blurb: "Luxury real-estate listings platform with an admin console.",
    tags: ["Next.js", "Firebase"],
    kind: "SaaS",
    image: "/projects/nm-app.png",
    href: "https://nouvelle-maison-application-nu.vercel.app",
  },
];

const ARCHIVE = [
  { title: "VisoRegistry", kind: "AI registration engine", href: "https://visoregistry.vercel.app" },
  { title: "Ignite AI", kind: "AI app on Nuxt", href: "https://ignite-ai-psi.vercel.app" },
  { title: "Component Builder", kind: "Developer tool", href: "https://github.com/cnaallotey" },
  { title: "EazzySocial", kind: "Social media SaaS", href: "https://github.com/cnaallotey" },
  { title: "Client sites", kind: "Werkbuddy · Miles Mobility · Vida Dzakumah", href: "https://github.com/cnaallotey" },
];

const STACK = [
  "Vue 3", "Nuxt", "React", "Next.js", "TypeScript", "Tailwind", "GSAP", "Node.js",
  "Express", "Laravel", "PostgreSQL", "MongoDB", "Firebase", "Gemini API", "Genkit",
  "Claude", "Cursor", "Figma", "Pinia", "Strapi", "Vercel", "WebGL",
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

// Deterministic pseudo-random so server and client agree
const seeded = (i: number) => {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

export default function Home() {
  const reduce = !!useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const onLoaded = useCallback(() => setLoaded(true), []);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <div id="home" className="relative min-h-screen overflow-x-clip">
      <Preloader onDone={onLoaded} />
      <Cursor />
      <ContourField />
      <div aria-hidden className="grain" />

      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-accent"
      />

      <Nav />

      <main className="relative z-10">
        <Hero reduce={reduce} loaded={loaded} />
        <Marquees />
        <Work reduce={reduce} />
        <About reduce={reduce} />
        <Stack reduce={reduce} />
        <Experience reduce={reduce} />
        <Contact reduce={reduce} />
        <Play reduce={reduce} />
      </main>
    </div>
  );
}

/* ───────────────────────────── Nav ───────────────────────────── */

function Nav() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (open) return;
    setHidden(latest > prev && latest > 300);
  });

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference"
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 md:px-10">
          <a href="#home" className="font-display text-lg font-semibold tracking-tight">
            CA<span className="text-accent">©</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((l, i) => (
              <a key={l.name} href={l.href} className="font-mono text-xs uppercase tracking-[0.12em]">
                <span className="opacity-50">0{i + 1}/</span>
                <Scramble text={l.name} hover />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 transition-transform hover:rotate-180 duration-700"
            >
              {mounted && (resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />)}
            </button>
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/40 md:hidden"
            >
              <span className={`absolute h-px w-4 bg-white transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-[3px]"}`} />
              <span className={`absolute h-px w-4 bg-white transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-[3px]"}`} />
            </button>
          </div>
        </div>
      </motion.header>

      <motion.div
        initial={false}
        animate={{ clipPath: open ? "circle(150% at 100% 0%)" : "circle(0% at 100% 0%)" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="fixed inset-0 z-40 flex flex-col justify-end bg-accent px-5 pb-12 text-[#0A0A0B] md:hidden"
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        {NAV.map((l, i) => (
          <div key={l.name} className="overflow-hidden border-b border-black/15">
            <motion.a
              href={l.href}
              onClick={() => setOpen(false)}
              animate={{ y: open ? "0%" : "100%" }}
              transition={{ duration: 0.7, ease: EASE, delay: open ? 0.15 + i * 0.06 : 0 }}
              className="flex items-baseline justify-between py-3 font-display text-5xl font-semibold uppercase tracking-tight"
            >
              {l.name}
              <span className="font-mono text-xs">0{i + 1}</span>
            </motion.a>
          </div>
        ))}
      </motion.div>
    </>
  );
}

/* ───────────────────────────── Primitives ───────────────────────────── */

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
        <span key={i} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
          <motion.span
            className="block origin-bottom-left"
            variants={{ hidden: { y: "115%", rotate: 4 }, show: { y: "0%", rotate: 0 } }}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * 0.08 }}
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
      initial={reduce ? false : { opacity: 0, y: 50, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 1, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Each letter springs up when hovered
function BouncyWord({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`inline-block whitespace-nowrap ${className}`} aria-label={text}>
      {text.split("").map((c, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          whileHover={{ y: "-18%", rotate: (seeded(i) - 0.5) * 24, color: "#C8F94D" }}
          transition={BOUNCE}
        >
          {c === " " ? " " : c}
        </motion.span>
      ))}
    </span>
  );
}

function SectionLabel({ index, title, light = false }: { index: string; title: string; light?: boolean }) {
  return (
    <div className={`mb-10 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.14em] ${light ? "text-[#0A0A0B]" : "text-text-muted"}`}>
      <span className={`flex h-8 w-8 items-center justify-center rounded-full ${light ? "bg-[#0A0A0B] text-accent" : "bg-accent text-[#0A0A0B]"}`}>
        {index}
      </span>
      <Scramble text={title} />
      <span className={`h-px flex-1 ${light ? "bg-black/20" : "bg-border-hairline"}`} />
    </div>
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

function SpinBadge({ text, className = "" }: { text: string; className?: string }) {
  return (
    <motion.div
      className={`relative flex h-28 w-28 items-center justify-center md:h-36 md:w-36 ${className}`}
      whileHover={{ scale: 1.1 }}
      transition={BOUNCE}
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 14, ease: "linear", repeat: Infinity }}
      >
        <defs>
          <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-current font-mono text-[9.5px] uppercase tracking-[0.2em]">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </motion.svg>
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-[#0A0A0B] md:h-12 md:w-12">
        <Asterisk size={22} weight="bold" />
      </span>
    </motion.div>
  );
}

/* ───────────────────────────── Hero ───────────────────────────── */

function Hero({ reduce, loaded }: { reduce: boolean; loaded: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-30%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.88]);
  const radius = useTransform(scrollYProgress, [0, 1], ["0rem", reduce ? "0rem" : "4rem"]);

  const parent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: 0.1 } } };
  const letter: Variants = {
    hidden: { y: "110%", rotate: 14, opacity: 0 },
    show: { y: "0%", rotate: 0, opacity: 1, transition: { type: "spring", stiffness: 160, damping: 16 } },
  };
  const state = loaded ? "show" : "hidden";

  const word = (w: string, offset: number) =>
    w.split("").map((c, i) => (
      <span key={i} className="inline-block overflow-hidden align-bottom">
        <motion.span
          variants={letter}
          whileHover={{ y: "-12%", rotate: (seeded(i + offset) - 0.5) * 30, color: "#C8F94D", transition: BOUNCE }}
          className="inline-block origin-bottom"
        >
          {c}
        </motion.span>
      </span>
    ));

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[620px]">
      <motion.div
        style={{ scale, borderBottomLeftRadius: radius, borderBottomRightRadius: radius }}
        className="relative h-full overflow-hidden bg-[#0A0A0B] text-[#EDEDEA]"
      >
        <PlasmaHero />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/70 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-between px-5 pb-8 pt-24 md:px-10 md:pb-10">
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={loaded ? { opacity: 1 } : undefined}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-white/60"
          >
            <span>Full-stack developer</span>
            <span className="hidden sm:inline">5.6037° N, 0.1870° W</span>
            <span>Est. 2020</span>
          </motion.div>

          <motion.h1
            variants={parent}
            initial={reduce ? false : "hidden"}
            animate={state}
            className="font-display text-[clamp(4.2rem,19.5vw,24rem)] font-semibold uppercase leading-[0.8] tracking-[-0.055em]"
            aria-label="Charles Allotey"
          >
            <motion.span style={{ x: x1 }} className="block" aria-hidden>
              {word("Charles", 0)}
            </motion.span>
            <motion.span style={{ x: x2 }} className="block text-right" aria-hidden>
              {word("Allotey", 10)}
            </motion.span>
          </motion.h1>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={loaded ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, ease: EASE, delay: 0.9 }}
            className="flex items-end justify-between gap-6"
          >
            <p className="max-w-sm text-sm leading-relaxed text-white/75 md:text-base">
              I build fast, playful, production-ready web products in Vue/Nuxt and React/Next.js, and
              lately, a lot of AI. Developer at <span className="text-accent">Vue School</span>.
            </p>
            <a href="#work" data-cursor="Scroll" className="text-white">
              <SpinBadge text="Open to work • Scroll down • " />
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ───────────────────────────── Marquees ───────────────────────────── */

function Marquees() {
  const words = ["Full-stack", "Vue", "React", "AI", "Nuxt", "Next.js", "TypeScript", "WebGL"];
  return (
    <section aria-hidden className="relative z-20 -mt-6 overflow-hidden py-20 md:py-28">
      <div className="-rotate-3 scale-110 bg-accent py-3 text-[#0A0A0B] md:py-5">
        <VelocityMarquee baseVelocity={-2.5}>
          {words.map((w) => (
            <span key={w} className="flex items-center gap-6 px-6 font-display text-4xl font-semibold uppercase tracking-tight md:text-7xl">
              {w}
              <Asterisk size={36} weight="bold" className="shrink-0" />
            </span>
          ))}
        </VelocityMarquee>
      </div>
      <div className="mt-[-1.5rem] rotate-2 scale-110 border-y border-border-strong bg-bg-base py-3 md:py-5">
        <VelocityMarquee baseVelocity={2}>
          {["Available for work", "Based in Accra", "Shipping since 2020", "76+ repos", "npm author"].map((w) => (
            <span key={w} className="stroke-text flex items-center gap-6 px-6 font-display text-4xl font-semibold uppercase tracking-tight md:text-7xl">
              {w}
              <span className="h-3 w-3 shrink-0 rounded-full bg-accent md:h-4 md:w-4" />
            </span>
          ))}
        </VelocityMarquee>
      </div>
    </section>
  );
}

/* ───────────────────────────── Work (pinned horizontal) ───────────────────────────── */

function TiltCard({ children, reduce }: { children: React.ReactNode; reduce: boolean }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sry = useSpring(ry, { stiffness: 200, damping: 18 });
  return (
    <motion.div
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 14);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 14);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1200 }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

function Work({ reduce }: { reduce: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const rawX = useTransform(scrollYProgress, (p) => -p * distance);
  const x = useSpring(rawX, { stiffness: 90, damping: 22, mass: 0.4 });
  const vel = useVelocity(x);
  const skew = useSpring(useTransform(vel, [-3000, 3000], reduce ? [0, 0] : [-7, 7]), { stiffness: 200, damping: 30 });
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="work" ref={sectionRef} style={{ height: `${PROJECTS.length * 60 + 100}vh` }} className="relative">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <motion.div ref={trackRef} style={{ x, skewX: skew }} className="flex items-stretch gap-6 pl-5 pr-[10vw] md:gap-10 md:pl-10">
          {/* Intro panel */}
          <div className="flex w-[78vw] shrink-0 flex-col justify-between py-4 md:w-[38vw]">
            <SectionLabel index="01" title="Selected work" />
            <h2 className="font-display text-[clamp(3.5rem,9vw,10rem)] font-semibold uppercase leading-[0.82] tracking-[-0.05em] text-text-primary">
              <MaskLines reduce={reduce} lines={["Stuff", <span key="b" className="stroke-text">I&apos;ve</span>, "shipped."]} />
            </h2>
            <p className="max-w-xs text-sm text-text-muted">
              Six favourites from 76+ public repos. Keep scrolling, the page moves sideways.
            </p>
          </div>

          {PROJECTS.map((p, i) => (
            <div key={p.title} className="h-[68svh] w-[82vw] shrink-0 md:h-[72svh] md:w-[44vw]">
              <TiltCard reduce={reduce}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="Open"
                  className="group relative flex h-full flex-col justify-end overflow-hidden rounded-[2rem] border border-border-hairline bg-[#111113]"
                >
                  <Image
                    src={p.image}
                    alt={`${p.title} screenshot`}
                    fill
                    sizes="(max-width: 768px) 82vw, 44vw"
                    className="object-cover object-top transition-transform duration-[1.4s] ease-out-expo group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-700 group-hover:opacity-80" />
                  <span className="stroke-text-light absolute right-5 top-2 font-display text-[7rem] font-semibold leading-none md:text-[10rem]">
                    0{i + 1}
                  </span>
                  <span className="absolute left-5 top-5 rounded-full bg-accent px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-[#0A0A0B] md:left-7 md:top-7">
                    {p.kind}
                  </span>
                  <div className="relative p-5 text-white md:p-8">
                    <h3 className="font-display text-4xl font-semibold uppercase leading-[0.9] tracking-[-0.04em] md:text-6xl">
                      {p.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm text-white/70">{p.blurb}</p>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/50">{p.tags.join(" · ")}</span>
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:bg-accent">
                        <ArrowUpRight size={20} />
                      </span>
                    </div>
                  </div>
                </a>
              </TiltCard>
            </div>
          ))}
        </motion.div>

        <div className="absolute inset-x-5 bottom-6 h-px bg-border-hairline md:inset-x-10">
          <motion.div style={{ width: bar }} className="h-full bg-accent" />
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── About ───────────────────────────── */

const BIO =
  "I'm Charles Nii Adotey Allotey. A full-stack developer from Accra, Ghana with five years of shipping for the web. Vue and Nuxt are home, React and Next.js are my second language, and lately I'm building AI into everything.";

function ScrollWords({ text, reduce }: { text: string; reduce: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 50%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="font-display text-[clamp(1.9rem,4.4vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.035em] text-text-primary">
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
  const opacity = useTransform(progress, range, [0.1, 1]);
  const y = useTransform(progress, range, [20, 0]);
  return (
    <>
      <motion.span
        style={reduce ? undefined : { opacity, y }}
        className={`inline-block ${accent ? "rounded-lg bg-accent px-2 text-[#0A0A0B]" : ""}`}
      >
        {children}
      </motion.span>{" "}
    </>
  );
}

function About({ reduce }: { reduce: boolean }) {
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-12%", "12%"]);
  const rot = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-6, 6]);

  return (
    <section id="about" className="px-5 py-32 md:px-10 md:py-48">
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel index="02" title="About" />

        <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-10">
          <div className="relative md:col-span-4">
            <motion.div
              ref={imgRef}
              style={{ rotate: rot }}
              initial={reduce ? false : { clipPath: "circle(0% at 50% 50%)" }}
              whileInView={{ clipPath: "circle(75% at 50% 50%)" }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1.6, ease: EASE }}
              className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] md:sticky md:top-28"
              data-cursor="Hi!"
            >
              <motion.div style={{ y: imgY }} className="absolute -inset-[14%]">
                <Image src="/portraits/workspace.png" alt="Charles working at his desk" fill sizes="(max-width: 768px) 90vw, 420px" className="object-cover" />
              </motion.div>
            </motion.div>
            <SpinBadge text="Hire me • Hire me • Hire me • " className="absolute -bottom-10 right-0 text-text-primary md:right-8" />
          </div>

          <div className="md:col-span-8">
            <ScrollWords text={BIO} reduce={reduce} />

            <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-[2rem] border border-border-hairline bg-border-hairline md:grid-cols-4">
              {[
                { n: 5, s: "+", l: "Years shipping" },
                { n: 76, s: "+", l: "Public repos" },
                { n: 2, s: "", l: "Ecosystems" },
                { n: 100, s: "%", l: "Curiosity" },
              ].map((s, i) => (
                <motion.div
                  key={s.l}
                  whileHover={reduce ? undefined : { backgroundColor: "#C8F94D", color: "#0A0A0B" }}
                  initial={reduce ? false : { opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}
                  className="bg-bg-base p-6 text-text-primary md:p-8"
                >
                  <div className="font-display text-5xl font-semibold tracking-tight md:text-5xl xl:text-7xl">
                    <Counter to={s.n} suffix={s.s} />
                  </div>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] opacity-60">{s.l}</div>
                </motion.div>
              ))}
            </div>

            <Reveal reduce={reduce} className="mt-14 grid grid-cols-1 gap-6 text-[15px] leading-relaxed text-text-muted sm:grid-cols-2">
              <p>
                At Vue School I build the internal tools and apps used across the product. Around that
                I&apos;ve shipped SaaS dashboards, e-commerce systems, real-time chat, registration engines
                and dozens of client sites.
              </p>
              <p>
                I publish developer tools (hello, npm), mentor upcoming devs, and when I&apos;m off the
                clock you&apos;ll find me gaming and digging for good music. Mission: use code to put smiles
                on people&apos;s faces.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Stack (drag playground) ───────────────────────────── */

function Stack({ reduce }: { reduce: boolean }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const styles = [
    "bg-accent text-[#0A0A0B]",
    "bg-text-primary text-bg-base",
    "border-2 border-text-primary text-text-primary",
    "bg-[#6366F1] text-white",
    "bg-[#22D3EE] text-[#0A0A0B]",
    "bg-[#FF6AD5] text-[#0A0A0B]",
  ];

  return (
    <section id="stack" className="px-5 py-32 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel index="03" title="Stack" />
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="font-display text-[clamp(3rem,8vw,8.5rem)] font-semibold uppercase leading-[0.85] tracking-[-0.05em] text-text-primary">
            <MaskLines reduce={reduce} lines={["Tools of", <span key="b">the <span className="text-accent-ink">trade.</span></span>]} />
          </h2>
          <p className="max-w-xs font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
            ↓ Go on, grab them. Throw them around. I won&apos;t tell.
          </p>
        </div>

        <div
          ref={boxRef}
          data-cursor="Drag"
          className="relative h-[560px] overflow-hidden rounded-[2rem] border border-border-hairline bg-surface-card/40 md:h-[520px]"
        >
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[18vw] font-semibold uppercase leading-none tracking-[-0.06em] text-text-primary/[0.04] md:text-[14vw]">
            Stack
          </span>
          {STACK.map((s, i) => {
            // Jittered 5×5 grid so pills start spread out, not piled up
            const left = 2 + (i % 5) * 19 + seeded(i) * 5;
            const top = 5 + Math.floor(i / 5) * 18 + seeded(i + 50) * 6;
            const rotate = (seeded(i + 100) - 0.5) * 30;
            return (
              <motion.button
                key={s}
                drag
                dragConstraints={boxRef}
                dragElastic={0.35}
                dragTransition={{ bounceStiffness: 300, bounceDamping: 12, power: 0.4 }}
                whileDrag={{ scale: 1.2, rotate: 0, zIndex: 50 }}
                whileHover={{ scale: 1.08 }}
                initial={reduce ? false : { opacity: 0, scale: 0, rotate: 0 }}
                whileInView={{ opacity: 1, scale: 1, rotate }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 260, damping: 14, delay: i * 0.04 }}
                style={{ left: `${left}%`, top: `${top}%` }}
                className={`absolute cursor-grab touch-none select-none rounded-full px-4 py-2.5 font-display text-sm font-semibold uppercase tracking-tight sm:px-5 sm:py-3 sm:text-lg shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] active:cursor-grabbing md:px-7 md:py-4 md:text-2xl ${styles[i % styles.length]}`}
              >
                {s}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Experience ───────────────────────────── */

function Experience({ reduce }: { reduce: boolean }) {
  return (
    <section id="experience" className="px-5 py-32 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel index="04" title="Experience" />
        <ul className="border-t border-border-strong">
          {EXPERIENCE.map((e, i) => (
            <Reveal key={e.org} reduce={reduce} delay={i * 0.08}>
              <li className="group relative overflow-hidden border-b border-border-strong">
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-700 ease-out-expo group-hover:scale-y-100" />
                <div className="relative grid grid-cols-1 gap-3 px-2 py-8 transition-colors duration-500 group-hover:text-[#0A0A0B] md:grid-cols-12 md:items-center md:gap-8 md:px-6 md:py-12">
                  <span className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted transition-colors group-hover:text-[#0A0A0B]/70 md:col-span-2">
                    {e.years}
                  </span>
                  <h3 className="font-display text-5xl font-semibold uppercase leading-[0.9] tracking-[-0.045em] text-text-primary transition-all duration-700 ease-out-expo group-hover:translate-x-4 group-hover:text-[#0A0A0B] md:col-span-6 md:text-7xl">
                    {e.role}
                  </h3>
                  <div className="md:col-span-4">
                    <p className="font-mono text-xs uppercase tracking-[0.12em] text-text-primary group-hover:text-[#0A0A0B]">{e.org}</p>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted transition-colors group-hover:text-[#0A0A0B]/75">{e.desc}</p>
                  </div>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>

        <div className="mt-24">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-text-muted">Also built</span>
          <ul className="mt-6">
            {ARCHIVE.map((a) => (
              <li key={a.title}>
                <a
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-6 border-b border-border-hairline py-5"
                >
                  <span className="font-display text-2xl font-medium tracking-tight text-text-primary transition-transform duration-500 ease-out-expo group-hover:translate-x-3 md:text-4xl">
                    <BouncyWord text={a.title} />
                  </span>
                  <span className="flex items-center gap-4 text-right text-sm text-text-muted">
                    <span className="hidden sm:inline">{a.kind}</span>
                    <ArrowUpRight size={20} className="transition-transform duration-500 group-hover:rotate-45" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Contact ───────────────────────────── */

function Magnetic({ children, reduce, strength = 0.35 }: { children: React.ReactNode; reduce: boolean; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.5 });
  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x: sx, y: sy }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

function Contact({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["12%", "0%"]);

  return (
    <section ref={ref} id="contact" className="relative z-20 overflow-hidden rounded-t-[2.5rem] bg-accent text-[#0A0A0B] md:rounded-t-[5rem]">
      <motion.div style={{ y }} className="mx-auto max-w-[1600px] px-5 pb-10 pt-24 md:px-10 md:pt-36">
        <SectionLabel index="05" title="Contact" light />

        <h2 className="font-display text-[clamp(3.6rem,13vw,15rem)] font-semibold uppercase leading-[0.8] tracking-[-0.06em]">
          <MaskLines
            reduce={reduce}
            lines={[
              <BouncyWord key="a" text="Got an" />,
              <BouncyWord key="b" text="idea? Let's" />,
              <span key="c" className="text-transparent [-webkit-text-stroke:2px_#0A0A0B]">make it loud.</span>,
            ]}
          />
        </h2>

        <div className="mt-16 flex flex-col items-start justify-between gap-12 md:mt-24 md:flex-row md:items-end">
          <Magnetic reduce={reduce}>
            <a
              href="mailto:charlesallotey1995@gmail.com"
              data-cursor="Write"
              className="group flex items-center gap-4 rounded-full bg-[#0A0A0B] py-3 pl-7 pr-3 text-base text-accent transition-transform hover:scale-[1.03] md:py-4 md:pl-10 md:text-2xl"
            >
              charlesallotey1995@gmail.com
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-[#0A0A0B] transition-transform duration-500 group-hover:rotate-45 md:h-16 md:w-16">
                <ArrowUpRight size={24} weight="bold" />
              </span>
            </a>
          </Magnetic>

          <div className="flex gap-3">
            {[
              { l: "GitHub", h: "https://github.com/cnaallotey" },
              { l: "X", h: "https://x.com/adotey_" },
              { l: "npm", h: "https://www.npmjs.com/package/@cnaallotey/auto-form-filler" },
            ].map((s) => (
              <Magnetic key={s.l} reduce={reduce} strength={0.5}>
                <a
                  href={s.h}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#0A0A0B] font-mono text-xs font-medium uppercase transition-colors hover:bg-[#0A0A0B] hover:text-accent md:h-20 md:w-20"
                >
                  {s.l}
                </a>
              </Magnetic>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 flex flex-col gap-4 border-t border-black/15 pt-6 font-mono text-[11px] uppercase tracking-[0.12em] sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Charles Nii Adotey Allotey</span>
          <span className="hidden md:inline">Next.js · WebGL · Framer Motion · too much coffee</span>
          <a href="#play" className="inline-flex items-center gap-2">
            Wait, there&apos;s a game <ArrowDown size={12} className="animate-bounce" />
          </a>
        </footer>
      </motion.div>
    </section>
  );
}

/* ───────────────────────────── Play (under the footer) ───────────────────────────── */

function Play({ reduce }: { reduce: boolean }) {
  return (
    <section id="play" className="relative z-10 bg-[#0A0A0B] px-5 pb-16 pt-24 text-[#EDEDEA] md:px-10 md:pb-24 md:pt-32">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.14em] text-[#85857F]">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6AD5] text-[#0A0A0B]">★</span>
          <Scramble text="Bonus level" />
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="font-display text-[clamp(3rem,8vw,7.5rem)] font-semibold uppercase leading-[0.85] tracking-[-0.05em]">
            <MaskLines reduce={reduce} lines={["Still here?", <span key="b" className="text-accent">Play a round.</span>]} />
          </h2>
          <p className="max-w-xs text-sm text-[#85857F]">
            Every brick is something I build with. Smash them all and you&apos;ve earned an email.
          </p>
        </div>
        <BreakoutGame />
        <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-[#4A4A47]">
          You reached the very bottom. Respect.
        </p>
      </div>
    </section>
  );
}
