import { css } from "@emotion/react";
import Irid from "irid";
import { systemName } from "../constants";
import { themeFactory } from "./functions";
import { ThemeV1 } from "./types";

const pallidBlur = "5px";
const pallidOffset = "3px";
const stripNewlines = (s: string) => s.replace("\n", "");
const pallidColor = Irid("#282c34");
const pallidComplement = Irid("#aff2f2");

export const pallidTheme: ThemeV1 = themeFactory({
  schemaVersion: "v1",
  displayName: "Aching Stars",
  global: css`
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Nova+Square&display=swap');
  `,
  largeSheetRootStyle: {
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

    backgroundSecondary: pallidColor.lightness(0.3).opacity(0.5).toString(),
    backgroundPrimary: pallidColor.lightness(0.1).opacity(0.5).toString(),

    backgroundButton: "rgba(255,255,255,0.1)",
    text: "#ddd",
  },
});
