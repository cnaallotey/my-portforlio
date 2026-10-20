"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight, ArrowDown, Moon, Sun } from "@phosphor-icons/react";
import ContourField from "@/components/ContourField";
import ProjectPreview from "@/components/ProjectPreview";

// Shared cinematic easing — the "Linear/Vaul" curve
const EASE = [0.32, 0.72, 0, 1] as const;

const NAV = [
  { name: "Work", href: "#work" },
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
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
    blurb: "Open-source library on npm that fills forms from URL query params.",
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

// Stable reference — the WebGL preview keys its texture loading on this
const PROJECT_IMAGES = PROJECTS.map((p) => p.image);

const ARCHIVE = [
  { title: "VisoRegistry", kind: "AI registration engine", href: "https://visoregistry.vercel.app" },
  { title: "Ignite AI", kind: "AI app on Nuxt", href: "https://ignite-ai-psi.vercel.app" },
  { title: "Component Builder", kind: "Developer tool", href: "https://github.com/cnaallotey" },
  { title: "EazzySocial", kind: "Social media SaaS", href: "https://github.com/cnaallotey" },
  { title: "Client sites", kind: "Werkbuddy, Miles Mobility, Vida Dzakumah", href: "https://github.com/cnaallotey" },
];

const STACK = [
  { group: "Frontend", items: ["Vue 3", "Nuxt", "React", "Next.js", "TypeScript", "Tailwind", "GSAP"] },
  { group: "Backend", items: ["Node.js", "Express", "Laravel", "REST APIs", "JWT Auth", "Strapi"] },
  { group: "Data", items: ["PostgreSQL", "MongoDB", "MySQL", "Firebase", "Vercel", "Netlify"] },
  { group: "AI & Tooling", items: ["Gemini API", "Genkit", "Claude", "Cursor", "Figma", "Pinia"] },
];

const EXPERIENCE = [
  {
    years: "2023 — Now",
    role: "Web Developer",
    org: "Vue School",
    where: "Remote",
    desc: "Internal tools and applications across the Vue/Nuxt stack, including affiliate and marketing tooling and course-supporting apps.",
  },
  {
    years: "2022 — 2025",
    role: "Frontend Mentor / Instructor",
    org: "Thrive Program",
    where: "Accra",
    desc: "Taught frontend fundamentals (HTML, CSS, JavaScript, Vue) through hands-on classes, codebase walkthroughs and team projects.",
  },
  {
    years: "2021 — Now",
    role: "Full-Stack Developer",
    org: "Freelance",
    where: "Accra · Remote",
    desc: "SaaS apps, e-commerce dashboards, registration systems and marketing sites, from Figma to deployment.",
  },
];

export default function Home() {
  const reduce = !!useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<number | null>(null);

  // Top hairline that tracks page progress
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <div id="home" className="relative min-h-screen overflow-x-clip">
      <ContourField />
      <ProjectPreview images={PROJECT_IMAGES} active={activeProject} />

      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-text-primary/60"
      />

      <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="relative z-10">
        <Hero reduce={reduce} />
        <Work reduce={reduce} active={activeProject} setActive={setActiveProject} />
        <About reduce={reduce} />
        <Capabilities reduce={reduce} />
        <Experience reduce={reduce} />
        <Contact reduce={reduce} />
      </main>

      <Footer />
    </div>
  );
}

/* ───────────────────────────── Nav ───────────────────────────── */

