"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
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
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight, ArrowDown, Moon, Sun, GithubLogo } from "@phosphor-icons/react";
import Starfield from "@/components/Starfield";
import Desktop from "@/components/Desktop";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import VelocityMarquee from "@/components/VelocityMarquee";
import Scramble from "@/components/Scramble";
import BreakoutGame from "@/components/BreakoutGame";
import { Logo, type LogoName } from "@/components/TechLogos";
import { PROJECTS, type Project } from "@/data/projects";
import { ARTICLES, ARTICLE_COUNT, BLOG_URL } from "@/data/articles";

const EASE = [0.32, 0.72, 0, 1] as const;
const EMAIL = "charlesallotey1995@gmail.com";

const NAV = [
  { name: "Work", href: "#work" },
  { name: "About", href: "#about" },
  { name: "Stack", href: "#stack" },
  { name: "Experience", href: "#experience" },
  { name: "Writing", href: "#writing" },
  { name: "Play", href: "#play" },
];

const STACK: { name: string; logo: LogoName }[] = [
  { name: "Vue 3", logo: "vuedotjs" },
  { name: "Nuxt", logo: "nuxt" },
  { name: "React", logo: "react" },
  { name: "Next.js", logo: "nextdotjs" },
  { name: "TypeScript", logo: "typescript" },
  { name: "Tailwind", logo: "tailwindcss" },
  { name: "GSAP", logo: "gsap" },
  { name: "Node.js", logo: "nodedotjs" },
  { name: "Express", logo: "express" },
  { name: "Laravel", logo: "laravel" },
  { name: "PostgreSQL", logo: "postgresql" },
  { name: "MongoDB", logo: "mongodb" },
  { name: "Firebase", logo: "firebase" },
  { name: "Gemini API", logo: "googlegemini" },
  { name: "Genkit", logo: "kit" },
  { name: "Claude", logo: "claude" },
  { name: "Cursor", logo: "cursor" },
  { name: "Figma", logo: "figma" },
  { name: "Pinia", logo: "pinia" },
  { name: "Strapi", logo: "strapi" },
  { name: "Vercel", logo: "vercel" },
  { name: "WebGL", logo: "webgl" },
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

const PROCESS = [
  { t: "Design", d: "Start from the problem, not the template." },
  { t: "Build", d: "Typed, tested and fast. Vue or React, whatever fits." },
  { t: "Ship", d: "Small releases in front of real users, early." },
  { t: "Run", d: "Monitoring, upgrades and support long after launch." },
];

const SOCIALS = [
  { l: "GitHub", h: "https://github.com/cnaallotey" },
  { l: "X", h: "https://x.com/adotey_" },
  { l: "npm", h: "https://www.npmjs.com/package/@cnaallotey/auto-form-filler" },
  { l: "Email", h: `mailto:${EMAIL}` },
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
    <div className="relative min-h-screen overflow-x-clip">
      <Preloader onDone={onLoaded} />
      <Cursor />
      <Starfield />
      <div aria-hidden className="scanlines pointer-events-none fixed inset-0 z-[55]" />

      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-accent"
      />

      <Nav />

      <main className="relative z-10">
        <Hero reduce={reduce} loaded={loaded} />
        <Ticker />
        <Work reduce={reduce} />
        <About reduce={reduce} />
        <Stack reduce={reduce} />
        <Experience reduce={reduce} />
        <Writing reduce={reduce} />
        <Contact reduce={reduce} />
        <Footer />
        <Play reduce={reduce} />
      </main>
    </div>
  );
}

/* ───────────────────────────── Primitives ───────────────────────────── */

function PxLink({
  href,
  children,
  variant = "solid",
  external = false,
  cursor,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "accent" | "ghost";
  external?: boolean;
  cursor?: string;
  className?: string;
}) {
  const styles = {
    solid: "bg-text-primary text-bg-base",
    accent: "bg-accent text-ink",
    ghost: "text-text-primary shadow-[inset_0_0_0_2px_var(--border-strong)] hover:shadow-[inset_0_0_0_2px_var(--text-primary)]",
  };
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      data-cursor={cursor}
      className={`notch inline-flex h-11 items-center gap-2 px-5 font-pixel text-[12px] uppercase transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 active:translate-y-px ${styles[variant]} ${className}`}
    >
      {children}
    </a>
  );
}

