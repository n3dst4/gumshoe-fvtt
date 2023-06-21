export type RGBA = {
  type: "rgba";
  r: number;
  g: number;
  b: number;
  a?: number;
};
export type HSLA = {
  type: "hsla";
  h: number;
  s: number;
  l: number;
  a?: number;
};
export type Color = RGBA | HSLA;
export type ColorType = Color["type"];

export function isRGBA(color: Color): color is RGBA {
  return color.type === "rgba";
}

export function isHSLA(color: Color): color is HSLA {
  return color.type === "hsla";
}