function Nav({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Hide on scroll-down, reveal on scroll-up
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (menuOpen) return;
    setHidden(latest > prev && latest > 200);
  });

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: hidden ? -90 : 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 md:px-10">
          <a href="#home" className="group flex items-center gap-3">
            <span className="font-display text-[15px] font-medium tracking-tight text-text-primary">
              Charles Allotey
            </span>
            <span className="label hidden sm:inline">
              <LocalTime />
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((l) => (
              <a key={l.name} href={l.href} className="link-draw text-sm text-text-muted transition-colors hover:text-text-primary">
                {l.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-elevated hover:text-text-primary"
            >
              {mounted && (resolvedTheme === "dark" ? <Sun size={17} weight="light" /> : <Moon size={17} weight="light" />)}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="relative flex h-9 w-9 cursor-pointer items-center justify-center md:hidden"
            >
              <span className={`absolute h-px w-5 bg-text-primary transition-transform duration-500 ease-out-expo ${menuOpen ? "rotate-45" : "-translate-y-[4px]"}`} />
              <span className={`absolute h-px w-5 bg-text-primary transition-transform duration-500 ease-out-expo ${menuOpen ? "-rotate-45" : "translate-y-[4px]"}`} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col justify-end bg-bg-base/85 px-5 pb-12 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col">
              {NAV.map((l, i) => (
                <div key={l.name} className="overflow-hidden border-b border-border-hairline">
                  <motion.a
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.05 * i }}
                    className="flex items-baseline justify-between py-4 font-display text-4xl font-normal tracking-tight text-text-primary"
                  >
                    {l.name}
                    <span className="label">0{i + 1}</span>
                  </motion.a>
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function LocalTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Accra",
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = window.setInterval(update, 15000);
    return () => window.clearInterval(id);
  }, []);
  return <>Accra {time ?? "--:--"} GMT</>;
}

/* ───────────────────────────── Motion primitives ───────────────────────────── */

// Lines slide up from behind a mask
function MaskLines({
  lines,
  reduce,
  delay = 0,
  stagger = 0.09,
  inView = false,
  className = "",
}: {
  lines: React.ReactNode[];
  reduce: boolean;
  delay?: number;
  stagger?: number;
  inView?: boolean;
  className?: string;
}) {
  // The trigger lives on the parent: the lines start fully clipped by their
  // masks, so an observer on the lines themselves would never fire.
  const trigger = inView
    ? { whileInView: "show", viewport: { once: true, margin: "-10% 0px" } }
    : { animate: "show" };
  return (
    <motion.span className={`block ${className}`} initial={reduce ? false : "hidden"} {...trigger}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className="block"
            variants={{ hidden: { y: "110%" }, show: { y: "0%" } }}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * stagger }}
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
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// A hairline that draws itself left → right when it enters view
function Rule({ reduce, className = "" }: { reduce: boolean; className?: string }) {
  return (
    <motion.div
      aria-hidden
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ duration: 1.4, ease: EASE }}
      className={`h-px origin-left bg-border-hairline ${className}`}
    />
  );
}

function SectionHead({
  index,
  title,
  reduce,
  aside,
}: {
  index: string;
  title: string;
  reduce: boolean;
  aside?: React.ReactNode;
}) {
  return (
    <div className="mb-14 md:mb-20">
      <div className="mb-6 flex items-center justify-between">
        <span className="label">
          {index} — {title}
        </span>
        {aside}
      </div>
      <Rule reduce={reduce} />
    </div>
  );
}

/* ───────────────────────────── Hero ───────────────────────────── */

function Hero({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0]);

  const fade = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 12 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col justify-end px-5 pb-10 pt-32 md:px-10 md:pb-14">
      <motion.div style={{ y, opacity }} className="mx-auto w-full max-w-[1400px]">
        <motion.p {...fade(0.2)} className="label mb-8 flex items-center gap-3">
          <span className="pulse-dot" />
          Available for freelance & full-time
        </motion.p>

        <h1 className="font-display text-[clamp(3.4rem,11.5vw,11.5rem)] font-normal leading-[0.9] tracking-[-0.045em] text-text-primary">
          <MaskLines
            reduce={reduce}
            delay={0.3}
            lines={[
              "Full-stack",
              <>
                developer<span className="text-text-faint">,</span>{" "}
                <span className="font-light italic text-text-muted">from</span>
              </>,
              "Accra.",
            ]}
          />
        </h1>

        <div className="mt-14 grid grid-cols-1 gap-8 border-t border-border-hairline pt-6 md:mt-20 md:grid-cols-12">
          <motion.p {...fade(1.0)} className="max-w-md text-[15px] leading-relaxed text-text-muted md:col-span-5">
            I&apos;m Charles. I build fast, thoughtful web products in Vue/Nuxt and React/Next.js,
            from SaaS dashboards and real-time apps to AI tools.
          </motion.p>

          <motion.dl {...fade(1.1)} className="grid grid-cols-2 gap-6 text-sm md:col-span-5 md:col-start-7">
            <div>
              <dt className="label mb-2">Currently</dt>
              <dd className="text-text-primary">Developer at Vue School</dd>
            </div>
            <div>
              <dt className="label mb-2">Focus</dt>
              <dd className="text-text-primary">AI-powered products</dd>
            </div>
          </motion.dl>

          <motion.a
            {...fade(1.2)}
            href="#work"
            className="group hidden items-end justify-end gap-3 md:col-span-1 md:flex"
            aria-label="Scroll to work"
          >
            <span className="scroll-cue" />
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}

