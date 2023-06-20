import { HSLA, RGBA } from "./types";

export default function hslToRGB(hsl: HSLA): RGBA {
  const sl = hsl.s;
  const l = hsl.l;
  const v = l <= 0.5 ? l * (1.0 + sl) : l + sl - l * sl;

  let h = hsl.h % 1;
  let r, g, b, m, sv, sextant, fract, vsf, mid1, mid2;

  if (h < 0) {
    h += 1;
  }
  r = g = b = l;
  if (v > 0) {
    m = l + l - v;
    sv = (v - m) / v;
    h *= 6.0;
    sextant = Math.floor(h);
    fract = h - sextant;
    vsf = v * sv * fract;
    mid1 = m + vsf;
    mid2 = v - vsf;
    switch (sextant) {
      case 0:
        r = v;
        g = mid1;
        b = m;
        break;
      case 1:
        r = mid2;
        g = v;
        b = m;
        break;
      case 2:
        r = m;
        g = v;
        b = mid1;
        break;
      case 3:
        r = m;
        g = mid2;
        b = v;
        break;
      case 4:
        r = mid1;
        g = m;
        b = v;
        break;
      case 5:
        r = v;
        g = m;
        b = mid2;
        break;
    }
  }
  return {
    type: "rgba",
    r: Math.floor(r * 255),
    g: Math.floor(g * 255),
    b: Math.floor(b * 255),
    a: hsl.a,
  };
}
