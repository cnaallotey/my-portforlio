import { renderSocial } from "@/social/cards";

// LinkedIn profile background, 1584×396
export const dynamic = "force-static";

export function GET() {
  return renderSocial("linkedin");
}
