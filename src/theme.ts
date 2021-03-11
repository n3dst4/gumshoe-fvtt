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

  // logo: CSSObject,
  colors: {
    accent: string,
    accentContrast: string,
    glow: string,
    wallpaper: string,

    // bgOpaque: string,
    bgTransSecondary: string,
    bgTransPrimary: string,

    bgTint: string,
    // reverseMedium: string,
    // reverseThick: string,

    text: string,
    textMuted: string,
  },
}

export type Theme = ThemeSeed & {
  colors: ThemeSeed["colors"] & {
    bgOpaquePrimary: string,
    bgOpaqueSecondary: string,
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
 * Turn a ThemeSeed (bare basics for deefining a theme) into a fully usable
 * theme
 */
export const themeFactory = (seed: ThemeSeed): Theme => {
  return {
    ...seed,
    colors: {
      ...seed.colors,
      bgOpaquePrimary: overlay(seed.colors.wallpaper, seed.colors.bgTransPrimary),
      bgOpaqueSecondary: overlay(seed.colors.wallpaper, seed.colors.bgTransSecondary),
    },
  };
};

export const trailTheme: Theme = themeFactory({
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
    // bgOpaque: "#fff",
    bgTint: "rgba(0,0,0,0.1)",
    // reverseMedium: "rgba(0,0,0,0.3)",
    // reverseThick: "rgba(0,0,0,0.5)",
    text: "#433",
    textMuted: "#744",
  },
});

export const nbaThemeDark: Theme = themeFactory({
  displayName: "Night's Dark Red Agents",
  global: css`
    @import url('https://fonts.googleapis.com/css2?family=Unica+One&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
    `,
  //    @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
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
    // background: "linear-gradient(to right, #700 0%, #300 100%)",
    backgroundColor: "rgba(0,0,0,0.4)",
    transform: "scaleY(0.9) scaleX(1.2) translateY(0.1em)",
    zIndex: -1,
    // borderStyle: "solid",
    // borderThickness: "2px 0",
    // borderColor: "#433",
  },
  colors: {
    accent: "#fff",
    accentContrast: "#600",
    glow: "#f33",
    wallpaper: "#4a0d00",
    bgTransSecondary: "rgba(0,0,0,0.2)",
    bgTransPrimary: "rgba(0,0,0,0.4)",
    // bgOpaque: "#000",
    bgTint: "rgba(255,255,255,0.1)",
    // reverseMedium: "rgba(255,255,255,0.3)",
    // reverseThick: "rgba(255,255,255,0.5)",
    text: "#ccc",
    textMuted: "#aaa",
  },
});

export const nbaTheme: Theme = themeFactory({
  displayName: "Nice Light Agents",
  global: css`
    @import url('https://fonts.googleapis.com/css2?family=Unica+One&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
  `,
  wallpaperUrl: `url(systems/${systemName}/assets/wallpaper/marjanblan-5Ft4NWTmeJE-unsplash.webp)`,
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal normal normal 1.1em 'Unica One', serif",
  // logo:
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
    // bgOpaque: "#fff",
    bgTint: "rgba(0,0,0,0.1)",
    // reverseMedium: "rgba(0,0,0,0.3)",
    // reverseThick: "rgba(0,0,0,0.5)",
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
    // bgOpaque: "#fff",
    bgTint: black.opacity(0.1).toString(),
    // reverseMedium: black.opacity(0.2).toString(),
    // reverseThick: black.opacity(0.3).toString(),
    text: "#000",
    textMuted: "#111",
  },
});

export const fearTheme: Theme = themeFactory({
  displayName: "Nothing To Fear",
  global: css`
    @import url("https://use.typekit.net/huq5kcj.css");
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
  `,
  wallpaperUrl: `url(systems/${systemName}/assets/wallpaper/annie-spratt-xvU-X0GV9-o-unsplash.webp)`,
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal normal normal 1.1em sunflower, serif",
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
    wallpaper: "#ddd",
    bgTransSecondary: "rgba(255,255,255,0.2)",
    bgTransPrimary: "rgba(255,255,255,0.5)",
    // bgOpaque: "white",
    bgTint: "rgba(0,0,0,0.1)",
    // reverseMedium: "rgba(0,0,0,0.3)",
    // reverseThick: "rgba(0,0,0,0.5)",
    text: "#444",
    textMuted: "#666",
  },
});

const ashenBlur = "5px";
const ashenOffset = "3px";
const stripNewlines = (s: string) => s.replace("\n", "");
// 00d5ff
const ashenColor = Irid("#282c34");
const ashenComplement = Irid("#aff2f2");

export const ashenTheme: Theme = themeFactory({
  displayName: "Ashy Starships",
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
      -${ashenOffset} -${ashenOffset} ${ashenBlur} #cdf6ff, 
      -${ashenOffset} ${ashenOffset} ${ashenBlur} #cdf6ff, 
      ${ashenOffset} -${ashenOffset} ${ashenBlur} #cdf6ff, 
      ${ashenOffset} ${ashenOffset} ${ashenBlur} #cdf6ff`),
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
    // opacity: 0.8,
    maskImage: "linear-gradient(rgba(0, 0, 0, 1.0), transparent)",
    // borderThickness: "2px 0",
    // borderColor: "#433",
  },
  colors: {
    wallpaper: ashenColor.lightness(0.05).toString(),
    accent: ashenComplement.toString(),
    accentContrast: "#333",
    glow: ashenComplement.lightness(0.7).toString(),

    bgTransSecondary: ashenColor.lightness(0.3).opacity(0.5).toString(),
    bgTransPrimary: ashenColor.lightness(0.1).opacity(0.5).toString(),
    // bgOpaque: ashenColor.lightness(0.1).toString(),

    bgTint: "rgba(255,255,255,0.1)",
    // reverseMedium: "rgba(255,255,255,0.3)",
    // reverseThick: "rgba(255,255,255,0.5)",
    text: "#ddd",
    textMuted: "#aaa",
  },
});

// guille-pozzi-sbcIAn4Mn14-unsplash.webp

export const themes: {[themeName: string]: Theme} = {
  trailTheme,
  nbaTheme,
  nbaThemeDark,
  highContrastTheme,
  fearTheme,
  ashenTheme,
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const ThemeContext = React.createContext<Theme>(trailTheme);
