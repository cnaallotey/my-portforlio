import { renderSocial } from "@/social/cards";

export const alt =
  "Charles Allotey: I build products people actually use. A retro CA-OS desktop with Clientra, FormDrop, leadOS, Notiworld, DummyPet and XOME.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderSocial("og");
}
