import { RGBA } from "./types";

export default function rgbToHex(rgb: RGBA): string {
  let str =
    "#" +
    (rgb.r < 16 ? "0" : "") +
    rgb.r.toString(16) +
    (rgb.g < 16 ? "0" : "") +
    rgb.g.toString(16) +
    (rgb.b < 16 ? "0" : "") +
    rgb.b.toString(16);
  if (rgb.a !== undefined) {
    const alpha = Math.floor(rgb.a * 255);
    str += (alpha < 16 ? "0" : "") + alpha.toString(16);
  }
  return str;
}
