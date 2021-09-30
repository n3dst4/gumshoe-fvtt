import { css, CSSObject, SerializedStyles } from "@emotion/react";
import React from "react";
import { systemName } from "./constants";
import Irid from "irid";

const white = Irid("white");
const black = Irid("black");

export type ThemeSeed = {
  displayName: string,
  global?: SerializedStyles,
  wallpaperUrl: string,
  bodyFont?: string,
  displayFont?: string,
  logoFrontElementStyle: CSSObject,
  logoRearElementStyle: CSSObject,
  logoTransform: string,
  logoBackdropStyle: CSSObject,

  colors: {
    accent: string,
    accentContrast: string,
    glow: string,
    wallpaper: string,

    bgTransSecondary: string,
    bgTransPrimary: string,

    bgOpaqueDangerPrimary?: string,
    bgOpaqueDangerSecondary?: string,
    bgTransDangerPrimary?: string,
    bgTransDangerSecondary?: string,

    bgTint: string,

    text: string,
    textMuted: string,
  },
}

export type Theme = ThemeSeed & {
  colors: ThemeSeed["colors"] & {
    bgOpaquePrimary: string,
    bgOpaqueSecondary: string,
    bgOpaqueDangerPrimary: string,
    bgOpaqueDangerSecondary: string,
    bgTransDangerPrimary: string,
    bgTransDangerSecondary: string,
  },
}

/**
 * Given two colors, create a third which is the result of overlaying the second
 * on the first
 */
const overlay = (baseString: string, layerString: string): string => {
  const layer = Irid(layerString);
  const opacity = layer.opacity();
  const layerOpaque = layer.opacity(1);
  const result = Irid(baseString).blend(layerOpaque, opacity);
  return result.toRGBString();
};

/**
 * Turn a ThemeSeed (bare basics for defining a theme) into a fully usable
 * theme
 */
export const themeFactory = (seed: ThemeSeed): Theme => {
  const bgOpaquePrimary = overlay(seed.colors.wallpaper, seed.colors.bgTransPrimary);
  const bgOpaqueSecondary = overlay(seed.colors.wallpaper, seed.colors.bgTransSecondary);

  const red = Irid("red");
  const bgTransPrimary = Irid(seed.colors.bgTransPrimary);
  const bgTransSecondary = Irid(seed.colors.bgTransSecondary);

  const bgTransDangerPrimary = seed.colors.bgTransDangerPrimary || bgTransPrimary.blend(red, 0.3).opacity(bgTransPrimary.opacity()).toRGBString();
  const bgTransDangerSecondary = seed.colors.bgTransDangerSecondary || bgTransSecondary.blend(red, 0.3).opacity(bgTransSecondary.opacity()).toRGBString();
  const bgOpaqueDangerPrimary = seed.colors.bgOpaqueDangerPrimary || overlay(seed.colors.wallpaper, bgTransDangerPrimary);
  const bgOpaqueDangerSecondary = seed.colors.bgOpaqueDangerSecondary || overlay(seed.colors.wallpaper, bgTransDangerSecondary);

  return {
    ...seed,
    colors: {
      ...seed.colors,
      bgOpaquePrimary,
      bgOpaqueSecondary,
      bgTransDangerPrimary,
      bgTransDangerSecondary,
      bgOpaqueDangerPrimary,
      bgOpaqueDangerSecondary,
    },
  };
};

export const tealTheme: Theme = themeFactory({
  displayName: "Teal of Cthulhu",
  global: css`
    @import url("https://fonts.googleapis.com/css2?family=Federo&display=swap");
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
  `,
  wallpaperUrl: `url(systems/${systemName}/assets/wallpaper/marjanblan-5Ft4NWTmeJE-unsplash.webp)`,
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal small-caps normal 1em 'Federo', serif",
  // logo:
  logoFrontElementStyle: {
    background: "linear-gradient(135deg, #efb183 0%,#222 30%,#efb183 90%)",
    backgroundClip: "text",
  },
  logoRearElementStyle: {
    textShadow: "2px 0px 1px black, 6px 0px 4px rgba(0,0,0,0.5), -1px 0px 0px rgba(255,255,255,0.5)",
  },
  logoTransform: "rotateY(-30deg) rotateZ(-1deg) translateX(-5%)",
  logoBackdropStyle: {
    perspective: "500px",
    perspectiveOrigin: "50% 50%",
    backgroundImage: "radial-gradient(closest-side, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)",
  },
  colors: {
    accent: "#1d5d5d",
    accentContrast: "white",
    glow: "#5effff",
    wallpaper: "#ddd",
    bgTransSecondary: "rgba(255,255,255,0.2)",
    bgTransPrimary: "rgba(255,255,255,0.5)",
    bgTint: "rgba(0,0,0,0.1)",
    text: "#433",
    textMuted: "#744",
  },
});

