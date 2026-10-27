import React from "react";

// Hand-drawn pixel sprites as string grids. Each run of same-coloured
// pixels in a row becomes one <rect>, so a 16×16 icon is ~30 nodes.

const PALETTE: Record<string, string> = {
  "#": "var(--os-line, #F0E8DA)",
  w: "var(--os-fill, #2B2721)",
  "+": "var(--accent)",
  b: "#E2B46C", // dog coat
  d: "#B07A3A", // dog ears
  k: "#12100D",
};

export function Pixels({ rows, className = "", title }: { rows: string[]; className?: string; title?: string }) {
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
    <svg
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {rects}
    </svg>
  );
}

export const ICONS = {
  clientra: [
    "................",
    ".##############.",
    ".#++++++++++++#.",
    ".##############.",
    ".#wwwwwwwwwwww#.",
    ".#wwww####wwww#.",
    ".#www##ww##www#.",
    ".#www##wwwwwww#.",
    ".#www##wwwwwww#.",
    ".#www##ww##www#.",
    ".#wwww####wwww#.",
    ".#wwwwwwwwwwww#.",
    ".##############.",
    "................",
    "................",
    "................",
  ],
  formdrop: [
    "......####......",
    "......#ww#......",
    "......#ww#......",
    "....###ww###....",
    ".....#wwww#.....",
    "......#ww#......",
    ".......##.......",
    ".##############.",
    ".##wwwwwwwwww##.",
    ".#w#wwwwwwww#w#.",
    ".#ww#wwwwww#ww#.",
    ".#www#w++w#www#.",
    ".#wwww####wwww#.",
    ".#wwwwwwwwwwww#.",
    ".##############.",
    "................",
  ],
  leados: [
    "................",
    "................",
    ".##############.",
    ".#wwwwwwwwwwww#.",
    ".#wwwwwwwww++w#.",
    ".#wwwwwwwww++w#.",
    ".#wwwwww##w++w#.",
    ".#wwwwww##w++w#.",
    ".#www##w##w++w#.",
    ".#www##w##w++w#.",
    ".#w#w##w##w++w#.",
    ".#w#w##w##w++w#.",
    ".#wwwwwwwwwwww#.",
    ".##############.",
    "................",
    "................",
  ],
  notiworld: [
    "............+++.",
    ".......##...+++.",
    ".....######.+++.",
    "....#wwwwww#....",
    "...#wwwwwwww#...",
    "...#wwwwwwww#...",
    "...#wwwwwwww#...",
    "...#wwwwwwww#...",
    "..#wwwwwwwwww#..",
    "..#wwwwwwwwww#..",
    ".#wwwwwwwwwwww#.",
    ".##############.",
    "......####......",
    ".......##.......",
    "................",
    "................",
  ],
  dummypet: [
    "................",
    ".##..........##.",
    "#ww#........#ww#",
    "#ww##########ww#",
    "#wwwwwwwwwwwwww#",
    ".#wwwwwwwwwwww#.",
    ".#ww##wwww##ww#.",
    ".#wwwwwwwwwwww#.",
    ".#wwwww##wwwww#.",
    ".#wwwwww#wwwww#.",
    "..#wwwwwwwwww#..",
    "...##########...",
    ".......++.......",
    ".......++.......",
    "................",
    "................",
  ],
  xome: [
    "................",
    "......####......",
    ".......##.......",
    "......####......",
    ".....#wwww#.....",
    "....#wwwwww#....",
    "...#www++www#...",
    "..#ww++++++ww#..",
    "..#ww++wwwwww#..",
    "..#www++++www#..",
    "..#wwwwww++ww#..",
    "..#ww++++++ww#..",
    "...#www++www#...",
    "....########....",
    "................",
    "................",
  ],
  readme: [
    "................",
    "..#########.....",
    "..#wwwwwww##....",
    "..#wwwwwww#w#...",
    "..#wwwwwww####..",
    "..#wwwwwwwwww#..",
    "..#w#######ww#..",
    "..#wwwwwwwwww#..",
    "..#w########w#..",
    "..#wwwwwwwwww#..",
    "..#w#####wwww#..",
    "..#wwwwwwwwww#..",
    "..#w+++wwwwww#..",
    "..############..",
    "................",
    "................",
  ],
  mail: [
    "................",
    "................",
    "................",
    ".##############.",
    ".##wwwwwwwwww##.",
    ".#w#wwwwwwww#w#.",
    ".#ww#wwwwww#ww#.",
    ".#www#wwww#www#.",
    ".#wwww#++#wwww#.",
    ".#wwwww##wwwww#.",
    ".#wwwwwwwwwwww#.",
    ".#wwwwwwwwwwww#.",
    ".##############.",
    "................",
    "................",
    "................",
  ],
  play: [
    "................",
    "......####......",
    ".....#++++#.....",
    ".....#++++#.....",
    "......####......",
    ".......##.......",
    ".......##.......",
    ".......##.......",
    "...##########...",
    "..#wwwwwwwwww#..",
    "..#w++wwwwwww#..",
    "..#w++wwwwwww#..",
    "..#wwwwwwwwww#..",
    "..############..",
    "................",
    "................",
  ],
} satisfies Record<string, string[]>;

export type IconName = keyof typeof ICONS;

// Side-on dog, two leg frames
const DOG_TOP = [
  "...............ddd....",
  "..............dbbbbd..",
  "..............bbbkbbbb",
  "..............bbbbbbkk",
  "..b...........dbbbbb..",
  "...b.........++bbbb...",
  "....bbbbbbbbbbbbbbb...",
  "....bbbbbbbbbbbbbbb...",
  "....bbbbbbbbbbbbbbb...",
];
export const DOG_A = [...DOG_TOP, "....bb.bb......bb.bb..", "....bb.bb......bb.bb..", "....dd.dd......dd.dd.."];
const DOG_B = [...DOG_TOP, ".....bbb.......bbb....", "....bb..b.....bb..b...", "...dd...dd...dd...dd.."];

export function PixelDog({ className = "" }: { className?: string }) {
  return (
    <span className={`relative block ${className}`}>
      <Pixels rows={DOG_A} className="dog-frame-a absolute inset-0 h-full w-full" />
      <Pixels rows={DOG_B} className="dog-frame-b absolute inset-0 h-full w-full" />
    </span>
  );
}
