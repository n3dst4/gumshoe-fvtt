import { systemId } from "../constants";
import { themeFactory } from "./functions";
import { ThemeV1 } from "./types";

const orange = "#af2211";
const darkOrange = "#b63017";
const glow = "#ed6a26";
const yellow = "#ffef78";

export const unsafeRealityTheme: ThemeV1 = themeFactory({
  schemaVersion: "v1",
  displayName: "Unsafe Reality",
  global: `
    @import url('https://fonts.googleapis.com/css2?family=Averia+Serif+Libre:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Averia+Libre:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Averia+Serif+Libre:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');
  `,
  largeSheetRootStyle: {
    background: `
      url(systems/${systemId}/assets/wallpaper/blue-purple-unreality.webp)
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  // smallSheetRootStyle: {
  //   backgroundImage: `url(systems/${systemName}/assets/wallpaper/annie-spratt-xvU-X0GV9-o-unsplash.webp)`,
  // },
  bodyFont: "16px 'Averia Libre', sans-serif",
  displayFont: "normal normal normal 1.1em 'Averia Libre', serif",
  logo: {
    frontTextElementStyle: {
      color: yellow,
      maskImage: `url(systems/${systemId}/assets/wallpaper/grunge-gradient.webp)`,
      maskMode: "luminance",
      maskRepeat: "no-repeat",
      maskSize: "100% 100%",
      maskOrigin: "border-box",
      // textShadow: [
      //   "0.03em 0.03em 0px #fff",
      //   // "0.06em 0.06em 0px #000",
      //   "-0.03em -0.03em 0px #fff",
      //   // "-0.06em -0.06em 0px #000",
      // ].join(", "),
    },
    rearTextElementStyle: {
      color: orange,
      textShadow: `
      -5px -5px 10px ${glow},
      5px 5px 10px ${glow}
      `,
    },
    textElementsStyle: {
      // transform: "scale(0.8)",
      transform: "rotateY(15deg) rotateZ(-2deg) translateX(-0%)",
      fontVariant: "small-caps",
    },
    backdropStyle: {
      backgroundImage: `linear-gradient(to bottom, ${darkOrange} 0%, ${orange} 100%)`,
      maskImage: `url(systems/${systemId}/assets/wallpaper/esoterica.webp)`,
      maskMode: "luminance",
      maskRepeat: "no-repeat",
      maskSize: "contain",
      maskPosition: "50% 10%",
      maskOrigin: "border-box",
      margin: "-2em -0em -3em",
    },
  },

  colors: {
    accent: "#e2a553",
    accentContrast: "black",
    glow: "#f4bcf0",
    wallpaper: "#144350", //
    backgroundSecondary: "rgba(255,255,255,0.1)",
    backgroundPrimary: "rgba(0,0,0,0.4)",
    backgroundButton: "rgba(0,0,0,0.1)",
    text: "#ccc",
  },
});