export const niceThemeDark: Theme = themeFactory({
  displayName: "Nice Dark Red Agents",
  global: css`
    @import url('https://fonts.googleapis.com/css2?family=Unica+One&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
    `,
  wallpaperUrl: `url(systems/${systemName}/assets/wallpaper/tina-dawson-Kim9COAIEGc-unsplash-dark-red.webp)`,
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal normal normal 1.1em 'Unica One', serif",
  logoFrontElementStyle: {
    background: "linear-gradient(135deg, #fff 0%, #fff 90%)",
    backgroundClip: "text",
  },
  logoRearElementStyle: {
    textShadow: "2px 0px 1px black, -1px 0px 0px rgba(255,255,255,0.5)",
  },
  logoTransform: "scale(0.8)",
  logoBackdropStyle: {
    backgroundColor: "rgba(0,0,0,0.4)",
    transform: "scaleY(0.9) scaleX(1.2) translateY(0.1em)",
    zIndex: -1,
  },
  colors: {
    accent: "#fff",
    accentContrast: "#600",
    glow: "#f33",
    wallpaper: "#4a0d00",
    bgTransSecondary: "rgba(0,0,0,0.2)",
    bgTransPrimary: "rgba(0,0,0,0.4)",
    bgTransDangerPrimary: "rgba(255,128,0,0.2)",
    bgTransDangerSecondary: "rgba(255,128,0,0.3)",

    bgTint: "rgba(255,255,255,0.1)",
    text: "#ccc",
    textMuted: "#aaa",
  },
});

export const niceTheme: Theme = themeFactory({
  displayName: "Nice Light Agents",
  global: css`
    @import url('https://fonts.googleapis.com/css2?family=Unica+One&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
  `,
  wallpaperUrl: `url(systems/${systemName}/assets/wallpaper/marjanblan-5Ft4NWTmeJE-unsplash.webp)`,
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal normal normal 1.1em 'Unica One', serif",
  logoFrontElementStyle: {
    color: "#fff",
  },
  logoRearElementStyle: {
    textShadow: "2px 0px 1px black, -1px 0px 0px rgba(255,255,255,0.5)",
  },
  logoTransform: "scale(0.8)",
  logoBackdropStyle: {
    background: `#4a0d00 url(systems/${systemName}/assets/wallpaper/tina-dawson-Kim9COAIEGc-unsplash-dark-red.webp)`,
    backgroundSize: "cover",
    transform: "scaleY(0.9) scaleX(1.2) translateY(0.1em)",
    zIndex: -1,
    borderStyle: "solid",
    borderThickness: "2px 0",
    borderColor: "#433",
  },
  colors: {
    accent: "#962121",
    accentContrast: "white",
    glow: "#ff0000",
    wallpaper: "#ddd",
    bgTransSecondary: "rgba(255,255,255,0.2)",
    bgTransPrimary: "rgba(255,255,255,0.5)",
    bgTint: "rgba(0,0,0,0.1)",
    text: "#433",
    textMuted: "#744",
  },
});

export const highContrastTheme: Theme = themeFactory({
  displayName: "High Contrast",
  global: css`
  `,
  wallpaperUrl: "",
  bodyFont: "1.2em sans-serif",
  displayFont: "1.2em sans-serif",
  logoFrontElementStyle: {
    color: "#000",
  },
  logoRearElementStyle: {
    display: "none",
  },
  logoTransform: "none",
  logoBackdropStyle: {
  },
  colors: {
    accent: "#005",
    accentContrast: "white",
    glow: "#bbf",
    wallpaper: "#ddd",
    bgTransSecondary: white.opacity(0.2).toString(),
    bgTransPrimary: white.opacity(0.4).toString(),
    bgTint: black.opacity(0.1).toString(),
    text: "#000",
    textMuted: "#111",
  },
});

export const fearTheme: Theme = themeFactory({
  displayName: "Nothing To Fear",
  global: css`
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
  `,
  wallpaperUrl: `url(systems/${systemName}/assets/wallpaper/annie-spratt-xvU-X0GV9-o-unsplash.webp)`,
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal normal normal 1.1em 'Special Elite', serif",
  logoFrontElementStyle: {
    background: "linear-gradient(90deg, rgba(73, 61, 51, 1.0) 0%, rgba(97, 81, 68, 0.7) 100%)",
    backgroundClip: "text",
  },
  logoRearElementStyle: {
    textShadow: "0px 0px 10px white",
  },
  logoTransform: "scale(0.8)",
  logoBackdropStyle: {
  },
  colors: {
    accent: "#615144",
    accentContrast: "white",
    glow: "#fff",
    wallpaper: "#b6b3b3", //
    bgTransSecondary: "rgba(255,255,255,0.2)",
    bgTransPrimary: "rgba(255,255,255,0.5)",
    bgTint: "rgba(0,0,0,0.1)",
    text: "#444",
    textMuted: "#666",
  },
});

