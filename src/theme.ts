import { css, CSSObject, SerializedStyles } from "@emotion/react";
import React from "react";
import { systemName } from "./constants";
import Irid from "irid";

const white = Irid("white");
const black = Irid("black");

export type ThemeSeed = {
  /** The name of the theme. Use puns and allusions liberally. */
  displayName: string,
  /**
   * CSS block which will be inserted at the top of the browser document. This
   * is a good place for `@import` directives for loading fonts.
   */
  global?: SerializedStyles,
  /**
   * Will be applied to the root element of the themed area. This is a good
   * place to apply a wallpaper image.
   */
  rootElementStyle: CSSObject,
  /**
   * Font string for block text.
   */
  bodyFont?: string,
  /**
   * Font string for title or label text.
   */
  displayFont?: string,
  /**
   * Styles for the fancy character sheet logo. See the LogoEditable component
   * for details.
   */
  logo: {
    /**
     * These styles will be applied to the front text element, so you can do the
     * `background-clip: text; color: transparent;` trick to get gradient (or
     * other image) text.
     */
    frontTextElementStyle: CSSObject,
    /**
     * These styles will be applied to the rear text element. This is a good
     * place to add drop shadows because if you put them on the front element
     * while doing the `background-clip: text; color: transparent;` trick the
     * shadow will show through the text 🥺
     */
    rearTextElementStyle: CSSObject,
    /**
     * These styles will be applied to both text elements at once (actually to a
     * wrapper around them. This is a good place to apply `transform`s.
     */
    textElementsStyle: CSSObject,
    /**
     * These styles will be applied to the otherwise-empty div that goes behind
     * the text elements.
     */
    backdropStyle: CSSObject,
  },

  /**
   * All the values in this collection should be parseable as CSS colors
   */
  colors: {
    accent: string,
    accentContrast: string,
    glow: string,
    wallpaper: string,
    danger?: string,

    bgTransSecondary: string,
    bgTransPrimary: string,

    // bgOpaqueDangerPrimary?: string,
    // bgOpaqueDangerSecondary?: string,

    // bgTransDangerPrimary?: string,
    // bgTransDangerSecondary?: string,

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

  const bgTransPrimary = Irid(seed.colors.bgTransPrimary);
  const bgTransSecondary = Irid(seed.colors.bgTransSecondary);
  const danger = Irid(seed.colors.danger ?? "red");

  const bgTransDangerPrimary = bgTransPrimary.blend(danger, 0.5).opacity(bgTransPrimary.opacity()).toRGBString();
  const bgTransDangerSecondary = bgTransSecondary.blend(danger, 0.5).opacity(bgTransSecondary.opacity()).toRGBString();
  const bgOpaqueDangerPrimary = overlay(seed.colors.wallpaper, bgTransDangerPrimary);
  const bgOpaqueDangerSecondary = overlay(seed.colors.wallpaper, bgTransDangerSecondary);

  return {
    ...seed,
    rootElementStyle: {
      backgroundSize: "cover",
      backgroundPosition: "center",
      ...seed.rootElementStyle,
    },
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
  rootElementStyle: {
    backgroundImage: `url(systems/${systemName}/assets/wallpaper/marjanblan-5Ft4NWTmeJE-unsplash.webp)`,
  },
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal small-caps normal 1em 'Federo', serif",
  logo: {
    frontTextElementStyle: {
      background: "linear-gradient(135deg, #efb183 0%,#222 30%,#efb183 90%)",
      backgroundClip: "text",
    },
    rearTextElementStyle: {
      textShadow: "2px 0px 1px black, 6px 0px 4px rgba(0,0,0,0.5), -1px 0px 0px rgba(255,255,255,0.5)",
    },
    textElementsStyle: {
      transform: "rotateY(-30deg) rotateZ(-1deg) translateX(-5%)",
    },
    backdropStyle: {
      perspective: "500px",
      perspectiveOrigin: "50% 50%",
      backgroundImage: "radial-gradient(closest-side, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)",
    },
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
  rootElementStyle: {
    backgroundImage: `url(systems/${systemName}/assets/wallpaper/tina-dawson-Kim9COAIEGc-unsplash-dark-red.webp)`,
  },
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal normal normal 1.1em 'Unica One', serif",
  logo: {
    frontTextElementStyle: {
      background: "linear-gradient(135deg, #fff 0%, #fff 90%)",
      backgroundClip: "text",
    },
    rearTextElementStyle: {
      textShadow: "2px 0px 1px black, -1px 0px 0px rgba(255,255,255,0.5)",
    },
    textElementsStyle: {
      transform: "scale(0.8)",
    },
    backdropStyle: {
      backgroundColor: "rgba(0,0,0,0.4)",
      transform: "scaleY(0.9) scaleX(1.2) translateY(0.1em)",
      zIndex: -1,
    },
  },
  colors: {
    accent: "#fff",
    accentContrast: "#600",
    glow: "#f33",
    wallpaper: "#4a0d00",
    danger: "yellow",

    bgTransSecondary: "rgba(0,0,0,0.2)",
    bgTransPrimary: "rgba(0,0,0,0.4)",

    // bgTransDangerPrimary: "rgba(255,128,0,0.2)",
    // bgTransDangerSecondary: "rgba(255,128,0,0.3)",

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
  rootElementStyle: {
    backgroundImage: `url(systems/${systemName}/assets/wallpaper/marjanblan-5Ft4NWTmeJE-unsplash.webp)`,
  },
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal normal normal 1.1em 'Unica One', serif",
  logo: {
    frontTextElementStyle: {
      color: "#fff",
    },
    rearTextElementStyle: {
      textShadow: "2px 0px 1px black, -1px 0px 0px rgba(255,255,255,0.5)",
    },
    textElementsStyle: {
      transform: "scale(0.8)",
    },
    backdropStyle: {
      background: `#4a0d00 url(systems/${systemName}/assets/wallpaper/tina-dawson-Kim9COAIEGc-unsplash-dark-red.webp)`,
      backgroundSize: "cover",
      transform: "scaleY(0.9) scaleX(1.2) translateY(0.1em)",
      zIndex: -1,
      borderStyle: "solid",
      borderThickness: "2px 0",
      borderColor: "#433",
    },
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
  rootElementStyle: {
    backgroundImage: "",
  },
  bodyFont: "1.2em sans-serif",
  displayFont: "1.2em sans-serif",
  logo: {
    frontTextElementStyle: {
      color: "#000",
    },
    rearTextElementStyle: {
      display: "none",
    },
    textElementsStyle: {
      transform: "none",
    },
    backdropStyle: {
    },
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
  rootElementStyle: {
    backgroundImage: `url(systems/${systemName}/assets/wallpaper/annie-spratt-xvU-X0GV9-o-unsplash.webp)`,
  },
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal normal normal 1.1em 'Special Elite', serif",
  logo: {
    frontTextElementStyle: {
      background: "linear-gradient(90deg, rgba(73, 61, 51, 1.0) 0%, rgba(97, 81, 68, 0.7) 100%)",
      backgroundClip: "text",
    },
    rearTextElementStyle: {
      textShadow: "0px 0px 10px white",
    },
    textElementsStyle: {
      transform: "scale(0.8)",
    },
    backdropStyle: {
    },
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
  rootElementStyle: {
    backgroundImage: `url(systems/${systemName}/assets/wallpaper/guille-pozzi-sbcIAn4Mn14-unsplash.webp)`,
  },
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "bold small-caps normal 1.1em 'Nova Square', serif",
  logo: {
    frontTextElementStyle: {
      background: "linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(108,108,108,1) 24%, rgba(148,148,148,1) 34%, rgba(106,106,106,1) 44%, rgba(0,0,0,1) 87%, rgba(143,143,143,1) 100%)",
      backgroundClip: "text",
    },
    rearTextElementStyle: {
      textShadow: stripNewlines(`
        -${pallidOffset} -${pallidOffset} ${pallidBlur} #cdf6ff, 
        -${pallidOffset} ${pallidOffset} ${pallidBlur} #cdf6ff, 
        ${pallidOffset} -${pallidOffset} ${pallidBlur} #cdf6ff, 
        ${pallidOffset} ${pallidOffset} ${pallidBlur} #cdf6ff`),
    },
    textElementsStyle: {
      transform: "rotateY(21deg) rotateZ(0deg) translateX(4%) scale(0.8)",
    },
    backdropStyle: {
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
  rootElementStyle: {
    backgroundImage: `url(systems/${systemName}/assets/wallpaper/stil-wtqe5nd5MYk-unsplash.webp)`,
  },
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal normal normal 1.1em 'Spicy Rice', serif",
  logo: {
    frontTextElementStyle: {
      background: "#fff",
      backgroundClip: "text",
    },
    rearTextElementStyle: {
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
    textElementsStyle: {
      transform: "translateY(-0.1em)",
    },
    backdropStyle: {
      backgroundColor: "#293417",
      backgroundImage: gradient,
      maskImage: "linear-gradient(rgba(0, 0, 0, 1.0), transparent)",
      margin: "-50em",
    },
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
  rootElementStyle: {
    backgroundImage: `url(systems/${systemName}/assets/wallpaper/annie-spratt-xTaOPMa6wAE-unsplash.webp)`,
  },
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "900 small-caps normal 1.1em 'Big Shoulders Stencil Text', serif",
  logo: {
    frontTextElementStyle: {
      color: "#fff",
      maskImage: `url(systems/${systemName}/assets/wallpaper/annie-spratt-ctXf1GVyf9A-unsplash.webp)`,
      maskMode: "luminance",
      maskRepeat: "repeat",
    },
    rearTextElementStyle: {
      textShadow:
        "0 0 0.2em #cfffc2",
    },
    textElementsStyle: {
      transform: "scale(1.0, 0.8) rotate(-1.5deg)",
    },
    backdropStyle: {
    },
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

export const antiquarianTheme: Theme = themeFactory({
  displayName: "Antiquarian",
  global: css`
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&display=swap');`,
  rootElementStyle: {
    backgroundImage: `url(systems/${systemName}/assets/wallpaper/scott-webb-UjupleczBOY-unsplash.webp)`,
  },
  bodyFont: "16px 'Patrick Hand SC', sans-serif",
  displayFont: "normal small-caps normal 1.1em 'IM Fell English', serif",
  logo: {
    frontTextElementStyle: {
      color: "#000",
      maskImage: `url(systems/${systemName}/assets/wallpaper/annie-spratt-UR2DMIFuc5c-unsplash.webp)`,
      maskMode: "luminance",
      maskRepeat: "repeat",
      maskSize: "contain",
      textShadow: "0.02em 0.02em 0px #fff",
    },
    rearTextElementStyle: {
      display: "none",
    },
    textElementsStyle: {
      transform: "scale(0.6)",
    },
    backdropStyle: {
      backgroundImage: `url(systems/${systemName}/assets/wallpaper/tailpiece9-768.webp), url(systems/${systemName}/assets/wallpaper/tailpiece9-768.webp)`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "bottom, top",
      backgroundSize: "19%",
      maskImage: `url(systems/${systemName}/assets/wallpaper/annie-spratt-UR2DMIFuc5c-unsplash.webp)`,
      maskMode: "luminance",
      maskRepeat: "repeat",
      maskSize: "contain",
    },
  },
  colors: {
    accent: "#236",
    accentContrast: "#fff",
    glow: "#cfffc2",
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
  antiquarianTheme,
};

export const ThemeContext = React.createContext<Theme>(tealTheme);
