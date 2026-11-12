import { renderSocial } from "@/social/cards";

export const alt =
  "Charles Allotey, full-stack developer: a greyscale portrait behind the word allotey, with the note “less talk, more shipping.”";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderSocial("og");
}