// Thin frame with square corner studs
function Frame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative p-2 md:p-3 ${className}`}>
      <div aria-hidden className="pointer-events-none absolute inset-[5px] border border-border-strong" />
      {["left-0 top-0", "right-0 top-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos) => (
        <span key={pos} aria-hidden className={`absolute ${pos} h-[11px] w-[11px] border border-border-strong bg-bg-base`} />
      ))}
      <div className="relative">{children}</div>
    </div>
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
        <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
          <motion.span
            className="block origin-bottom-left"
            variants={{ hidden: { y: "115%", rotate: 3 }, show: { y: "0%", rotate: 0 } }}
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
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 1, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-10 flex items-center gap-3 font-pixel text-[11px] uppercase text-text-muted md:mb-14">
      <span className="text-accent-ink">{index} /</span>
      <Scramble text={title} />
      <span className="h-px flex-1 bg-border-hairline" />
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

function Magnetic({ children, reduce, strength = 0.3 }: { children: React.ReactNode; reduce: boolean; strength?: number }) {
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
        className="fixed inset-x-0 top-0 z-50"
      >
        <div className="notch mx-3 mt-3 flex h-12 max-w-[1400px] items-center justify-between bg-surface-card/95 pl-3 pr-1.5 shadow-[inset_0_0_0_1px_var(--border-hairline)] md:mx-auto md:mt-4 md:w-[calc(100%-3rem)]">
          <a href="#home" className="flex items-center gap-2.5 font-pixel text-[12px] uppercase text-text-primary">
            <span className="grid h-7 w-7 place-items-center bg-accent text-[11px] text-ink">CA</span>
            <span className="hidden sm:inline">Charles Allotey</span>
          </a>
          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((l) => (
              <a key={l.name} href={l.href} className="font-pixel text-[11px] uppercase text-text-muted transition-colors hover:text-text-primary">
                <Scramble text={l.name} hover />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="notch flex h-9 w-9 items-center justify-center text-text-primary shadow-[inset_0_0_0_2px_var(--border-strong)] transition-colors hover:bg-surface-elevated"
            >
              {mounted && (resolvedTheme === "dark" ? <Sun size={15} weight="bold" /> : <Moon size={15} weight="bold" />)}
            </button>
            <a
              href={`mailto:${EMAIL}`}
              className="notch hidden h-9 items-center bg-accent px-4 font-pixel text-[11px] uppercase text-ink transition-transform hover:-translate-y-px md:inline-flex"
            >
              Hire me
            </a>
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="notch relative flex h-9 w-9 items-center justify-center bg-accent md:hidden"
            >
              <span className={`absolute h-0.5 w-4 bg-ink transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-[3px]"}`} />
              <span className={`absolute h-0.5 w-4 bg-ink transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-[3px]"}`} />
            </button>
          </div>
        </div>
      </motion.header>

      <motion.div
        initial={false}
        animate={{ clipPath: open ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="fixed inset-0 z-40 flex flex-col justify-end bg-bg-base px-5 pb-12 md:hidden"
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        {NAV.map((l, i) => (
          <div key={l.name} className="overflow-hidden border-b border-border-hairline">
            <motion.a
              href={l.href}
              onClick={() => setOpen(false)}
              animate={{ y: open ? "0%" : "100%" }}
              transition={{ duration: 0.7, ease: EASE, delay: open ? 0.12 + i * 0.05 : 0 }}
              className="flex items-baseline justify-between py-3 font-serif text-6xl text-text-primary"
            >
              {l.name}
              <span className="font-pixel text-[11px] text-accent-ink">0{i + 1}</span>
            </motion.a>
          </div>
        ))}
        <a href={`mailto:${EMAIL}`} onClick={() => setOpen(false)} className="notch mt-8 flex h-12 items-center justify-center bg-accent font-pixel text-xs uppercase text-ink">
          Hire me
        </a>
      </motion.div>
    </>
  );
}

/* ───────────────────────────── Hero ───────────────────────────── */

const HEADLINE: React.ReactNode[][] = [
  ["I", "build", "products"],
  ["people", <em key="em" className="text-accent-ink">actually</em>, "use."],
];

