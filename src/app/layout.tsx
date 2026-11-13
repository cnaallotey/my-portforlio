import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Nothing_You_Could_Do } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

// Grotesk for everything, mono for labels, a handwritten face for the
// scribbled overlays. Exposed as CSS variables and mapped in globals.css.
const sans = Geist({ subsets: ["latin"], variable: "--ff-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--ff-mono" });
const script = Nothing_You_Could_Do({ subsets: ["latin"], weight: "400", variable: "--ff-script" });

// Absolute base for canonical and share-image URLs
const SITE_URL = "https://charlesallotey.clientra.tech";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Charles Nii Adotey Allotey — Full-Stack Developer",
  description: "Full-stack developer in Accra building leadOS, FormDrop, Vloid, XOME, Ringline, Notiworld and DummyPet under Clientra. Fluent in Vue/Nuxt, React/Next.js, Node.js and Laravel.",
  keywords: ["Charles Allotey", "Full Stack Developer", "Vue School", "Vue 3", "Nuxt", "React", "Next.js", "TypeScript", "Node.js", "Laravel", "Backend Developer", "Accra", "Ghana"],
  authors: [{ name: "Charles Nii Adotey Allotey" }],
  // Share images come from app/opengraph-image.tsx and app/twitter-image.tsx
  openGraph: {
    title: "Charles Nii Adotey Allotey — Full-Stack Developer",
    description: "I build products people actually use. Full-stack developer at Vue School and the builder behind Clientra: nine products, all live.",
    url: SITE_URL,
    siteName: "Charles Allotey Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Charles Nii Adotey Allotey — Full-Stack Developer",
    description: "I build products people actually use. Full-stack developer at Vue School and the builder behind Clientra: nine products, all live.",
    creator: "@adotey_",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
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
      className={`h-full antialiased ${sans.variable} ${mono.variable} ${script.variable}`}
    >
      <body className="min-h-full flex flex-col bg-ink text-cream">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