const pallidBlur = "5px";
const pallidOffset = "3px";
const stripNewlines = (s: string) => s.replace("\n", "");
const pallidColor = Irid("#282c34");
const pallidComplement = Irid("#aff2f2");

export const pallidTheme: Theme = themeFactory({
  displayName: "Aching Stars",
  global: css`
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Nova+Square&display=swap');
  `,
  wallpaperUrl: `url(systems/${systemName}/assets/wallpaper/guille-pozzi-sbcIAn4Mn14-unsplash.webp)`,
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "bold small-caps normal 1.1em 'Nova Square', serif",
  // logo:
  logoFrontElementStyle: {
    background: "linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(108,108,108,1) 24%, rgba(148,148,148,1) 34%, rgba(106,106,106,1) 44%, rgba(0,0,0,1) 87%, rgba(143,143,143,1) 100%)",
    backgroundClip: "text",
  },
  logoRearElementStyle: {
    textShadow: stripNewlines(`
      -${pallidOffset} -${pallidOffset} ${pallidBlur} #cdf6ff, 
      -${pallidOffset} ${pallidOffset} ${pallidBlur} #cdf6ff, 
      ${pallidOffset} -${pallidOffset} ${pallidBlur} #cdf6ff, 
      ${pallidOffset} ${pallidOffset} ${pallidBlur} #cdf6ff`),
  },
  logoTransform: "rotateY(21deg) rotateZ(0deg) translateX(4%) scale(0.8)",
  logoBackdropStyle: {
    perspective: "500px",
    perspectiveOrigin: "50% 50%",

    background: `url(systems/${systemName}/assets/wallpaper/philipp-trubchenko-jObj_p885Gg-unsplash.webp)`,
    backgroundSize: "cover",
    transform: "scaleY(1.1) scaleX(1.1) translateY(0%) rotate(0deg)",
    height: "400%",
    width: "150%",
    zIndex: -1,
    borderStyle: "none",
    maskImage: "linear-gradient(rgba(0, 0, 0, 1.0), transparent)",
  },
  colors: {
    wallpaper: "#152938",
    accent: pallidComplement.toString(),
    accentContrast: "#333",
    glow: pallidComplement.lightness(0.7).toString(),

    bgTransSecondary: pallidColor.lightness(0.3).opacity(0.5).toString(),
    bgTransPrimary: pallidColor.lightness(0.1).opacity(0.5).toString(),

    bgTint: "rgba(255,255,255,0.1)",
    text: "#ddd",
    textMuted: "#aaa",
  },
});

const numRepeats = 5;
const colors = [
  "#f4e83f",
  "#a06f18",
  "#b78d6c",
  "#cc7171",
  "#ebaa4b",
  "#e47005",
  "#ed9907",
];
const numColors = colors.length;
const wedge = 360 / (numRepeats * numColors);
const gradientParts = [
  `${colors[0]} ${wedge}deg`,
  ...(colors
    .slice(1)
    .map((color, i) => `${color} ${wedge * i}deg ${wedge * (i + 1)}deg`)),
].join(", ");

const gradient = `repeating-conic-gradient(${gradientParts})`;

export const deltaGroovyTheme: Theme = themeFactory({
  displayName: "Delta Groovy",
  global: css`
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Spicy+Rice&display=swap');    
  `,
  wallpaperUrl: `url(systems/${systemName}/assets/wallpaper/stil-wtqe5nd5MYk-unsplash.webp)`,
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal normal normal 1.1em 'Spicy Rice', serif",
  logoFrontElementStyle: {
    background: "#fff",
    backgroundClip: "text",
  },
  logoRearElementStyle: {
    textShadow:
    // "0 0 0.3em #fff, " +
    "-0.01em -0.01em 0 #000, " +
    "0.01em 0.01em 0 #000, " +
    "0.1em  0.1em  0 #d22fe5ff, " +
    "0.11em 0.11em 0 #000, " +
    "0.2em 0.2em 0 #e5762fff, " +
    "0.21em 0.21em 0 #000 " +
    // "0.3em 0.3em 0 #a9c47c" +
    ""
    ,
  },
  // logoTransform: "scale(0.8)",
  logoTransform: "translateY(-0.1em)",
  logoBackdropStyle: {
    backgroundColor: "#293417",
    // backgroundImage: "conic-gradient(#f69d3c, #3f87a6)",
    backgroundImage: gradient,
    maskImage: "linear-gradient(rgba(0, 0, 0, 1.0), transparent)",
    margin: "-50em",
  },
  colors: {
    accent: "#801d8c ",
    accentContrast: "white",
    glow: "#fff",
    wallpaper: "#b6b3b3", //
    bgTransSecondary: "rgba(255,255,255,0.2)",
    bgTransPrimary: "rgba(255,255,255,0.5)",
    bgTint: "rgba(0,0,0,0.1)",
    text: "#444",
    textMuted: "#666",
  },
});