function Hero({ reduce, loaded }: { reduce: boolean; loaded: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // The monitor starts tipped back and sits up as you scroll into it
  const tilt = useTransform(scrollYProgress, [0, 0.35], [reduce ? 0 : 18, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.35], [reduce ? 1 : 0.94, 1]);

  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: loaded ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <section id="home" ref={ref} className="relative px-4 pt-28 md:px-10 md:pt-36">
      <div className="mx-auto max-w-[1200px] text-center">
        <motion.p
          {...fade(0.05)}
          className="notch inline-flex items-center gap-2 bg-surface-card px-3 py-2 font-pixel text-[11px] uppercase text-text-muted shadow-[inset_0_0_0_1px_var(--border-hairline)]"
        >
          <span className="blink h-2 w-2 bg-accent" />
          Open to work · Accra, Ghana
        </motion.p>

        <h1
          aria-label="I build products people actually use."
          className="mt-8 font-serif text-[clamp(3.2rem,9.4vw,8.75rem)] leading-[0.92] tracking-[-0.03em] text-text-primary"
        >
          {HEADLINE.map((line, li) => (
            <span key={li} className="block" aria-hidden>
              {line.map((w, wi) => {
                const delay = 0.12 + (li * HEADLINE[0].length + wi) * 0.07;
                return (
                  <React.Fragment key={wi}>
                    <motion.span
                      className="inline-block"
                      initial={reduce ? false : { opacity: 0, y: "30%", filter: "blur(12px)" }}
                      animate={loaded ? { opacity: 1, y: "0%", filter: "blur(0px)" } : undefined}
                      transition={{ duration: 1, ease: EASE, delay }}
                    >
                      {w}
                    </motion.span>
                    {wi < line.length - 1 && " "}
                  </React.Fragment>
                );
              })}
            </span>
          ))}
        </h1>

        <motion.p {...fade(0.55)} className="mx-auto mt-8 max-w-xl font-mono text-[14px] leading-relaxed text-text-muted md:text-[15px]">
          I&apos;m Charles Nii Adotey Allotey, a full-stack developer at Vue School and the builder behind{" "}
          <a href="https://clientra.tech/" target="_blank" rel="noopener noreferrer" className="text-text-primary underline decoration-accent decoration-2 underline-offset-4">
            Clientra
          </a>
          . Six products, all live on the internet right now.
        </motion.p>

        <motion.div {...fade(0.7)} className="mt-9 flex flex-wrap justify-center gap-3">
          <PxLink href="#work">
            See the work <ArrowDown size={13} weight="bold" />
          </PxLink>
          <PxLink href="https://github.com/cnaallotey" external variant="ghost">
            <GithubLogo size={15} weight="bold" /> GitHub
          </PxLink>
          <PxLink href={`mailto:${EMAIL}`} variant="accent">
            Start a project
          </PxLink>
        </motion.div>
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 80 }}
        animate={loaded ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1.2, ease: EASE, delay: 0.8 }}
        className="mx-auto mt-14 max-w-[1120px] [perspective:1800px] md:mt-20"
      >
        <motion.div style={{ rotateX: tilt, scale, transformOrigin: "50% 100%" }}>
          <Desktop />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ───────────────────────────── Ticker ───────────────────────────── */

function Ticker() {
  const words = [...PROJECTS.map((p) => p.title), "Built in Accra", "Shipped everywhere"];
  return (
    <section aria-hidden className="relative mt-24 border-y border-border-hairline bg-bg-base/70 py-5 md:mt-36">
      <VelocityMarquee baseVelocity={-1.6}>
        {words.map((w) => (
          <span key={w} className="flex items-center gap-8 px-8 font-serif text-4xl italic text-text-primary md:text-6xl">
            {w}
            <span className="h-2.5 w-2.5 shrink-0 bg-accent" />
          </span>
        ))}
      </VelocityMarquee>
    </section>
  );
}

/* ───────────────────────────── Work ───────────────────────────── */