/* ───────────────────────────── Work ───────────────────────────── */

function Work({
  reduce,
  active,
  setActive,
}: {
  reduce: boolean;
  active: number | null;
  setActive: (i: number | null) => void;
}) {
  return (
    <section id="work" className="px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <SectionHead
          index="01"
          title="Selected work"
          reduce={reduce}
          aside={<span className="label">2021 — 2026</span>}
        />

        <ul onMouseLeave={() => setActive(null)} className="group/list">
          {PROJECTS.map((p, i) => (
            <motion.li
              key={p.title}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5% 0px" }}
              transition={{ duration: 0.9, ease: EASE, delay: i * 0.05 }}
            >
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className={`group relative grid grid-cols-12 items-center gap-x-4 gap-y-4 border-b border-border-hairline py-7 transition-opacity duration-500 md:py-9 ${
                  active !== null && active !== i ? "md:opacity-35" : "opacity-100"
                }`}
              >
                <span className="label col-span-2 md:col-span-1">0{i + 1}</span>

                <span className="col-span-10 md:col-span-5">
                  <span className="block font-display text-3xl font-normal tracking-[-0.03em] text-text-primary transition-transform duration-700 ease-out-expo group-hover:translate-x-3 md:text-5xl">
                    {p.title}
                  </span>
                </span>

                <span className="col-span-10 col-start-3 text-sm leading-relaxed text-text-muted md:col-span-4 md:col-start-auto">
                  {p.blurb}
                  <span className="mt-2 block font-mono text-[11px] text-text-faint">{p.tags.join(" · ")}</span>
                </span>

                <span className="hidden items-center justify-end gap-4 md:col-span-2 md:flex">
                  <span className="label">{p.kind}</span>
                  <ArrowUpRight
                    size={18}
                    weight="light"
                    className="text-text-muted transition-all duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text-primary"
                  />
                </span>

                {/* Touch devices get an inline image instead of the cursor preview */}
                <span className="relative col-span-10 col-start-3 aspect-[16/10] overflow-hidden rounded-lg [@media(hover:hover)_and_(pointer:fine)]:hidden">
                  <Image src={p.image} alt={`${p.title} screenshot`} fill sizes="(max-width: 768px) 90vw, 50vw" className="object-cover object-top" />
                </span>
              </a>
            </motion.li>
          ))}
        </ul>

        <Reveal reduce={reduce} className="mt-24 grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <span className="label">Archive</span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-muted">
              More from 76+ public repositories, client builds and experiments.
            </p>
            <a
              href="https://github.com/cnaallotey"
              target="_blank"
              rel="noopener noreferrer"
              className="link-draw mt-6 inline-flex items-center gap-1.5 text-sm text-text-primary"
            >
              github.com/cnaallotey <ArrowUpRight size={14} weight="light" />
            </a>
          </div>
          <ul className="md:col-span-8">
            {ARCHIVE.map((a) => (
              <li key={a.title}>
                <a
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-baseline justify-between gap-6 border-b border-border-hairline py-4 text-sm"
                >
                  <span className="text-text-primary transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                    {a.title}
                  </span>
                  <span className="text-right text-text-muted transition-colors group-hover:text-text-primary">
                    {a.kind}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────────── About ───────────────────────────── */

const BIO =
  "I'm Charles Nii Adotey Allotey, a full-stack developer from Accra, Ghana with five years of building for the web. My home turf is Vue and Nuxt, but I'm just as fluent in React and Next.js. Lately I've been going deep on AI-powered products, and I care most about the moment clean code meets a clean interface.";

function ScrollWords({ text, reduce }: { text: string; reduce: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="font-display text-[clamp(1.6rem,3.4vw,3rem)] font-normal leading-[1.15] tracking-[-0.025em] text-text-primary">
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} reduce={reduce}>
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
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  reduce: boolean;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <>
      <motion.span style={{ opacity: reduce ? 1 : opacity }}>{children}</motion.span>{" "}
    </>
  );
}

function About({ reduce }: { reduce: boolean }) {
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.18, 1]);

  return (
    <section id="about" className="px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <SectionHead index="02" title="About" reduce={reduce} />

        <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <motion.div
              ref={imgRef}
              initial={reduce ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1.4, ease: EASE }}
              className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg bg-surface-elevated md:sticky md:top-28"
            >
              <motion.div style={{ scale }} className="absolute inset-0">
                <Image
                  src="/portraits/workspace.png"
                  alt="Charles working at his desk"
                  fill
                  sizes="(max-width: 768px) 90vw, 400px"
                  className="object-cover grayscale-[35%]"
                />
              </motion.div>
            </motion.div>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <ScrollWords text={BIO} reduce={reduce} />

            <Reveal reduce={reduce} className="mt-14 grid grid-cols-1 gap-6 text-[15px] leading-relaxed text-text-muted sm:grid-cols-2">
              <p>
                I currently work at Vue School, building internal tools and applications used across
                the product. Before and alongside that, I&apos;ve shipped SaaS dashboards, e-commerce
                systems, real-time chat, registration engines and dozens of client sites.
              </p>
              <p>
                I also build developer tools, including a published npm package and a component-sharing
                system, and I&apos;ve mentored developers through frontend training. Off the clock:
                gaming and good music.
              </p>
            </Reveal>

            <Reveal reduce={reduce} className="mt-16 grid grid-cols-2 gap-y-10 border-t border-border-hairline pt-8 md:grid-cols-4">
              {[
                { n: "5+", l: "Years shipping" },
                { n: "76+", l: "Public repos" },
                { n: "1", l: "npm package" },
                { n: "2", l: "Ecosystems, Vue & React" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-4xl font-light tracking-tight text-text-primary">{s.n}</div>
                  <div className="label mt-2">{s.l}</div>
                </div>
              ))}
            </Reveal>

            <Reveal reduce={reduce} className="mt-16">
              <p className="font-display text-xl font-light italic leading-snug text-text-muted">
                &ldquo;A web developer with the ambition of using code to bring smiles to the faces of
                people.&rdquo;
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Capabilities ───────────────────────────── */

function Capabilities({ reduce }: { reduce: boolean }) {
  const outcomes = [
    "Full-stack web apps, end to end",
    "Figma to pixel-accurate, responsive UI",
    "Real-time features and auth systems",
    "AI and LLM integrations",
    "Component libraries and developer tooling",
    "Teaching and mentoring frontend",
  ];

  return (
    <section id="skills" className="px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <SectionHead index="03" title="Capabilities" reduce={reduce} />

        <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-normal leading-[1] tracking-[-0.035em] text-text-primary">
              <MaskLines inView reduce={reduce} lines={["What I do,", <span key="b" className="text-text-muted">and what I do it with.</span>]} />
            </h2>
            <ol className="mt-12">
              {outcomes.map((o, i) => (
                <Reveal key={o} reduce={reduce} delay={i * 0.04}>
                  <li className="flex gap-6 border-b border-border-hairline py-4 text-[15px] text-text-primary">
                    <span className="label pt-0.5">0{i + 1}</span>
                    {o}
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4 md:col-span-6 md:col-start-7 md:pt-3">
            {STACK.map((s, gi) => (
              <Reveal key={s.group} reduce={reduce} delay={gi * 0.08}>
                <div className="label mb-5">{s.group}</div>
                <ul className="space-y-2.5">
                  {s.items.map((it) => (
                    <li key={it} className="text-[15px] text-text-primary">
                      {it}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Experience ───────────────────────────── */

function Experience({ reduce }: { reduce: boolean }) {
  return (
    <section id="experience" className="px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <SectionHead index="04" title="Experience" reduce={reduce} />

        <ul>
          {EXPERIENCE.map((e, i) => (
            <li key={e.org}>
              <Reveal reduce={reduce} delay={i * 0.06}>
                <div className="grid grid-cols-1 gap-3 py-8 md:grid-cols-12 md:gap-10 md:py-10">
                  <span className="label md:col-span-2 md:pt-2">{e.years}</span>
                  <div className="md:col-span-4">
                    <h3 className="font-display text-2xl font-normal tracking-[-0.02em] text-text-primary md:text-3xl">
                      {e.role}
                    </h3>
                    <p className="mt-1 text-sm text-text-muted">
                      {e.org} · {e.where}
                    </p>
                  </div>
                  <p className="max-w-lg text-[15px] leading-relaxed text-text-muted md:col-span-5 md:col-start-8 md:pt-1">
                    {e.desc}
                  </p>
                </div>
              </Reveal>
              <Rule reduce={reduce} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────────── Contact ───────────────────────────── */

function Contact({ reduce }: { reduce: boolean }) {
  return (
    <section id="contact" className="flex min-h-[90svh] flex-col justify-center px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto w-full max-w-[1400px]">
        <SectionHead index="05" title="Contact" reduce={reduce} />

        <h2 className="font-display text-[clamp(3rem,9vw,9rem)] font-normal leading-[0.92] tracking-[-0.045em] text-text-primary">
          <MaskLines
            inView
            reduce={reduce}
            lines={["Let's build", <span key="b">something <span className="font-light italic text-text-muted">people</span></span>, "love."]}
          />
        </h2>

        <div className="mt-16 grid grid-cols-1 items-end gap-12 md:mt-24 md:grid-cols-12">
          <Reveal reduce={reduce} className="md:col-span-7">
            <p className="mb-8 max-w-md text-[15px] leading-relaxed text-text-muted">
              Have a project, a role, or an idea worth shipping? I&apos;m open to freelance and
              full-time opportunities.
            </p>
            <MagneticLink
              href="mailto:charlesallotey1995@gmail.com"
              reduce={reduce}
              className="group inline-flex items-center gap-4 rounded-full border border-border-strong py-2 pl-7 pr-2 text-base text-text-primary transition-colors duration-500 hover:border-text-primary hover:bg-text-primary hover:text-bg-base md:text-lg"
            >
              charlesallotey1995@gmail.com
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-[#0A0A0B] transition-transform duration-500 ease-out-expo group-hover:rotate-45">
                <ArrowUpRight size={18} />
              </span>
            </MagneticLink>
          </Reveal>

          <Reveal reduce={reduce} delay={0.1} className="flex flex-col gap-3 text-sm md:col-span-4 md:col-start-9 md:items-end">
            {[
              { l: "GitHub", h: "https://github.com/cnaallotey" },
              { l: "X / Twitter", h: "https://x.com/adotey_" },
              { l: "npm", h: "https://www.npmjs.com/package/@cnaallotey/auto-form-filler" },
            ].map((s) => (
              <a key={s.l} href={s.h} target="_blank" rel="noopener noreferrer" className="link-draw inline-flex items-center gap-1.5 text-text-primary">
                {s.l} <ArrowUpRight size={13} weight="light" />
              </a>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function MagneticLink({
  href,
  className,
  children,
  reduce,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  reduce: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 16, mass: 0.4 });

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.15);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={reduce ? undefined : { x: sx, y: sy }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

/* ───────────────────────────── Footer ───────────────────────────── */

function Footer() {
  return (
    <footer className="relative z-10 px-5 pb-8 md:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 border-t border-border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
        <span className="label">© {new Date().getFullYear()} Charles Nii Adotey Allotey</span>
        <span className="label hidden md:inline">Next.js · WebGL · Framer Motion</span>
        <a href="#home" className="label inline-flex items-center gap-2 transition-colors hover:text-text-primary">
          Back to top <ArrowDown size={12} className="rotate-180" />
        </a>
      </div>
    </footer>
  );
}
