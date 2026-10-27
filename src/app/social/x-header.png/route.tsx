import { renderSocial } from "@/social/cards";

// X (Twitter) profile header, 1500×500
export const dynamic = "force-static";

export function GET() {
  return renderSocial("x");
}
