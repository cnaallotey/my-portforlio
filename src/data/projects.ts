import type { IconName } from "@/components/PixelArt";

export type Project = {
  slug: IconName;
  title: string;
  kind: string;
  blurb: string;
  tags: string[];
  domain: string;
  href: string;
  image: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "clientra",
    title: "Clientra",
    kind: "Engineering studio",
    blurb:
      "The studio behind everything on this page. We design, build and run production software: our own products, plus custom systems for teams who need more than a template.",
    tags: ["Studio", "Custom software", "Accra"],
    domain: "clientra.tech",
    href: "https://clientra.tech/",
    image: "/projects/clientra.png",
  },
  {
    slug: "formdrop",
    title: "FormDrop",
    kind: "Form backend",
    blurb:
      "Form submissions, without the backend. Point any HTML form at a FormDrop URL: spam gets set aside, you get an email, your server gets a signed webhook and your team gets the lead.",
    tags: ["Webhooks", "Spam filtering", "AI triage"],
    domain: "formdrop.clientra.tech",
    href: "https://formdrop.clientra.tech/",
    image: "/projects/formdrop-live.png",
  },
  {
    slug: "leados",
    title: "leadOS",
    kind: "Sales CRM",
    blurb:
      "The simple CRM for small businesses. Import your contact list, work it with tap-to-call and WhatsApp, then send Cedi invoices with MoMo payment. Paid deals move to Won on their own.",
    tags: ["CRM", "WhatsApp dialer", "MoMo invoices"],
    domain: "leados.clientra.tech",
    href: "https://leados.clientra.tech/",
    image: "/projects/leados.png",
  },
  {
    slug: "notiworld",
    title: "Notiworld",
    kind: "Notifications API",
    blurb:
      "Reach your users after they close the tab. One API call sends your web app's notifications to their desktop and phone. No email server, no SMS bills, and users keep the off switch.",
    tags: ["API", "Desktop app", "Push"],
    domain: "notiworld.clientra.tech",
    href: "https://notiworld.clientra.tech/",
    image: "/projects/notiworld.png",
  },
  {
    slug: "dummypet",
    title: "DummyPet",
    kind: "macOS app",
    blurb:
      "A very good dog that lives on your Mac. It naps on your Dock, chases the ball you throw, and gets bored if you ignore it. Seven breeds, eight tricks, free to download.",
    tags: ["macOS", "Desktop pet", "Free"],
    domain: "dummypet.clientra.tech",
    href: "https://dummypet.clientra.tech/",
    image: "/projects/dummypet.png",
  },
  {
    slug: "xome",
    title: "XOME",
    kind: "Creator marketplace",
    blurb:
      "Escrow for brand deals. Brands lock the money upfront, creators post the content, and the cash drops the second it's approved. No ghosting, no chasing invoices.",
    tags: ["Escrow", "Creators", "Waitlist open"],
    domain: "xome.clientra.tech",
    href: "https://xome.clientra.tech/",
    image: "/projects/xome.png",
  },
];