// Grid of cells over the screenshot that pop away in seeded order
function Dissolve({ reduce, seed }: { reduce: boolean; seed: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  if (reduce) return null;
  return (
    <div
      ref={ref}
      aria-hidden
      className={`dissolve pointer-events-none absolute inset-0 grid grid-cols-12 grid-rows-8 ${inView ? "is-on" : ""}`}
    >
      {Array.from({ length: 96 }, (_, k) => (
        <span key={k} className="bg-surface-card" style={{ transitionDelay: `${(seeded(k + seed * 97) * 0.8).toFixed(3)}s` }} />
      ))}
    </div>
  );
}

function ProjectRow({ p, i, reduce }: { p: Project; i: number; reduce: boolean }) {
  const flip = i % 2 === 1;
  return (
    <article className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
      <Reveal reduce={reduce} className={`md:col-span-4 md:self-center ${flip ? "md:order-2" : ""}`}>
        <p className="font-pixel text-[11px] uppercase text-text-muted">
          <span className="text-accent-ink">{String(i + 1).padStart(2, "0")} /</span> {p.kind}
        </p>
        <h3 className="mt-4 font-serif text-[clamp(2.75rem,4.6vw,4.5rem)] leading-[0.95] tracking-[-0.02em] text-text-primary">
          {p.title}
        </h3>
        <p className="mt-5 max-w-md font-mono text-[14px] leading-relaxed text-text-muted">{p.blurb}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <li key={t} className="notch bg-surface-elevated px-2.5 py-1.5 font-pixel text-[10px] uppercase text-text-muted">
              {t}
            </li>
          ))}
        </ul>
        <PxLink href={p.href} external variant="accent" className="mt-8">
          Visit site <ArrowUpRight size={13} weight="bold" />
        </PxLink>
      </Reveal>

      <div className={`md:col-span-8 ${flip ? "md:order-1" : ""}`}>
        <Frame>
          <a href={p.href} target="_blank" rel="noopener noreferrer" data-cursor="Open" className="group block bg-surface-card">
            <div className="flex h-9 items-center gap-3 border-b border-border-hairline px-3">
              <span className="flex gap-1.5" aria-hidden>
                {[0, 1, 2].map((d) => (
                  <span key={d} className="h-2.5 w-2.5 bg-border-strong" />
                ))}
              </span>
              <span className="notch mx-auto flex h-6 min-w-0 max-w-[70%] items-center gap-2 bg-bg-base px-3 font-pixel text-[10px] lowercase text-text-muted">
                <span className="h-1.5 w-1.5 shrink-0 bg-accent" />
                <span className="truncate">{p.domain}</span>
              </span>
              <ArrowUpRight size={15} className="text-text-muted transition-transform duration-300 group-hover:rotate-45" />
            </div>
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={p.image}
                alt={`${p.title} homepage`}
                fill
                sizes="(max-width: 768px) 92vw, 62vw"
                className="object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
              />
              <Dissolve reduce={reduce} seed={i} />
            </div>
          </a>
        </Frame>
      </div>
    </article>
  );
}

