import type { Metadata, Viewport } from "next";
import { Doto, Instrument_Serif, JetBrains_Mono, Silkscreen } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

// Serif for headlines, pixel face for UI labels, dot-matrix for numerals,
// mono for body copy. Exposed as CSS variables and mapped in globals.css.
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--ff-serif" });
const pixel = Silkscreen({ subsets: ["latin"], weight: ["400", "700"], variable: "--ff-pixel" });
const dots = Doto({ subsets: ["latin"], weight: ["700", "900"], variable: "--ff-dots" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--ff-mono" });

// Absolute base for canonical and share-image URLs
const SITE_URL = "https://charlesallotey.clientra.tech";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Charles Nii Adotey Allotey — Full-Stack Developer",
  description: "Full-stack developer in Accra building leadOS, FormDrop, Notiworld, DummyPet and XOME under Clientra. Fluent in Vue/Nuxt, React/Next.js, Node.js and Laravel.",
  keywords: ["Charles Allotey", "Full Stack Developer", "Vue School", "Vue 3", "Nuxt", "React", "Next.js", "TypeScript", "Node.js", "Laravel", "Backend Developer", "Accra", "Ghana"],
  authors: [{ name: "Charles Nii Adotey Allotey" }],
  // Share images come from app/opengraph-image.tsx and app/twitter-image.tsx
  openGraph: {
    title: "Charles Nii Adotey Allotey — Full-Stack Developer",
    description: "I build products people actually use. Full-stack developer at Vue School and the builder behind Clientra: six products, all live.",
    url: SITE_URL,
    siteName: "Charles Allotey Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Charles Nii Adotey Allotey — Full-Stack Developer",
    description: "I build products people actually use. Full-stack developer at Vue School and the builder behind Clientra: six products, all live.",
    creator: "@adotey_",
  },
};

export const viewport: Viewport = {
  themeColor: "#0E0C0A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`h-full antialiased ${serif.variable} ${pixel.variable} ${dots.variable} ${mono.variable}`}
    >
      <body className="min-h-full flex flex-col bg-bg-base text-text-primary">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