export const greenTriangleTheme: Theme = themeFactory({
  displayName: "Green triangle",
  global: css`
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Big+Shoulders+Stencil+Display:wght@900&family=Big+Shoulders+Stencil+Text:wght@100;200;300;400;500;600;700;800;900&display=swap');  `,
  wallpaperUrl: `url(systems/${systemName}/assets/wallpaper/annie-spratt-xTaOPMa6wAE-unsplash.webp)`,
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "900 small-caps normal 1.1em 'Big Shoulders Stencil Text', serif",
  logoFrontElementStyle: {
    color: "#fff",
    maskImage: `url(systems/${systemName}/assets/wallpaper/annie-spratt-ctXf1GVyf9A-unsplash.webp)`,
    maskMode: "luminance",
    maskRepeat: "repeat",
  },
  logoRearElementStyle: {
    textShadow:
      "0 0 0.2em #cfffc2",
  },
  logoTransform: "scale(1.0, 0.8) rotate(-1.5deg)",
  logoBackdropStyle: {
  },
  colors: {
    // accent: "#256425",
    accent: "#150",
    accentContrast: "#fff",
    glow: "#cfffc2",
    wallpaper: "#b6b3b3", //
    bgTransSecondary: "#fff6",
    bgTransPrimary: "#fff9",
    bgTint: "rgba(0,0,0,0.1)",
    text: "#000",
    textMuted: "#33",
  },
});

export const whistleTheme: Theme = themeFactory({
  displayName: "Antiquarian",
  global: css`
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=IM+Fell+Great+Primer:ital@0;1&display=swap');`,
  // wallpaperUrl: "none",
  // wallpaperUrl: `url(systems/${systemName}/assets/wallpaper/kiwihug-qv05FvdE26k-unsplash.webp)`,
  wallpaperUrl: `url(systems/${systemName}/assets/wallpaper/scott-webb-UjupleczBOY-unsplash.webp)`,
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal normal normal 1.1em 'IM Fell Great Primer', serif",
  logoFrontElementStyle: {
    color: "#000",
    maskImage: `url(systems/${systemName}/assets/wallpaper/annie-spratt-UR2DMIFuc5c-unsplash.webp)`,
    maskMode: "luminance",
    maskRepeat: "repeat",
    maskSize: "contain",
    textShadow: "0.02em 0.02em 0px #fff",
  },
  logoRearElementStyle: {
    // textShadow: "0 0 0.2em #cfffc2",
    display: "none",
  },
  // logoTransform: "scale(1.0, 0.8) rotate(-1.5deg)",
  logoTransform: "scale(0.7) translateY(-0.35em)",
  logoBackdropStyle: {
    backgroundImage: `url(systems/${systemName}/assets/wallpaper/headpiece7-768.webp)`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "bottom",
    backgroundSize: "75%",
    maskImage: `url(systems/${systemName}/assets/wallpaper/annie-spratt-UR2DMIFuc5c-unsplash.webp)`,
    maskMode: "luminance",
    maskRepeat: "repeat",
    maskSize: "contain",

  },
  colors: {
    // accent: "#256425",
    accent: "#236",
    accentContrast: "#fff",
    glow: "#cfc2ff",
    wallpaper: "#eee", //
    bgTransSecondary: "#fff6",
    bgTransPrimary: "#fff9",
    bgTint: "rgba(0,0,0,0.1)",
    text: "#222",
    textMuted: "#333",
  },
});

export const themes: {[themeName: string]: Theme} = {
  tealTheme,
  niceTheme,
  niceThemeDark,
  highContrastTheme,
  fearTheme,
  pallidTheme,
  deltaGroovyTheme,
  greenTriangleTheme,
  whistleTheme,
};

export const ThemeContext = React.createContext<Theme>(tealTheme);
