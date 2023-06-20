import { parseRGBValue } from "./parse-rgb-value";
import { parseAlphaValue } from "./parse-alpha-value";
import { RGBA } from "./types";

export default function cssRGBToRGB(css: string): RGBA | undefined {
  const parts =
    /^rgba?\(\s*(-?\d+%?)\s*,\s*(-?\d+%?)\s*,\s*(-?\d+%?)\s*(?:,\s*(-?\d*(?:\.\d+)?)?)?\s*\)$/.exec(
      css,
    );
  return parts
    ? {
        type: "rgba",
        r: parseRGBValue(parts[1]),
        g: parseRGBValue(parts[2]),
        b: parseRGBValue(parts[3]),
        a: parseAlphaValue(parts[4]),
      }
    : undefined;
}
