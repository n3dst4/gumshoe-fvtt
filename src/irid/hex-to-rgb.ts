import parseHexValue from "./parse-hex-value";
import { RGBA } from "./types";

export default function hexToRGB(hex: string): RGBA | undefined {
  const parts =
    /^#([\da-f])([\da-f])([\da-f])([\da-f])?$/i.exec(hex) ||
    /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})([\da-f]{2})?$/i.exec(hex);
  return parts
    ? {
        type: "rgba",
        r: parseHexValue(parts[1]),
        g: parseHexValue(parts[2]),
        b: parseHexValue(parts[3]),
        a:
          typeof parts[4] === "undefined" || parts[4] === ""
            ? undefined
            : parseHexValue(parts[4]) / 255,
      }
    : undefined;
}
