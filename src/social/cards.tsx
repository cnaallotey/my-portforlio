import React from "react";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { ICONS, DOG_A } from "@/components/PixelArt";
import { PROJECTS } from "@/data/projects";

// Share images drawn as little CA-OS desktops: menu bar, a readme window
// with the headline, the product icons and the dog. Rendered by next/og
// (Satori), so every container is an explicit flexbox and colours are
// literal values rather than CSS variables.

export const SIZES = {
  og: { width: 1200, height: 630 },
  x: { width: 1500, height: 500 },
  linkedin: { width: 1584, height: 396 },
} as const;

export type SocialKind = keyof typeof SIZES;

const SITE_HOST = "charlesallotey.clientra.tech";

const SCREEN = "#12100D";
const WIN = "#1B1814";
const CREAM = "#F0E8DA";
const MUTED = "#9A9286";
const FAINT = "#4F4A42";
const LIME = "#C8F94D";

const PALETTE: Record<string, string> = {
  "#": CREAM,
  w: "#2B2721",
  "+": LIME,
  b: "#E2B46C",
  d: "#B07A3A",
  k: SCREEN,
};

const seeded = (i: number) => {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

function Sprite({ rows, px }: { rows: string[]; px: number }) {
  const w = rows[0].length;
  const h = rows.length;
  const rects: React.ReactNode[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < w) {
      const c = row[x];
      let run = 1;
      while (x + run < w && row[x + run] === c) run++;
      if (PALETTE[c]) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} fill={PALETTE[c]} />);
      x += run;
    }
  });
  return (
    <svg width={w * px} height={h * px} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges">
      {rects}
    </svg>
  );
}

function Stars({ width, height, count }: { width: number; height: number; count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const s = seeded(i) < 0.25 ? 3 : 2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: Math.round(seeded(i + 300) * width),
              top: Math.round(seeded(i + 600) * height),
              width: s,
              height: s,
              backgroundColor: CREAM,
              opacity: 0.15 + seeded(i + 900) * 0.45,
            }}
          />
        );
      })}
    </>
  );
}

function Sparkle({ x, y, arm }: { x: number; y: number; arm: number }) {
  return (
    <>
      <div style={{ position: "absolute", left: x - arm, top: y - 1, width: arm * 2 + 2, height: 2, backgroundColor: CREAM }} />
      <div style={{ position: "absolute", left: x - 1, top: y - arm, width: 2, height: arm * 2 + 2, backgroundColor: CREAM }} />
      <div style={{ position: "absolute", left: x - 2, top: y - 2, width: 6, height: 6, backgroundColor: CREAM }} />
    </>
  );
}

function MenuBar({ height, fs }: { height: number; fs: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height,
        padding: `0 ${fs * 1.2}px`,
        backgroundColor: WIN,
        borderBottom: `3px solid ${CREAM}`,
        fontFamily: "Silkscreen",
        fontSize: fs,
        color: CREAM,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: fs * 1.6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: fs * 0.6 }}>
          <div style={{ width: fs, height: fs, backgroundColor: LIME }} />
          <span>CA-OS</span>
        </div>
        {["Work", "About", "Writing", "Contact"].map((m) => (
          <span key={m} style={{ color: MUTED }}>
            {m.toUpperCase()}
          </span>
        ))}
      </div>
      <span style={{ color: LIME }}>{SITE_HOST.toUpperCase()}</span>
    </div>
  );
}

function Stripes({ height }: { height: number }) {
  return (
    <div
      style={{
        flexGrow: 1,
        height,
        backgroundImage: `linear-gradient(to bottom, ${CREAM} 0px, ${CREAM} 2px, transparent 2px, transparent 4px)`,
        backgroundSize: `100% 4px`,
        opacity: 0.4,
      }}
    />
  );
}

