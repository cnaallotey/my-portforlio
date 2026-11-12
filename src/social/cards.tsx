import React from "react";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { PROJECTS } from "@/data/projects";

// Share images in the site's editorial style: hairline column grid, the
// greyscale portrait, a giant "allotey" with a handwritten lime overlay and
// a lime action bar. Rendered by next/og (Satori), so every container is an
// explicit flexbox and colours are literal values.

export const SIZES = {
  og: { width: 1200, height: 630 },
  x: { width: 1500, height: 500 },
  linkedin: { width: 1584, height: 396 },
} as const;

export type SocialKind = keyof typeof SIZES;

const SITE_HOST = "charlesallotey.clientra.tech";
const INK = "#0B0B0B";
const CREAM = "#EDEDED";
const MUTED = "#8C8C8C";
const LIME = "#C8F94D";
const LINE = "rgba(237,237,237,0.1)";
const YEARS = `2020—${new Date().getFullYear() % 100}©`;

type Layout = { width: number; height: number; margin: number };

function GridLines({ width, height, margin }: Layout) {
  const col = (width - margin * 2) / 4;
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{ position: "absolute", left: margin + col * i, top: 0, width: 1, height, backgroundColor: LINE }} />
      ))}
    </>
  );
}

const mono = (size: number, color = MUTED): React.CSSProperties => ({
  fontFamily: "Geist Mono",
  fontSize: size,
  color,
  textTransform: "uppercase",
  letterSpacing: size * 0.02,
});

function Logo({ size }: { size: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.5 }}>
      <div
        style={{
          width: size * 1.6,
          height: size * 1.6,
          backgroundColor: LIME,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...mono(size * 0.62, INK),
        }}
      >
        CA
      </div>
      <span style={{ fontFamily: "Geist", fontSize: size * 1.15, color: CREAM, letterSpacing: -size * 0.05 }}>allotey</span>
    </div>
  );
}

function TopRow({ layout, top, size }: { layout: Layout; top: number; size: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: layout.margin,
        top,
        width: layout.width - layout.margin * 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Logo size={size} />
      <span style={mono(size * 0.8)}>{YEARS}</span>
      <span style={mono(size * 0.8, LIME)}>{SITE_HOST}</span>
    </div>
  );
}

function Wordmark({ left, top, size }: { left: number; top: number; size: number }) {
  return (
    <span
      style={{
        position: "absolute",
        left,
        top,
        fontFamily: "Geist",
        fontSize: size,
        lineHeight: 1,
        letterSpacing: -size * 0.075,
        color: CREAM,
      }}
    >
      allotey
    </span>
  );
}

function Scribble({ left, top, size, text }: { left: number; top: number; size: number; text: string }) {
  return (
    <span
      style={{
        position: "absolute",
        left,
        top,
        fontFamily: "Nothing You Could Do",
        fontSize: size,
        color: LIME,
        transform: "rotate(-6deg)",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}

function ActionBar({ left, top, width, height, label }: { left: number; top: number; width: number; height: number; label: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        backgroundColor: LIME,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...mono(height * 0.27, INK),
      }}
    >
      <span>{label}</span>
      <span style={{ position: "absolute", right: height * 0.45, fontSize: height * 0.42 }}>+</span>
    </div>
  );
}

function Portrait({ src, left, top, height, opacity }: { src: string; left: number; top: number; height: number; opacity: number }) {
  const width = Math.round((height * 900) / 1100);
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} width={width} height={height} alt="" style={{ position: "absolute", left, top, opacity }} />;
}

function Canvas({ width, height, children }: { width: number; height: number; children: React.ReactNode }) {
  return (
    <div style={{ width, height, display: "flex", position: "relative", backgroundColor: INK, overflow: "hidden" }}>
      {children}
    </div>
  );
}

function Fade({ width, height, from }: { width: number; height: number; from: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: height * from,
        width,
        height: height * (1 - from),
        backgroundImage: `linear-gradient(to bottom, rgba(11,11,11,0), ${INK})`,
      }}
    />
  );
}

