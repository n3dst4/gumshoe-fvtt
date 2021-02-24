declare module "irid" {
  type HSLA = { h: number; s: number; l: number; a?: number };
  type RGBA = { r: number; g: number; b: number; a?: number };
  type Iridable = Irid | string | HSLA | RGBA;
  export const Irid: (from: Iridable) => Irid;
  export interface Irid {
    blend(other: Iridable, factor?: number): Irid;
    toHexString(): string;
    toRGBString(): string;
    contrast(a?: string | Irid, b?: string | Irid): Irid;
    opacity(x: number): Irid;
    lighten(x: number): Irid;
  }
  export default Irid;
}