function Window({
  title,
  left,
  top,
  width,
  fs,
  children,
}: {
  title: string;
  left: number;
  top: number;
  width: number;
  fs: number;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        display: "flex",
        flexDirection: "column",
        backgroundColor: WIN,
        border: `3px solid ${CREAM}`,
        boxShadow: "10px 10px 0 rgba(0,0,0,0.55)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: fs * 0.8,
          height: fs * 2.3,
          padding: `0 ${fs * 0.6}px`,
          borderBottom: `3px solid ${CREAM}`,
        }}
      >
        <div style={{ width: fs, height: fs, border: `3px solid ${CREAM}` }} />
        <Stripes height={fs * 0.75} />
        <span style={{ fontFamily: "Silkscreen", fontSize: fs, color: CREAM }}>{title}</span>
        <Stripes height={fs * 0.75} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", padding: fs * 1.8 }}>{children}</div>
    </div>
  );
}

function Headline({ fs }: { fs: number }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        fontFamily: "Instrument Serif",
        fontSize: fs,
        lineHeight: 1,
        letterSpacing: -fs * 0.02,
        color: CREAM,
      }}
    >
      <span>I build products</span>
      <div style={{ display: "flex" }}>
        <span>people&nbsp;</span>
        <span style={{ fontStyle: "italic", color: LIME }}>actually</span>
        <span>&nbsp;use.</span>
      </div>
    </div>
  );
}

function ReadmeBody({ fs, label }: { fs: number; label: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontFamily: "Silkscreen", fontSize: label, color: MUTED, marginBottom: label * 1.4 }}>
        CHARLES ALLOTEY · FULL-STACK DEVELOPER
      </span>
      <Headline fs={fs} />
      <span style={{ fontFamily: "JetBrains Mono", fontSize: label * 1.15, color: MUTED, marginTop: label * 1.6 }}>
        Vue School · Clientra · six products, all live
      </span>
    </div>
  );
}

function Icons({
  left,
  top,
  cols,
  cell,
  px,
  fs,
  rowGap,
}: {
  left: number;
  top: number;
  cols: number;
  cell: number;
  px: number;
  fs: number;
  rowGap: number;
}) {
  return (
    <div style={{ position: "absolute", left, top, width: cols * cell, display: "flex", flexWrap: "wrap", rowGap }}>
      {PROJECTS.map((p) => (
        <div key={p.slug} style={{ width: cell, display: "flex", flexDirection: "column", alignItems: "center", gap: fs * 0.6 }}>
          <Sprite rows={ICONS[p.slug]} px={px} />
          <span style={{ fontFamily: "Silkscreen", fontSize: fs, color: CREAM }}>{p.title.toUpperCase()}</span>
        </div>
      ))}
    </div>
  );
}

function Shortcut({ left, top, icon, label, px, fs }: { left: number; top: number; icon: keyof typeof ICONS; label: string; px: number; fs: number }) {
  return (
    <div style={{ position: "absolute", left, top, display: "flex", flexDirection: "column", alignItems: "center", gap: fs * 0.6 }}>
      <Sprite rows={ICONS[icon]} px={px} />
      <span style={{ fontFamily: "Silkscreen", fontSize: fs, color: CREAM }}>{label}</span>
    </div>
  );
}

function Desktop({ width, height, children }: { width: number; height: number; children: React.ReactNode }) {
  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundColor: SCREEN,
        backgroundImage: "radial-gradient(circle, rgba(240,232,218,0.07) 1px, transparent 1px)",
        backgroundSize: "5px 5px",
      }}
    >
      <Stars width={width} height={height} count={Math.round((width * height) / 9000)} />
      {children}
      {/* Glass: scanlines + vignette */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width,
          height,
          backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 1px, transparent 1px, transparent 3px)",
          backgroundSize: "100% 3px",
        }}
      />
    </div>
  );
}