function OgCard({ portrait }: { portrait: string }) {
  const L = { ...SIZES.og, margin: 40 };
  const col = (L.width - L.margin * 2) / 4;
  return (
    <Canvas width={L.width} height={L.height}>
      <Portrait src={portrait} left={(L.width - 520) / 2} top={10} height={636} opacity={0.6} />
      <Fade width={L.width} height={L.height} from={0.55} />
      <GridLines {...L} />
      <TopRow layout={L} top={30} size={20} />
      <div style={{ position: "absolute", left: L.margin, top: 100, width: col * 3, display: "flex" }}>
        {["Products & SaaS", "Vue · React · Node", "AI in everything"].map((t, i) => (
          <span key={t} style={{ width: col, ...mono(13, CREAM) }}>
            {`0${i + 1}. ${t}`}
          </span>
        ))}
      </div>
      <Wordmark left={160} top={168} size={300} />
      <Scribble left={560} top={410} size={52} text="less talk, more shipping." />
      <div style={{ position: "absolute", left: L.margin, top: 538, display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={mono(13, CREAM)}>Charles Allotey</span>
        <span style={mono(13)}>Full-stack developer</span>
      </div>
      <ActionBar left={L.margin + col} top={530} width={col * 2} height={56} label="Start a project" />
      <div style={{ position: "absolute", left: L.margin + col * 3, top: 524, width: col, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        <span style={{ fontFamily: "Geist", fontSize: 44, lineHeight: 1, letterSpacing: -2.5, color: CREAM }}>{PROJECTS.length}</span>
        <span style={mono(12)}>Products live</span>
      </div>
    </Canvas>
  );
}

// Profile photos cover the lower-left of both banners, so that corner
// only ever holds the portrait fade and grid lines.
function XHeader({ portrait }: { portrait: string }) {
  const L = { ...SIZES.x, margin: 50 };
  return (
    <Canvas width={L.width} height={L.height}>
      <Portrait src={portrait} left={560} top={-10} height={560} opacity={0.5} />
      <Fade width={L.width} height={L.height} from={0.6} />
      <GridLines {...L} />
      <TopRow layout={L} top={28} size={18} />
      <Wordmark left={392} top={88} size={262} />
      <Scribble left={900} top={316} size={50} text="less talk, more shipping." />
      <ActionBar left={400} top={414} width={350} height={50} label="Start a project" />
      <span style={{ position: "absolute", right: L.margin, top: 432, ...mono(12) }}>
        {PROJECTS.slice(1).map((p) => p.title).join(" · ")}
      </span>
    </Canvas>
  );
}

function LinkedInBanner({ portrait }: { portrait: string }) {
  const L = { ...SIZES.linkedin, margin: 50 };
  const col = (L.width - L.margin * 2) / 4;
  const right = L.margin + col * 3;
  return (
    <Canvas width={L.width} height={L.height}>
      <Portrait src={portrait} left={560} top={-6} height={440} opacity={0.5} />
      <Fade width={L.width} height={L.height} from={0.6} />
      <GridLines {...L} />
      <TopRow layout={L} top={24} size={17} />
      <Wordmark left={410} top={80} size={214} />
      <Scribble left={690} top={262} size={38} text="less talk, more shipping." />
      <div style={{ position: "absolute", left: right + 18, top: 96, display: "flex", flexDirection: "column", gap: 10 }}>
        {["Products & SaaS", "Vue · React · Node", "AI in everything"].map((t, i) => (
          <span key={t} style={mono(13, CREAM)}>
            {`0${i + 1}. ${t}`}
          </span>
        ))}
      </div>
      <ActionBar left={right} top={300} width={col} height={50} label="Start a project" />
    </Canvas>
  );
}

const CARDS: Record<SocialKind, (props: { portrait: string }) => React.ReactElement> = {
  og: OgCard,
  x: XHeader,
  linkedin: LinkedInBanner,
};

async function loadAssets() {
  const dir = join(process.cwd(), "src/assets");
  const file = (name: string) => readFile(join(dir, name));
  const [sans, monoFont, script, portrait] = await Promise.all([
    file("fonts/Geist-SemiBold.ttf"),
    file("fonts/GeistMono-Medium.ttf"),
    file("fonts/NothingYouCouldDo-Regular.ttf"),
    file("social-portrait.png"),
  ]);
  return {
    portrait: `data:image/png;base64,${portrait.toString("base64")}`,
    fonts: [
      { name: "Geist", data: sans, style: "normal" as const, weight: 600 as const },
      { name: "Geist Mono", data: monoFont, style: "normal" as const, weight: 500 as const },
      { name: "Nothing You Could Do", data: script, style: "normal" as const, weight: 400 as const },
    ],
  };
}

export async function renderSocial(kind: SocialKind) {
  const Card = CARDS[kind];
  const { portrait, fonts } = await loadAssets();
  return new ImageResponse(<Card portrait={portrait} />, { ...SIZES[kind], fonts });
}
