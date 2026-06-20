"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";
import {
  ArrowUpRight,
  GithubLogo,
  TwitterLogo,
  EnvelopeSimple,
  Moon,
  Sun,
  Check,
  List,
  X,
  Globe,
  Browser,
} from "@phosphor-icons/react";

// Shared cinematic easing — the "Linear/Vaul" curve
const EASE = [0.32, 0.72, 0, 1] as const;

// Types for components
interface ProjectCardProps {
  title: string;
  blurb: string;
  tags: string[];
  image: string;
  liveLink?: string;
  codeLink?: string;
  badge?: string;
  layout?: "wide" | "compact";
}

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const reduce = useReducedMotion();

  // Prevent hydration flash
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  // Scroll-aware nav: hide on scroll-down, reveal on scroll-up
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (mobileMenuOpen) return;
    if (latest > prev && latest > 160) setNavHidden(true);
    else setNavHidden(false);
  });

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Work", href: "#work" },
    { name: "Experience", href: "#experience" },
    { name: "Contact", href: "#contact" },
  ];

  // Global scroll-reveal: fade-up + de-blur
  const reveal: Variants = {
    hidden: reduce
      ? { opacity: 0 }
      : { opacity: 0, y: 44, filter: "blur(12px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.9, ease: EASE },
    },
  };

  const staggerParent: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  // Hero entry helper — explicit per-element delays, masked where noted
  const heroFade = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4 } }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: EASE, delay },
        };

  const ribbonItems = [
    "Full-Stack Web Developer",
    "5+ years shipping for the web",
    "AI-powered Developer",
    "Published npm author",
    "76+ public repositories",
    "Vue · Nuxt · React · Next.js · TypeScript · Node.js · Laravel · Firebase · Tailwind",
    "Building AI-powered products",
    "Accra, Ghana — available remote",
    "Open to work · hireable: true",
  ];

  const peekImages = [
    "/projects/visoregistry.png",
    "/projects/kpashi.png",
    "/projects/community_chat.png",
    "/projects/formdrop.png",
    "/projects/nuxt_jwt_auth.png",
  ];

  const techLogos = [
    { name: "Vue", src: "/logos/vue.svg" },
    { name: "Nuxt", src: "/logos/nuxt.svg" },
    { name: "React", src: "/logos/react.svg" },
    { name: "Next.js", src: "/logos/next.svg" },
    { name: "TypeScript", src: "/logos/typescript.svg" },
    { name: "Node.js", src: "/logos/node.svg" },
    { name: "Laravel", src: "/logos/laravel.svg" },
    { name: "Tailwind", src: "/logos/tailwind.svg" },
    { name: "Firebase", src: "/logos/firebase.svg" },
    { name: "Gemini", src: "/logos/gemini.svg" },
    { name: "Claude", src: "/logos/claude.svg" },
    { name: "Cursor", src: "/logos/cursor.svg" },
  ];

  return (
    <div id="home" className="min-h-screen relative overflow-x-hidden">

      {/* Floating Pill Nav Bar — hides on scroll-down, reveals on scroll-up */}
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: navHidden ? -120 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-4xl px-4 md:px-6 py-3 brutalist-nav flex items-center justify-between"
      >
        {/* Logo / Handle */}
        <a href="#home" className="flex items-center gap-2.5 group">
          <span className="w-9 h-9 rounded-lg bg-accent-neon border-2 border-text-primary flex items-center justify-center text-[#0b0d10] font-mono text-sm font-black shadow-[2px_2px_0px_0px_var(--text-primary)] transition-all group-hover:translate-x-px group-hover:translate-y-px group-hover:shadow-none">
            C
          </span>
          <span className="font-mono text-xs text-text-primary group-hover:text-accent-neon font-bold transition-colors uppercase tracking-wider">
            @cnaallotey
          </span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 bg-background/60 p-1 rounded-xl border-2 border-text-primary">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-text-primary/70 hover:text-text-primary hover:bg-surface-elevated/80 transition-all duration-200"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg bg-surface-elevated border-2 border-text-primary flex items-center justify-center text-text-primary shadow-[2px_2px_0px_0px_var(--text-primary)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all cursor-pointer"
            aria-label="Toggle Theme"
          >
            {mounted && theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Contact Button (Desktop) */}
          <a
            href="#contact"
            className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-accent-neon text-[#0b0d10] border-2 border-text-primary shadow-[2px_2px_0px_0px_var(--text-primary)] hover:translate-x-px hover:translate-y-px hover:shadow-none font-mono text-xs transition-all uppercase tracking-wider font-bold"
          >
            Let&apos;s Talk
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-lg bg-surface-elevated border-2 border-text-primary flex items-center justify-center text-text-primary shadow-[2px_2px_0px_0px_var(--text-primary)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all cursor-pointer"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <List size={18} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-40 w-[90%] p-6 rounded-2xl bg-surface-card border-2 border-text-primary shadow-[6px_6px_0px_0px_var(--accent-neon)] md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4, ease: EASE }}
                  className="py-2.5 border-b border-border-hairline/30 text-sm font-mono text-text-primary hover:text-accent-neon transition-colors font-bold uppercase tracking-wider"
                >
                  {link.name}
                </motion.a>
              ))}
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 w-full text-center py-3.5 rounded-xl bg-accent-neon text-[#0b0d10] border-2 border-text-primary shadow-[4px_4px_0px_0px_var(--text-primary)] font-mono text-sm font-bold uppercase tracking-wider hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all"
              >
                Let&apos;s Talk
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section — giant name + diagonal marquee ribbon */}
      <section className="relative z-10 min-h-[100svh] flex flex-col justify-center overflow-hidden mt-16 md:mt-0 px-4">
        {/* Giant name block with ribbon punched across it */}
        <div className="relative w-full flex items-center justify-center mt-16 md:mt-8">
          <motion.h1
            className="hero-name text-center"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
          >
            CHARLES<span className="reg">©</span>
          </motion.h1>

          {/* Diagonal neon marquee ribbon */}
          <motion.div
            className="ribbon top-1/2 -translate-y-1/2 py-2.5 md:py-3 rotate-[-5deg]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}
          >
            <div className="ribbon-track">
              {[0, 1].map((dup) => (
                <div className="ribbon-item" key={dup} aria-hidden={dup === 1}>
                  {ribbonItems.map((item, i) => (
                    <React.Fragment key={i}>
                      <span>{item}</span>
                      <span className="ribbon-dot" />
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Avatar punched through the ribbon */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.9 }}
          >
            <div className="rounded-full p-0.5 bg-accent-neon border-2 border-text-primary shadow-[4px_4px_0px_0px_var(--text-primary)]">
              <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden bg-bg-base border-2 border-bg-base">
                <Image
                  src="/portraits/hero.png"
                  alt="Charles Nii Adotey Allotey"
                  fill
                  sizes="112px"
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tagline */}
        <motion.p
          {...heroFade(1.0)}
          className="text-center font-display font-semibold text-xl sm:text-2xl md:text-3xl text-text-primary mt-12 md:mt-16 px-6"
        >
          The world&apos;s most curious full-stack developer{" "}
          <span className="text-text-muted">(human)</span>
        </motion.p>

        {/* Tech row — official brand logos in circular badges */}
        <motion.div
          {...heroFade(1.1)}
          className="mt-8 flex flex-col items-center gap-5"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted">
            Building daily with
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 max-w-2xl px-6">
            {techLogos.map((tech) => (
              <motion.div
                key={tech.name}
                title={tech.name}
                whileHover={reduce ? undefined : { y: -4 }}
                transition={{ type: "spring", stiffness: 350, damping: 18 }}
                className="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-white border-2 border-text-primary shadow-[3px_3px_0px_0px_var(--accent-neon)] hover:shadow-[1px_1px_0px_0px_var(--text-primary)] transition-shadow duration-200 cursor-default"
              >
                <Image
                  src={tech.src}
                  alt={`${tech.name} logo`}
                  width={36}
                  height={36}
                  unoptimized
                  className="w-8 h-8 md:w-9 md:h-9 object-contain"
                />
                {/* Hover label */}
                <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-text-primary text-white dark:text-black font-mono text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          {...heroFade(1.2)}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton
            href="#work"
            reduce={!!reduce}
            className="island-button island-button-primary"
          >
            <span>View my work</span>
            <span className="island-button-arrow">↗</span>
          </MagneticButton>
          <MagneticButton
            href="#contact"
            reduce={!!reduce}
            className="island-button island-button-secondary"
          >
            <span>Get in touch</span>
            <span className="island-button-arrow">→</span>
          </MagneticButton>
        </motion.div>

        {/* Project thumbnails peeking from the bottom */}
        <motion.div
          aria-hidden
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 1.3 }}
          className="hidden absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[42%] items-end gap-5 px-8 pointer-events-none"
        >
          {peekImages.map((src, i) => (
            <div
              key={src}
              className="relative w-[15.5rem] aspect-[16/10] rounded-t-2xl overflow-hidden border border-border-hairline/70 shadow-2xl bg-bg-base"
              style={{ transform: `translateY(${Math.abs(i - 2) * 14}px)` }}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="248px"
                className="object-cover object-top"
              />
            </div>
          ))}
        </motion.div>
      </section>

      {/* About Me Section — Brutalist / Overlapping Layout */}
      <section
        id="about"
        className="relative z-10 py-32 md:py-48 max-w-6xl mx-auto px-6 md:px-8 overflow-hidden"
      >
        {/* Giant background typography */}
        <div className="!text-fill-watermark text-[clamp(4.5rem,14vw,13rem)] select-none pointer-events-none absolute top-4 left-0 w-full text-center leading-[0.8] tracking-[-0.045em] font-bold font-display z-10">
          ABOUT CHARLES
        </div>

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-stretch relative z-10 mt-16 md:mt-24"
        >
          {/* About Left: Workspace image in large format */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="double-bezel-wrapper w-full aspect-[4/3] lg:aspect-auto lg:h-[480px]">
              <div className="double-bezel-inner p-0 overflow-hidden relative group">
                <Image
                  src="/portraits/workspace.png"
                  alt="Charles working at his desk"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

              </div>
            </div>
          </div>

          {/* About Right: Text biography in a floating glass bezel card */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="double-bezel-wrapper w-full">
              <div className="double-bezel-inner p-6 sm:p-8 md:p-10">
                <span className="neon-eyebrow mb-6">
                  About Me
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-[-0.03em] text-text-primary mb-6 leading-[1.02]">
                  My story &amp; philosophy
                </h2>

                <div className="space-y-4 text-base text-text-muted leading-relaxed">
                  <p>
                    I&apos;m Charles Nii Adotey Allotey — a full-stack web developer
                    from Accra, Ghana with around five years of building things for
                    the web.
                  </p>
                  <p>
                    I currently work at{" "}
                    <strong className="text-text-primary">Vue School</strong>, one of
                    the leading platforms for learning Vue.js, where I build internal
                    tools and applications used across the product.
                  </p>

                  <AnimatePresence>
                    {showFullBio && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="overflow-hidden space-y-4 pt-1"
                      >
                        <p>
                          My home turf is the{" "}
                          <strong className="text-text-primary">
                            Vue and Nuxt ecosystem
                          </strong>
                          , but I&apos;m just as comfortable in{" "}
                          <strong className="text-text-primary">
                            React and Next.js
                          </strong>{" "}
                          — I build across both, choosing the right tool for the job.
                          On top of that sits TypeScript and TailwindCSS, backed by
                          Node/Express or Laravel and databases like MongoDB,
                          PostgreSQL and Firebase.
                        </p>
                        <p>
                          Lately, I&apos;ve been going deep on{" "}
                          <strong className="text-text-primary">
                            AI-powered applications
                          </strong>
                          , building with Google&apos;s Gemini API and Genkit to add
                          intelligence to the products I create. I&apos;m also a
                          builder of developer tools — I&apos;ve published an npm
                          package and a component-sharing system — and I enjoy
                          teaching, having mentored developers through frontend
                          training programs.
                        </p>
                        <p className="italic text-accent-neon font-mono text-sm border-l-2 border-accent-neon pl-3 mt-4">
                          &quot;A web developer with the ambition of using code to
                          bring smiles to the faces of people.&quot;
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => setShowFullBio(!showFullBio)}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono text-accent-neon hover:text-text-primary transition-colors cursor-pointer"
                  >
                    {showFullBio ? "Read less ←" : "Read full bio →"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Grid — Explosive Cards layout */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
        >
          {[
            { num: "01", label: "Currently building", desc: "AI-powered SaaS products" },
            { num: "02", label: "Always leveling up", desc: "My TypeScript game" },
            { num: "03", label: "Design", desc: "Fluent Figma-to-code" },
            { num: "04", label: "Off the clock", desc: "Clean code & clutch gaming" },
          ].map((stat, idx) => (
            <div key={idx} className="double-bezel-wrapper hover:scale-[1.02] transition-transform duration-300">
              <div className="double-bezel-inner p-6 flex items-start gap-4">
                <span className="text-outline-neon text-4xl font-display font-semibold select-none leading-none">
                  {stat.num}
                </span>
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent-neon block mb-1.5">
                    {stat.label}
                  </span>
                  <p className="text-sm font-semibold text-text-primary leading-snug">
                    {stat.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Skills & Arsenal Section — Dual Marquee & Bold Grid */}
      <section
        id="skills"
        className="relative z-10 py-32 md:py-48 bg-surface-card/10 border-y border-border-hairline/40 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          {/* Header */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-2xl mb-12"
          >
            <span className="neon-eyebrow mb-6">
              Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-[-0.03em] text-text-primary leading-[1.02]">
              My technical stack &amp; skills
            </h2>
            <p className="text-base text-text-muted mt-4 leading-relaxed">
              I build with a stack optimized for speed, performance, and scalability. I value type-safety, rapid deployment, and intelligent automation.
            </p>
          </motion.div>
        </div>

        {/* Explosive Dual-Row Tech Marquee */}
        <div className="w-full py-8 bg-surface-card border-y border-border-hairline my-16 rotate-[-1.5deg] relative z-10 shadow-2xl scale-[1.03]">
          {/* Row 1: Left Scrolling */}
          <div className="flex whitespace-nowrap overflow-hidden pb-4">
            <div className="ribbon-track">
              {[0, 1].map((dup) => (
                <div key={dup} className="inline-flex items-center gap-12 font-display font-black text-3xl md:text-5xl tracking-tighter" aria-hidden={dup === 1}>
                  {["VUE 3", "NUXT 3", "REACT", "NEXT.JS", "TYPESCRIPT", "TAILWIND CSS", "GSAP", "JAVASCRIPT", "HTML5", "CSS3"].map((tech, i) => (
                    <React.Fragment key={i}>
                      <span className={i % 3 === 0 ? "text-accent-neon" : i % 3 === 1 ? "text-outline" : "text-text-primary"}>
                        {tech}
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full bg-border-hairline" />
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Right Scrolling (Reverse) */}
          <div className="flex whitespace-nowrap overflow-hidden pt-4 border-t border-border-hairline/40">
            <div className="marquee-track-reverse">
              {[0, 1].map((dup) => (
                <div key={dup} className="inline-flex items-center gap-12 font-display font-black text-3xl md:text-5xl tracking-tighter" aria-hidden={dup === 1}>
                  {["NODE.JS", "EXPRESS", "LARAVEL", "FIREBASE", "MONGODB", "POSTGRESQL", "GEMINI API", "GENKIT AI", "FIGMA", "GIT/GITHUB", "NPM"].map((tech, i) => (
                    <React.Fragment key={i}>
                      <span className={i % 3 === 0 ? "text-text-primary" : i % 3 === 1 ? "text-outline-neon" : "text-accent-neon"}>
                        {tech}
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full bg-border-hairline" />
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-8">
          {/* Outcome list transformed into Bento-like Cards */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="pt-8"
          >
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted mb-8 text-center md:text-left">
              What I actually deliver
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Architect and build full-stack web apps end-to-end",
                "Turn Figma designs into pixel-accurate, responsive interfaces",
                "Build real-time features (chat, live data) and auth systems",
                "Integrate AI/LLM capabilities into standard products",
                "Create reusable component libraries & developer tooling",
                "Mentor and teach frontend development to beginners",
              ].map((outcome, idx) => (
                <div key={idx} className="double-bezel-wrapper hover:scale-[1.02] transition-transform duration-300">
                  <div className="double-bezel-inner p-6 flex items-start gap-4">
                    <span className="w-8 h-8 rounded-full bg-accent-neon/15 border border-accent-neon/30 flex items-center justify-center text-accent-neon shrink-0">
                      <Check size={16} weight="bold" />
                    </span>
                    <span className="text-sm font-semibold text-text-primary leading-snug">
                      {outcome}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section — Bento Grid & Big Typography */}
      <section
        id="work"
        className="relative z-10 py-32 md:py-48 max-w-6xl mx-auto px-6 md:px-8 overflow-hidden"
      >
        {/* Giant background typography */}
        <div className="!ext-fill-watermark text-[clamp(4.5rem,14vw,13rem)] select-none pointer-events-none absolute top-4 left-0 w-full text-center leading-[0.8] tracking-[-0.045em] font-bold font-display z-10">
          SELECTED WORK
        </div>

        {/* Section Title */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 relative z-10 mt-16 md:mt-24"
        >
          <div>
            <span className="neon-eyebrow mb-6">
              Selected Work
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-[-0.03em] text-text-primary leading-[1.02]">
              Featured Projects
            </h2>
          </div>
          <a
            href="https://github.com/cnaallotey"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-text-muted hover:text-text-primary transition-colors flex items-center gap-1.5 group"
          >
            View all on GitHub
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </a>
        </motion.div>

        {/* Asymmetrical Bento Grid */}
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-20 relative z-10"
        >
          <motion.div variants={reveal} className="md:col-span-8">
            <ProjectCard
              title="FormDrop — AI Forms"
              blurb="An AI app built with the Google Gemini API for intelligent and dynamic form handling."
              tags={["Next.js", "Firebase", "Gemini API", "TypeScript", "AI"]}
              image="/projects/formdrop2.png"
              liveLink="https://formdrop-one.vercel.app"
              badge="AI powered forms Backend"
              layout="wide"
            />
          </motion.div>

          <motion.div variants={reveal} className="md:col-span-4">
            <ProjectCard
              title="Auto Form Filler"
              blurb="A lightweight open source JavaScript library published to npm that automatically fills forms based on URL query parameters."
              tags={["TypeScript", "npm", "Open Source"]}
              image="/projects/auto_form_filler.png"
              codeLink="https://www.npmjs.com/package/@cnaallotey/auto-form-filler"
              badge="Published npm Package"
              layout="compact"
            />
          </motion.div>

          <motion.div variants={reveal} className="md:col-span-4">
            <ProjectCard
              title="Nuxt JWT Auth"
              blurb="A complete, from-scratch implementation of JWT auth in Nuxt 3. Covers tokens, refresh flow and protected routes without external APIs."
              tags={["Nuxt 3", "TypeScript", "JWT"]}
              image="/projects/nuxt_jwt_auth.png"
              codeLink="https://github.com/cnaallotey/nuxt-jwt-auth"
              badge="Most-Starred Repo"
              layout="compact"
            />
          </motion.div>

          <motion.div variants={reveal} className="md:col-span-4">
            <ProjectCard
              title="Community Chat"
              blurb="A real-time community chat application built on Nuxt, featuring live message synchronization."
              tags={["Nuxt", "Socket.io", "Node.js", "Vue"]}
              image="/projects/community_chat.png"
              liveLink="https://community-chat-phi.vercel.app"
              layout="compact"
            />
          </motion.div>

          <motion.div variants={reveal} className="md:col-span-8">
            <ProjectCard
              title="Kpashi — E-Commerce Platform"
              blurb="A modern e-commerce storefront application. Full product/order management built as a client + backend pair."
              tags={["Nuxt 3", "Node.js", "PostgreSQL", "Resend", "TailwindCSS"]}
              image="/projects/kpashi.png"
              codeLink="https://github.com/cnaallotey"
              layout="wide"
            />
          </motion.div>

          <motion.div
            variants={reveal}
            className="md:col-span-4 md:col-start-9 md:row-start-2"
          >
            <ProjectCard
              title="Luxury Real-Estate Listings Management platform"
              blurb="A luxury real-estate listings platform with an admin dashboard built on Next.js and Firebase."
              tags={["Next.js", "Firebase", "TailwindCSS"]}
              image="/projects/nm-app.png"
              liveLink="https://nouvelle-maison-application-nu.vercel.app"
              badge="Real-Estate SaaS"
              layout="compact"
            />
          </motion.div>
        </motion.div>

        {/* Also worth showing list — Brutalist Editorial Index */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="border-t-2 border-text-primary pt-16"
        >
          <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-accent-neon mb-8">
            Archive &amp; Additional Projects
          </h3>
          
          <div className="flex flex-col border-t-2 border-text-primary">
            {[
              {
                num: "01",
                title: "VisoRegistry",
                type: "AI Product",
                desc: "Premium participant registration and data-management system with AI assistance (Next.js + Firebase)",
                link: "https://visoregistry.vercel.app",
                linkText: "Live Site ↗"
              },
              {
                num: "02",
                title: "Ignite AI",
                type: "AI App / Nuxt",
                desc: "AI-powered application built on Nuxt offering smart generation capabilities",
                link: "https://ignite-ai-psi.vercel.app",
                linkText: "Live Site ↗"
              },
              {
                num: "03",
                title: "Component Builder",
                type: "Dev Tool",
                desc: "Tool for creating, sharing and reusing web components across frameworks",
                link: "https://github.com/cnaallotey",
                linkText: "GitHub Profile ↗"
              },
              {
                num: "04",
                title: "EazzySocial",
                type: "Social SaaS",
                desc: "Social-media management product iterated across several builds",
                link: "https://github.com/cnaallotey",
                linkText: "GitHub Profile ↗"
              },
              {
                num: "05",
                title: "Client Landing Pages",
                type: "Marketing Sites",
                desc: "Werkbuddy, Miles Mobility, Vida Dzakumah, and more polished marketing landing pages",
                link: "https://github.com/cnaallotey",
                linkText: "GitHub Profile ↗"
              }
            ].map((item) => (
              <a
                key={item.num}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="grid grid-cols-1 md:grid-cols-12 py-6 border-b-2 border-text-primary items-center gap-4 transition-all duration-300 hover:bg-surface-elevated/40 px-4 group"
              >
                {/* Index Number */}
                <div className="col-span-1 font-mono text-sm text-text-muted group-hover:text-accent-neon transition-colors">
                  {item.num}
                </div>

                {/* Title & Badge */}
                <div className="col-span-1 md:col-span-3 flex flex-col md:flex-row md:items-center gap-3">
                  <h4 className="text-base font-mono font-bold uppercase tracking-wider text-text-primary group-hover:text-accent-neon transition-colors font-display">
                    {item.title}
                  </h4>
                  <span className="w-max px-2.5 py-0.5 rounded border border-border-hairline text-[9px] font-mono font-medium tracking-wide uppercase bg-surface text-text-muted group-hover:border-accent-neon/30 transition-colors">
                    {item.type}
                  </span>
                </div>

                {/* Description */}
                <div className="col-span-1 md:col-span-6 text-sm text-text-muted group-hover:text-text-primary transition-colors leading-relaxed">
                  {item.desc}
                </div>

                {/* Link Action */}
                <div className="col-span-1 md:col-span-2 md:text-right text-xs font-mono font-bold uppercase tracking-wider text-text-muted group-hover:text-text-primary transition-colors">
                  {item.linkText}
                </div>
              </a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Experience Section — Brutalist Grid with Giant Years */}
      <section
        id="experience"
        className="relative z-10 py-32 md:py-48 bg-surface-card/10 border-y border-border-hairline/40 overflow-hidden"
      >
        {/* Giant background typography */}
        <div className="!text-fill-watermark text-[clamp(4.5rem,14vw,13rem)] select-none pointer-events-none absolute top-4 left-0 w-full text-center leading-[0.8] tracking-[-0.045em] font-bold font-display z-10">
          MY JOURNEY
        </div>

        <div className="max-w-5xl mx-auto px-6 md:px-8 relative z-10">
          {/* Header */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16 text-center max-w-xl mx-auto flex flex-col items-center mt-16 md:mt-24"
          >
            <span className="neon-eyebrow mb-6">
              Journey
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-[-0.03em] text-text-primary leading-[1.02]">
              Work History
            </h2>
            <p className="text-sm text-text-muted mt-3">
              Around 5 years building products, teaching frontend, and maintaining tools.
            </p>
          </motion.div>

          {/* Timeline Stack */}
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="space-y-16"
          >
            {/* Job 1: Vue School */}
            <motion.div variants={reveal} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-4 md:text-right pt-2">
                <span className="text-outline-neon text-6xl md:text-8xl font-display font-black leading-none select-none tracking-tighter block">
                  2023
                </span>
                <span className="font-mono text-xs text-text-muted uppercase tracking-widest mt-1 block">
                  Vue School
                </span>
              </div>
              <div className="md:col-span-8 double-bezel-wrapper">
                <div className="double-bezel-inner">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <span className="font-mono text-[10px] tracking-[0.15em] text-accent-neon uppercase font-medium">
                        Leading Education Platform
                      </span>
                      <h3 className="text-lg font-display font-semibold text-text-primary">
                        Web Developer
                      </h3>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-surface-elevated border border-border-hairline/50 font-mono text-xs text-text-muted">
                      Remote · Present
                    </span>
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Build and maintain internal tools and web applications for one of the world&apos;s leading Vue.js education platforms. Work across the Vue/Nuxt stack, including affiliate/marketing tooling and course-supporting apps.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Job 2: Freelance */}
            <motion.div variants={reveal} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-4 md:text-right pt-2">
                <span className="text-outline-neon text-6xl md:text-8xl font-display font-black leading-none select-none tracking-tighter block">
                  2021
                </span>
                <span className="font-mono text-xs text-text-muted uppercase tracking-widest mt-1 block">
                  Freelance
                </span>
              </div>
              <div className="md:col-span-8 double-bezel-wrapper">
                <div className="double-bezel-inner">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <span className="font-mono text-[10px] tracking-[0.15em] text-accent-neon uppercase font-medium">
                        Startups &amp; Clients
                      </span>
                      <h3 className="text-lg font-display font-semibold text-text-primary">
                        Full-Stack Developer
                      </h3>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-surface-elevated border border-border-hairline/50 font-mono text-xs text-text-muted">
                      Accra, Ghana · Present
                    </span>
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Design and build web products for clients and startups — SaaS apps, e-commerce dashboards, registration systems, and marketing sites. End-to-end ownership from Figma concepts to deployment on Vercel/Netlify.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Job 3: Thrive Mentor */}
            <motion.div variants={reveal} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-4 md:text-right pt-2">
                <span className="text-outline-neon text-6xl md:text-8xl font-display font-black leading-none select-none tracking-tighter block">
                  2022
                </span>
                <span className="font-mono text-xs text-text-muted uppercase tracking-widest mt-1 block">
                  Thrive Program
                </span>
              </div>
              <div className="md:col-span-8 double-bezel-wrapper">
                <div className="double-bezel-inner">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <span className="font-mono text-[10px] tracking-[0.15em] text-accent-neon uppercase font-medium">
                        Developer Mentorship
                      </span>
                      <h3 className="text-lg font-display font-semibold text-text-primary">
                        Frontend Mentor / Instructor
                      </h3>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-surface-elevated border border-border-hairline/50 font-mono text-xs text-text-muted">
                      2022 – 2025
                    </span>
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Guided aspiring developers through frontend fundamentals (HTML, CSS, JavaScript, Vue) via hands-on classes, codebase walkthroughs, and practical team projects.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section — Explosive Editorial Banner */}
      <section
        id="contact"
        className="relative z-10 py-32 md:py-48 max-w-6xl mx-auto px-6 md:px-8 overflow-hidden"
      >
        {/* Giant background typography */}
        <div className="!text-fill-watermark text-[clamp(4.5rem,14vw,13rem)] select-none pointer-events-none absolute top-4 left-0 w-full text-center leading-[0.8] tracking-[-0.045em] font-bold font-display z-10">
          GET IN TOUCH
        </div>

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center relative z-10 mt-16 md:mt-24"
        >
          {/* Contact Copy */}
          <div className="md:col-span-7">
            <span className="neon-eyebrow mb-6">
              Contact
            </span>
            <h2 className="font-display font-semibold tracking-[-0.02em] text-text-primary mb-6 leading-[0.98] text-[clamp(2.25rem,5vw,4rem)]">
              Let&apos;s build something <span className="text-accent-neon">people love.</span>
            </h2>
            <p className="text-base sm:text-lg text-text-muted mb-8 leading-relaxed">
              Have a project, a full-time role, or an idea worth shipping?
              I&apos;m open to freelance work and full-time opportunities. Drop me
              an email or find me on socials.
            </p>

            {/* Email Island Button */}
            <MagneticButton
              href="mailto:charlesallotey1995@gmail.com"
              reduce={!!reduce}
              className="island-button island-button-neon mb-8"
            >
              <span>Email me</span>
              <span className="island-button-arrow">↗</span>
            </MagneticButton>

            {/* Links Block */}
            <div className="flex flex-col gap-4 font-mono text-sm border-t border-border-hairline/50 pt-8">
              <a
                href="mailto:charlesallotey1995@gmail.com"
                className="flex items-center gap-3 text-text-muted hover:text-accent-neon transition-colors w-max"
              >
                <EnvelopeSimple size={18} />
                <span>charlesallotey1995@gmail.com</span>
              </a>
              <a
                href="https://github.com/cnaallotey"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-text-muted hover:text-accent-neon transition-colors w-max"
              >
                <GithubLogo size={18} />
                <span>github.com/cnaallotey</span>
              </a>
              <a
                href="https://x.com/adotey_"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-text-muted hover:text-accent-neon transition-colors w-max"
              >
                <TwitterLogo size={18} />
                <span>x.com/adotey_</span>
              </a>
            </div>
          </div>

          {/* Contact Portrait */}
          <div className="md:col-span-5 flex justify-center">
            <div className="double-bezel-wrapper w-full max-w-[340px] md:max-w-sm aspect-square">
              <div className="double-bezel-inner p-0 overflow-hidden relative group rounded-full">
                <Image
                  src="/portraits/contact.png"
                  alt="Charles genuine smile portrait"
                  fill
                  sizes="(max-width: 768px) 340px, 400px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-border-hairline/80 bg-surface-card/25 py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-6 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-accent-neon">
              C.A.
            </span>
            <span className="font-mono text-[10px] text-text-muted">
              © {new Date().getFullYear()} Charles Nii Adotey Allotey.
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[10px] text-text-muted">
            <span>Built with Next.js (App) &amp; Tailwind</span>
            <span>·</span>
            <span>hireable: true</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Magnetic Button — subtle spring pull toward the cursor
function MagneticButton({
  href,
  className,
  children,
  reduce,
  onClick,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  reduce: boolean;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.3);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={reduce ? undefined : { x: springX, y: springY }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

// Project Card Helper Component
function ProjectCard({
  title,
  blurb,
  tags,
  image,
  liveLink,
  codeLink,
  badge,
  layout = "compact",
}: ProjectCardProps) {
  const isWide = layout === "wide";

  return (
    <div className="group relative flex flex-col h-full bg-surface border-2 border-text-primary rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_var(--text-primary)] hover:shadow-[10px_10px_0px_0px_var(--accent-neon)] hover:-translate-x-1.5 hover:-translate-y-1.5 transition-all duration-300 ease-out">
      {isWide ? (
        /* Wide Layout: Desktop Horizontal Split, Mobile Vertical Stack */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-6 md:p-8 items-stretch h-full">
          {/* Content Left */}
          <div className="flex flex-col justify-between h-full order-2 md:order-1">
            <div>
              {/* Tech tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded bg-[#f4f6f8] border border-text-primary font-mono text-[10px] text-[#0b0d10] font-bold hover:border-accent-neon transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Info */}
              <h3 className="text-xl md:text-2xl font-display font-bold text-text-primary mb-3 leading-tight tracking-tight">
                {title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed mb-6 md:mb-0">
                {blurb}
              </p>
            </div>

            {/* Brutalist Buttons */}
            <div className="flex flex-wrap gap-3 border-t border-border-hairline pt-5 mt-auto">
              {liveLink && (
                <a
                  href={liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent-neon text-[#0b0d10] font-mono font-bold text-xs uppercase rounded-lg border-2 border-text-primary shadow-[2px_2px_0px_0px_var(--text-primary)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--text-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150"
                >
                  <Globe size={14} weight="bold" />
                  <span>Live Site</span>
                  <ArrowUpRight size={12} weight="bold" />
                </a>
              )}
              {codeLink && (
                <a
                  href={codeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#f4f6f8] text-[#0b0d10] font-mono font-bold text-xs uppercase rounded-lg border-2 border-text-primary shadow-[2px_2px_0px_0px_var(--text-primary)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--text-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150"
                >
                  <GithubLogo size={14} weight="bold" />
                  <span>View Source</span>
                  <ArrowUpRight size={12} weight="bold" />
                </a>
              )}
              {!liveLink && !codeLink && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f4f6f8]/40 text-[#0b0d10]/50 font-mono font-bold text-[10px] uppercase rounded-md border border-text-primary/30">
                  <Browser size={12} />
                  <span>Private Build</span>
                </div>
              )}
            </div>
          </div>

          {/* Mockup Right */}
          <div className="relative aspect-[16/10] md:aspect-auto w-full min-h-[220px] md:min-h-full bg-background border-2 border-text-primary rounded-xl overflow-hidden order-1 md:order-2">
            <Image
              src={image}
              alt={`${title} screenshot`}
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
            />
            {badge && (
              <span className="absolute top-3 left-3 bg-accent-neon text-[#0b0d10] border border-text-primary px-2.5 py-1 rounded-md font-mono text-[9px] font-bold tracking-wider uppercase shadow-[2px_2px_0px_0px_var(--text-primary)]">
                {badge}
              </span>
            )}
          </div>
        </div>
      ) : (
        /* Compact Layout: Vertical Stack */
        <div className="flex flex-col h-full p-6 justify-between">
          <div>
            {/* Card Top: Mockup shot */}
            <div className="aspect-[16/10] w-full bg-background border-2 border-text-primary rounded-xl overflow-hidden relative mb-5">
              <Image
                src={image}
                alt={`${title} screenshot`}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
              />
              {badge && (
                <span className="absolute top-3 left-3 bg-accent-neon text-[#0b0d10] border border-text-primary px-2.5 py-1 rounded-md font-mono text-[9px] font-bold tracking-wider uppercase shadow-[2px_2px_0px_0px_var(--text-primary)]">
                  {badge}
                </span>
              )}
            </div>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-1.5 mb-3.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded bg-[#f4f6f8] border border-text-primary font-mono text-[10px] text-[#0b0d10] font-bold hover:border-accent-neon transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Info */}
            <h3 className="text-xl font-display font-bold text-text-primary mb-2 leading-tight tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed mb-6">
              {blurb}
            </p>
          </div>

          {/* Brutalist Buttons */}
          <div className="flex flex-wrap gap-3 border-t border-border-hairline pt-4 mt-auto">
            {liveLink && (
              <a
                href={liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-accent-neon text-[#0b0d10] font-mono font-bold text-xs uppercase rounded-lg border-2 border-text-primary shadow-[2px_2px_0px_0px_var(--text-primary)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--text-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150"
              >
                <Globe size={14} weight="bold" />
                <span>Live Site</span>
                <ArrowUpRight size={12} weight="bold" />
              </a>
            )}
            {codeLink && (
              <a
                href={codeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#f4f6f8] text-[#0b0d10] font-mono font-bold text-xs uppercase rounded-lg border-2 border-text-primary shadow-[2px_2px_0px_0px_var(--text-primary)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--text-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150"
              >
                <GithubLogo size={14} weight="bold" />
                <span>View Source</span>
                <ArrowUpRight size={12} weight="bold" />
              </a>
            )}
            {!liveLink && !codeLink && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f4f6f8]/40 text-[#0b0d10]/50 font-mono font-bold text-[10px] uppercase rounded-md border border-text-primary/30">
                <Browser size={12} />
                <span>Private Build</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