function OgCard() {
  const { width, height } = SIZES.og;
  return (
    <Desktop width={width} height={height}>
      <MenuBar height={48} fs={15} />
      <Sparkle x={1140} y={540} arm={10} />
      <Sparkle x={30} y={480} arm={7} />
      <Window title="README.TXT" left={56} top={96} width={790} fs={15}>
        <ReadmeBody fs={84} label={15} />
      </Window>
      <Icons left={880} top={100} cols={2} cell={150} px={4} fs={13} rowGap={30} />
      <div style={{ position: "absolute", left: 640, top: 528, display: "flex" }}>
        <Sprite rows={DOG_A} px={4} />
      </div>
      <span style={{ position: "absolute", left: 56, top: 584, fontFamily: "Silkscreen", fontSize: 12, color: FAINT }}>
        CA-OS V2.6 · 6 APPS · ALL LIVE
      </span>
    </Desktop>
  );
}

// Profile photos cover the lower-left of both banners, so the content
// sits right of ~430px and only decoration lives on the left.
function XHeader() {
  const { width, height } = SIZES.x;
  return (
    <Desktop width={width} height={height}>
      <MenuBar height={44} fs={14} />
      <Sparkle x={300} y={250} arm={9} />
      <Sparkle x={1110} y={440} arm={7} />
      <Shortcut left={60} top={84} icon="readme" label="README.TXT" px={4} fs={12} />
      <Shortcut left={210} top={84} icon="play" label="PLAY.EXE" px={4} fs={12} />
      <Window title="README.TXT" left={440} top={86} width={640} fs={14}>
        <ReadmeBody fs={70} label={13} />
      </Window>
      <Icons left={1130} top={92} cols={3} cell={115} px={4} fs={11} rowGap={28} />
      <div style={{ position: "absolute", left: 1210, top: 400, display: "flex" }}>
        <Sprite rows={DOG_A} px={4} />
      </div>
    </Desktop>
  );
}

function LinkedInBanner() {
  const { width, height } = SIZES.linkedin;
  return (
    <Desktop width={width} height={height}>
      <MenuBar height={40} fs={13} />
      <Sparkle x={330} y={190} arm={8} />
      <Shortcut left={56} top={74} icon="readme" label="README.TXT" px={4} fs={11} />
      <Shortcut left={196} top={74} icon="play" label="PLAY.EXE" px={4} fs={11} />
      <Window title="README.TXT" left={440} top={64} width={620} fs={13}>
        <ReadmeBody fs={60} label={12} />
      </Window>
      <Icons left={1150} top={74} cols={3} cell={128} px={4} fs={11} rowGap={20} />
      <div style={{ position: "absolute", left: 1460, top: 328, display: "flex" }}>
        <Sprite rows={DOG_A} px={3} />
      </div>
    </Desktop>
  );
}

const CARDS: Record<SocialKind, () => React.ReactElement> = { og: OgCard, x: XHeader, linkedin: LinkedInBanner };

async function loadFonts() {
  const dir = join(process.cwd(), "src/assets/fonts");
  const font = (file: string) => readFile(join(dir, file));
  const [serif, serifItalic, pixel, mono] = await Promise.all([
    font("InstrumentSerif-Regular.ttf"),
    font("InstrumentSerif-Italic.ttf"),
    font("Silkscreen-Regular.ttf"),
    font("JetBrainsMono-Regular.ttf"),
  ]);
  return [
    { name: "Instrument Serif", data: serif, style: "normal" as const, weight: 400 as const },
    { name: "Instrument Serif", data: serifItalic, style: "italic" as const, weight: 400 as const },
    { name: "Silkscreen", data: pixel, style: "normal" as const, weight: 400 as const },
    { name: "JetBrains Mono", data: mono, style: "normal" as const, weight: 400 as const },
  ];
}

export async function renderSocial(kind: SocialKind) {
  const Card = CARDS[kind];
  return new ImageResponse(<Card />, { ...SIZES[kind], fonts: await loadFonts() });
}
