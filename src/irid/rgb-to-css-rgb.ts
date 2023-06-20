import { RGBA } from "./types";

export default function rgbToCSSRGB(rgb: RGBA): string {
  return (
    "rgb" +
    (rgb.a ? "a" : "") +
    "(" +
    Math.round(rgb.r) +
    ", " +
    Math.round(rgb.g) +
    ", " +
    Math.round(rgb.b) +
    (rgb.a ? ", " + rgb.a.toFixed(2) : "") +
    ")"
  );
}
