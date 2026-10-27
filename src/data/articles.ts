export type Article = {
  title: string;
  blurb: string;
  topic: string;
  date: string; // ISO, for <time>
  href: string;
};

export const BLOG_URL = "https://masteringnuxt.com/blog";
// Articles I've published on Mastering Nuxt so far
export const ARTICLE_COUNT = 26;

const post = (slug: string) => `${BLOG_URL}/${slug}`;

export const ARTICLES: Article[] = [
  {
    title: "Nuxt 4 Migration: Understanding the New Directory System",
    blurb: "What changed in the Nuxt 4 project structure, why it matters, and how to move a Nuxt 3 app over smoothly.",
    topic: "Migration",
    date: "2026-03-19",
    href: post("nuxt-4-migration-understanding-the-new-directory-system"),
  },
  {
    title: "Nuxt Modules Worth Checking Out in 2026",
    blurb: "The modules I'd reach for this year to boost performance, improve DX and trim boilerplate.",
    topic: "Modules",
    date: "2026-02-12",
    href: post("nuxt-modules-worth-checking-out-in-2026"),
  },
  {
    title: "What's Changing in Nuxt Studio",
    blurb: "Nuxt Studio went open source. The transition, the new vision, and what it means for your content workflow.",
    topic: "Ecosystem",
    date: "2026-01-21",
    href: post("whats-changing-in-nuxt-studio"),
  },
  {
    title: "Exploring the Nuxt MCP Server",
    blurb: "Give your AI assistant live access to the Nuxt and Nuxt UI docs instead of outdated guesses.",
    topic: "AI",
    date: "2025-10-08",
    href: post("exploring-the-nuxt-mcp-server"),
  },
  {
    title: "Building a Realtime Chat Application with Nuxt and Socket.IO",
    blurb: "A community chat with instant messaging, built step by step on Nuxt 4 and Socket.IO.",
    topic: "Realtime",
    date: "2025-09-17",
    href: post("building-a-realtime-chat-application-with-nuxt-and-socketio"),
  },
  {
    title: "Building API Routes with Nuxt 3's Nitro Server",
    blurb: "CRUD, authentication, file uploads and production deployment, all from Nitro server routes.",
    topic: "Backend",
    date: "2025-07-22",
    href: post("building-api-routes-with-nuxt-3s-nitro-server"),
  },
  {
    title: "Building Complex Animations in Nuxt with GSAP",
    blurb: "Timelines, scroll triggers and the small details that give an interface its wow factor.",
    topic: "Animation",
    date: "2025-04-23",
    href: post("building-complex-animations-in-nuxt-with-gsap"),
  },
  {
    title: "Building a Custom Authentication System with JWT in Nuxt 3",
    blurb: "Login, signup, protected routes and Pinia state for a JWT auth flow written from scratch.",
    topic: "Auth",
    date: "2024-12-17",
    href: post("building-a-custom-authentication-system-with-jwt-in-nuxt-3"),
  },
];
