export type Project = {
  slug: "clientra" | "formdrop" | "leados" | "notiworld" | "dummypet" | "xome" | "ringline" | "vloid" | "dsskincarehub";
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
      "Software for teams that mean business. One senior team designs, builds and runs production software, from our own products to custom systems for businesses that need more than a template.",
    tags: ["Custom software", "AI & automation", "Payments"],
    domain: "clientra.tech",
    href: "https://clientra.tech/",
    image: "/projects/clientra-v2.png",
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
      "Where Ghana's brands and creators connect. Brands find creators by niche, platform and audience; creators get found and paid for what they already post, with the money held safe until the work is approved.",
    tags: ["Creator search", "Escrow", "MoMo payouts"],
    domain: "xome.clientra.tech",
    href: "https://xome.clientra.tech/",
    image: "/projects/xome-v2.png",
  },
  {
    slug: "ringline",
    title: "Ringline",
    kind: "Live outreach",
    blurb:
      "Talk to customers while they're still on your site. See who's live on your product and what they're doing, then ring them in the browser. One tap to accept, nothing to install, never recorded.",
    tags: ["Live users", "In-browser calls", "Voice only"],
    domain: "ringline.clientra.tech",
    href: "https://ringline.clientra.tech/",
    image: "/projects/ringline.png",
  },
  {
    slug: "vloid",
    title: "Vloid",
    kind: "AI voice outreach",
    blurb:
      "Stop paying people to dial down a spreadsheet. Vloid's AI voice agents call your customer list, ask what you need to know and hand back answers you can filter. In early access.",
    tags: ["Voice agents", "Campaigns", "Early access"],
    domain: "vloid.clientra.tech",
    href: "https://vloid.clientra.tech/",
    image: "/projects/vloid.png",
  },
  {
    slug: "dsskincarehub",
    title: "DS Skin Care Hub",
    kind: "Client storefront",
    blurb:
      "A storefront for proper skincare in Ghana. Shoppers browse the full catalogue, get one-on-one advice on WhatsApp and pay with Mobile Money, with same-day dispatch in Accra.",
    tags: ["E-commerce", "WhatsApp orders", "MoMo"],
    domain: "dsskincarehub.clientra.tech",
    href: "https://dsskincarehub.clientra.tech/",
    image: "/projects/dsskincarehub.png",
  },
];