function Work({ reduce }: { reduce: boolean }) {
  return (
    <section id="work" className="px-4 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <SectionLabel index="01" title="Selected work" />
        <div className="mb-20 grid gap-8 md:mb-32 md:grid-cols-12 md:items-end">
          <h2 className="font-serif text-[clamp(3.2rem,8vw,7.5rem)] leading-[0.9] tracking-[-0.03em] text-text-primary md:col-span-8">
            <MaskLines reduce={reduce} lines={["Six products.", <em key="b" className="text-accent-ink">All live.</em>]} />
          </h2>
          <p className="max-w-sm font-mono text-[14px] leading-relaxed text-text-muted md:col-span-4">
            Things I design, build and run under Clientra. Not mockups, not a side-project graveyard: every one is
            out on the internet right now.
          </p>
        </div>

        <div className="space-y-28 md:space-y-40">
          {PROJECTS.map((p, i) => (
            <ProjectRow key={p.slug} p={p} i={i} reduce={reduce} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── About ───────────────────────────── */

const BIO =
  "Five years of shipping for the web from Accra, Ghana. Vue and Nuxt are home, React and Next.js are my second language, and lately I'm building AI into everything.";

function ScrollWords({ text, reduce }: { text: string; reduce: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 50%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="font-serif text-[clamp(2rem,4vw,3.6rem)] leading-[1.06] tracking-[-0.02em] text-text-primary">
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
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <>
      <motion.span style={reduce ? undefined : { opacity }} className={accent ? "italic text-accent-ink" : ""}>
        {children}
      </motion.span>{" "}
    </>
  );
}

function About({ reduce }: { reduce: boolean }) {
  return (
    <section id="about" className="px-4 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <SectionLabel index="02" title="About" />

        <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <ScrollWords text={BIO} reduce={reduce} />
            <Reveal reduce={reduce} className="mt-12 grid grid-cols-1 gap-6 font-mono text-[14px] leading-relaxed text-text-muted sm:grid-cols-2">
              <p>
                At Vue School I build the internal tools and apps used across the product. Outside it I run Clientra,
                a small studio where I design, build and run my own products and custom systems for clients.
              </p>
              <p>
                I publish developer tools (hello, npm), mentor upcoming devs, and when I&apos;m off the clock
                you&apos;ll find me gaming and digging for good music. Mission: use code to put smiles on
                people&apos;s faces.
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <Reveal reduce={reduce}>
              <Frame>
                <div className="group relative aspect-[4/5] overflow-hidden bg-surface-card" data-cursor="Hi!">
                  <Image
                    src="/portraits/workspace.png"
                    alt="Charles working at his desk"
                    fill
                    sizes="(max-width: 768px) 90vw, 420px"
                    className="object-cover grayscale contrast-[1.15] transition-[filter] duration-700 group-hover:grayscale-0"
                  />
                  <div aria-hidden className="scanlines absolute inset-0" />
                </div>
                <p className="mt-3 flex justify-between font-pixel text-[10px] uppercase text-text-muted">
                  <span>Fig. 1: at the desk</span>
                  <span>Accra, GH</span>
                </p>
              </Frame>
            </Reveal>

            <ol className="mt-12 border-t border-border-hairline">
              {PROCESS.map((s, i) => (
                <Reveal key={s.t} reduce={reduce} delay={i * 0.06}>
                  <li className="grid grid-cols-[3rem_1fr] items-baseline border-b border-border-hairline py-4">
                    <span className="font-pixel text-[11px] text-accent-ink">0{i + 1}</span>
                    <span>
                      <span className="block font-serif text-3xl leading-none text-text-primary">{s.t}</span>
                      <span className="mt-1.5 block font-mono text-[13px] text-text-muted">{s.d}</span>
                    </span>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-2 border-l border-t border-border-hairline md:grid-cols-4">
          {[
            { n: 5, s: "+", l: "Years shipping" },
            { n: 6, s: "", l: "Products live" },
            { n: 76, s: "+", l: "Public repos" },
            { n: 2, s: "", l: "Ecosystems" },
          ].map((s) => (
            <div key={s.l} className="border-b border-r border-border-hairline p-5 md:p-8">
              <div className="font-dots text-6xl font-black leading-none text-text-primary md:text-8xl">
                <Counter to={s.n} suffix={s.s} />
              </div>
              <div className="mt-3 font-pixel text-[10px] uppercase text-text-muted">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Stack (drag playground) ───────────────────────────── */

function Stack({ reduce }: { reduce: boolean }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const styles = [
    "bg-accent text-ink",
    "bg-text-primary text-bg-base",
    "bg-surface-elevated text-text-primary shadow-[inset_0_0_0_2px_var(--border-strong)]",
    "bg-[#E2B46C] text-ink",
    "bg-[#E98B5A] text-ink",
  ];

  return (
    <section id="stack" className="px-4 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <SectionLabel index="03" title="Toolbox" />
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="font-serif text-[clamp(3rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.03em] text-text-primary">
            <MaskLines reduce={reduce} lines={["Tools of", <span key="b">the <em className="text-accent-ink">trade.</em></span>]} />
          </h2>
          <p className="max-w-xs font-pixel text-[11px] uppercase leading-relaxed text-text-muted">
            ↓ Go on, grab them. Throw them around. I won&apos;t tell.
          </p>
        </div>

        <div
          ref={boxRef}
          data-cursor="Drag"
          className="notch notch-lg relative h-[560px] overflow-hidden bg-surface-card bg-[radial-gradient(var(--border-strong)_1px,transparent_1.2px)] bg-[size:22px_22px] md:h-[520px]"
        >
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-dots text-[22vw] font-black uppercase leading-none text-text-primary/[0.05] md:text-[16vw]">
            Stack
          </span>
          {STACK.map((s, i) => {
            // Jittered 5×5 grid so chips start spread out, not piled up
            const left = 2 + (i % 5) * 19 + seeded(i) * 5;
            const top = 5 + Math.floor(i / 5) * 18 + seeded(i + 50) * 6;
            const rotate = (seeded(i + 100) - 0.5) * 24;
            return (
              <motion.button
                key={s.name}
                drag
                dragConstraints={boxRef}
                dragElastic={0.35}
                dragTransition={{ bounceStiffness: 300, bounceDamping: 12, power: 0.4 }}
                whileDrag={{ scale: 1.15, rotate: 0, zIndex: 50 }}
                whileHover={{ scale: 1.06 }}
                initial={reduce ? false : { opacity: 0, scale: 0, rotate: 0 }}
                whileInView={{ opacity: 1, scale: 1, rotate }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 260, damping: 14, delay: i * 0.04 }}
                style={{ left: `${left}%`, top: `${top}%` }}
                className={`notch absolute flex touch-none select-none items-center gap-2 px-3 py-2 font-pixel text-[11px] uppercase sm:gap-2.5 sm:px-4 sm:py-2.5 sm:text-sm md:px-5 md:py-3 md:text-lg ${styles[i % styles.length]}`}
              >
                <Logo name={s.logo} className="pointer-events-none h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                {s.name}
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
    <section id="experience" className="px-4 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <SectionLabel index="04" title="Experience" />
        <ul className="border-t border-border-strong">
          {EXPERIENCE.map((e, i) => (
            <Reveal key={e.org} reduce={reduce} delay={i * 0.08}>
              <li className="group relative border-b border-border-strong">
                <span className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-accent transition-transform duration-500 ease-out-expo group-hover:scale-y-100" />
                <div className="grid grid-cols-1 gap-3 px-2 py-8 md:grid-cols-12 md:items-center md:gap-8 md:px-6 md:py-12">
                  <span className="font-pixel text-[11px] uppercase text-text-muted md:col-span-2">{e.years}</span>
                  <h3 className="font-serif text-5xl leading-[0.95] tracking-[-0.02em] text-text-primary transition-transform duration-500 ease-out-expo group-hover:translate-x-3 md:col-span-6 md:text-7xl">
                    {e.role}
                  </h3>
                  <div className="md:col-span-4">
                    <p className="font-pixel text-[11px] uppercase text-accent-ink">{e.org}</p>
                    <p className="mt-2 font-mono text-[13px] leading-relaxed text-text-muted">{e.desc}</p>
                  </div>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────────── Writing ───────────────────────────── */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthYear = (iso: string) => {
  const [y, m] = iso.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
};

function Writing({ reduce }: { reduce: boolean }) {
  return (
    <section id="writing" className="px-4 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <SectionLabel index="05" title="Writing" />
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-32">
              <h2 className="font-serif text-[clamp(3rem,5.6vw,5.5rem)] leading-[0.92] tracking-[-0.03em] text-text-primary">
                <MaskLines
                  reduce={reduce}
                  lines={["Notes from", <span key="b">the <em className="text-accent-ink">Nuxt</em></span>, "trenches."]}
                />
              </h2>
              <p className="mt-6 max-w-sm font-mono text-[14px] leading-relaxed text-text-muted">
                {`${ARTICLE_COUNT} articles and counting on Mastering Nuxt: migrations, deep dives and the things I wish I'd known sooner. A few favourites.`}
              </p>
              <PxLink href={BLOG_URL} external variant="ghost" className="mt-8">
                All articles <ArrowUpRight size={13} weight="bold" />
              </PxLink>
            </div>
          </div>

          <ul className="border-t border-border-strong md:col-span-8">
            {ARTICLES.map((a, i) => (
              <motion.li
                key={a.href}
                initial={reduce ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.8, ease: EASE, delay: (i % 3) * 0.06 }}
                className="border-b border-border-hairline"
              >
                <a
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="Read"
                  className="group grid grid-cols-[4.5rem_1fr_auto] items-start gap-4 py-6 md:grid-cols-[6rem_1fr_auto] md:gap-6 md:py-8"
                >
                  <time dateTime={a.date} className="pt-2 font-pixel text-[10px] uppercase text-text-muted md:text-[11px]">
                    {monthYear(a.date)}
                  </time>
                  <div>
                    <h3 className="font-serif text-[1.6rem] leading-[1.05] tracking-[-0.01em] text-text-primary transition-colors duration-300 group-hover:text-accent-ink md:text-[2.1rem]">
                      {a.title}
                    </h3>
                    <p className="mt-2 max-w-xl font-mono text-[13px] leading-relaxed text-text-muted">{a.blurb}</p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className="notch hidden bg-surface-elevated px-2 py-1 font-pixel text-[10px] uppercase text-text-muted sm:inline-block">
                      {a.topic}
                    </span>
                    <span className="notch flex h-9 w-9 items-center justify-center bg-surface-elevated text-text-primary transition-colors duration-300 group-hover:bg-accent group-hover:text-ink">
                      <ArrowUpRight size={15} weight="bold" className="transition-transform duration-300 group-hover:rotate-45" />
                    </span>
                  </div>
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Contact ───────────────────────────── */

function Contact({ reduce }: { reduce: boolean }) {
  return (
    <section id="contact" className="px-4 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <SectionLabel index="06" title="Contact" />
        <div className="text-center">
          <h2 className="font-serif text-[clamp(3.2rem,9vw,8.5rem)] leading-[0.9] tracking-[-0.03em] text-text-primary">
            <MaskLines reduce={reduce} lines={["Got something", <span key="b">to <em className="text-accent-ink">build?</em></span>]} />
          </h2>
          <p className="mx-auto mt-7 max-w-md font-mono text-[14px] leading-relaxed text-text-muted">
            Freelance builds, contracts, or a product idea you can&apos;t stop thinking about. Let&apos;s talk.
          </p>

          <div className="bulbs relative mx-auto mt-14 inline-flex flex-col items-center gap-3 bg-surface-card/70 p-8 sm:flex-row md:p-10">
            <Magnetic reduce={reduce}>
              <PxLink href={`mailto:${EMAIL}`} variant="accent" cursor="Write">
                {EMAIL} <ArrowUpRight size={14} weight="bold" />
              </PxLink>
            </Magnetic>
            <PxLink href="https://clientra.tech/" external variant="ghost">
              Hire the studio
            </PxLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Footer ───────────────────────────── */

function Footer() {
  return (
    <footer className="relative bg-accent text-ink">
      <div className="mx-auto max-w-[1400px] px-4 pb-8 pt-16 md:px-10 md:pt-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <p className="font-serif text-5xl leading-[0.95] tracking-[-0.02em] md:col-span-5 md:text-6xl">
            Built in Accra.
            <br />
            <em>Shipped everywhere.</em>
          </p>
          <div className="grid grid-cols-2 gap-8 font-mono text-[14px] sm:grid-cols-3 md:col-span-7">
            <FooterCol title="Products" links={PROJECTS.map((p) => ({ l: p.title, h: p.href, ext: true }))} />
            <FooterCol title="Elsewhere" links={SOCIALS.map((s) => ({ l: s.l, h: s.h, ext: !s.h.startsWith("mailto") }))} />
            <FooterCol title="This site" links={NAV.map((n) => ({ l: n.name, h: n.href }))} />
          </div>
        </div>

        <p aria-hidden className="mt-16 select-none overflow-hidden whitespace-nowrap font-dots text-[17vw] font-black leading-[0.8] tracking-[-0.02em] md:mt-24 md:text-[15.5vw]">
          ALLOTEY
        </p>

        <div className="mt-8 flex flex-col gap-3 border-t border-ink/20 pt-5 font-pixel text-[10px] uppercase sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Charles Nii Adotey Allotey</span>
          <span className="hidden md:inline">Next.js · Framer Motion · pixels drawn by hand</span>
          <a href="#play" className="inline-flex items-center gap-2">
            Wait, there&apos;s a game <ArrowDown size={12} className="animate-bounce" />
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { l: string; h: string; ext?: boolean }[] }) {
  return (
    <div>
      <p className="mb-4 font-pixel text-[10px] uppercase opacity-60">{title}</p>
      <ul className="space-y-1.5">
        {links.map((x) => (
          <li key={x.l}>
            <a
              href={x.h}
              target={x.ext ? "_blank" : undefined}
              rel={x.ext ? "noopener noreferrer" : undefined}
              className="underline-offset-4 hover:underline"
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
    <section id="play" className="relative bg-ink px-4 pb-16 pt-24 text-cream md:px-10 md:pb-24 md:pt-32">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10 flex items-center gap-3 font-pixel text-[11px] uppercase text-[#9A9286]">
          <span className="text-accent">★ /</span>
          <Scramble text="Bonus level" />
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="font-serif text-[clamp(3rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.03em]">
            <MaskLines reduce={reduce} lines={["Still here?", <em key="b" className="text-accent">Insert coin.</em>]} />
          </h2>
          <p className="max-w-xs font-mono text-sm text-[#9A9286]">
            Every brick is something I build with. Smash them all and you&apos;ve earned an email.
          </p>
        </div>
        <BreakoutGame />
        <p className="mt-10 text-center font-pixel text-[10px] uppercase text-[#4F4A42]">
          You reached the very bottom. Respect.
        </p>
      </div>
    </section>
  );
}
