import { parseHueValue } from "./parse-hue-value";
import { parseSLValue } from "./parse-sl-value";
import { parseAlphaValue } from "./parse-alpha-value";
import { HSLA } from "./types";

export default function cssHSLToHSL(css: string): HSLA | undefined {
  const parts =
    /^hsla?\(\s*(-?\d+)\s*,\s*(-?\d+%)\s*,\s*(-?\d+%)\s*(?:,\s*(-?\d*(?:\.\d+)?)?)?\s*\)$/.exec(
      css,
    );
  return parts
    ? {
        type: "hsla",
        h: parseHueValue(parts[1]),
        s: parseSLValue(parts[2]),
        l: parseSLValue(parts[3]),
        a: parseAlphaValue(parts[4]),
      }
    : undefined;
}
