import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://cnaallotey.dev"),
  title: "Charles Nii Adotey Allotey — Full-Stack Developer",
  description: "Full-stack developer who turns ideas into polished, production-ready web products. Fluent in Vue/Nuxt, React/Next.js, Node.js, and Laravel, comfortable across the stack.",
  keywords: ["Charles Allotey", "Full Stack Developer", "Vue School", "Vue 3", "Nuxt", "React", "Next.js", "TypeScript", "Node.js", "Laravel", "Backend Developer", "Accra", "Ghana"],
  authors: [{ name: "Charles Nii Adotey Allotey" }],
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Charles Nii Adotey Allotey — Full-Stack Developer",
    description: "Full-stack developer who turns ideas into polished, production-ready web products. Fluent in Vue/Nuxt, React/Next.js, Node.js, and Laravel.",
    url: "https://cnaallotey.dev",
    siteName: "Charles Allotey Portfolio",
    images: [
      {
        url: "/portraits/banner.png",
        width: 1200,
        height: 630,
        alt: "Charles Nii Adotey Allotey Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Charles Nii Adotey Allotey — Full-Stack Developer",
    description: "Full-stack developer who turns ideas into polished, production-ready web products. Fluent in Vue/Nuxt, React/Next.js, Node.js, and Laravel.",
    creator: "@adotey_",
    images: ["/portraits/banner.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0D10",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg-base text-text-primary">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
