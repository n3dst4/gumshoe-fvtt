declare module "irid" {
  type HSLA = { h: number, s: number, l: number, a?: number };
  type RGBA = { r: number, g: number, b: number, a?: number };
  type Iridable = Irid | string | HSLA | RGBA;
  export const Irid: (from: Iridable) => Irid;
  export interface Irid {
    blend(other: Iridable, factor?: number): Irid;
    toHexString(): string;
    toRGBString(): string;
    contrast(a?: string | Irid, b?: string | Irid): Irid;
    opacity(x: number): Irid;
    opacity(): number;
    lighten(x: number): Irid;
    lightness(x: number): Irid;
    lightness(): void;
    saturation(x: number): Irid;
    saturation(): void;
    complement(): Irid;
    analagous(): [Irid, Irid, Irid];
    hue(): number;
    hue(h: number): Irid;
  }
  export default Irid;
}

declare const Babele: any;

// DSN uses this extra dice term option to sequence rolls
declare namespace RollTerm {
  interface Options {
    rollOrder?: number;
  }
}

declare namespace PopOut {
  interface DialogHookInfo {
    /** the parent app */
    app: Application;
    children: Array<any>;
    close: () => void;
    css: string;
    display: string;
    handle: string;
    header: HTMLElement;
    maximize: () => void;
    minimize: () => void;
    minimized: boolean;
    node: HTMLElement;
    position: {
      width: number,
      height: number,
      left: number,
      scale: number,
      top: number,
      zIndex: number,
    };
    /** unknown - signature probably wrong */
    render: () => void;
    window: Window;
  }
}
