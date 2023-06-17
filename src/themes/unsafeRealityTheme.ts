import { systemId } from "../constants";
import { themeFactory } from "./functions";
import { ThemeV1 } from "./types";

export const unsafeRealityTheme: ThemeV1 = themeFactory({
  schemaVersion: "v1",
  displayName: "Unsafe Reality2",
  global: `
    @import url('https://fonts.googleapis.com/css2?family=Averia+Serif+Libre:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Averia+Libre:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Averia+Serif+Libre:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');
  `,
  largeSheetRootStyle: {
    background: `
      url(systems/${systemId}/assets/wallpaper/pawel-czerwinski-RPMcxbm2zi4-unsplash.webp)
    `,
  },
  // smallSheetRootStyle: {
  //   backgroundImage: `url(systems/${systemName}/assets/wallpaper/annie-spratt-xvU-X0GV9-o-unsplash.webp)`,
  // },
  bodyFont: "16px 'Averia Libre', sans-serif",
  displayFont: "normal normal normal 1.1em 'Averia Libre', serif",
  logo: {
    frontTextElementStyle: {
      background:
        "linear-gradient(90deg, rgba(73, 61, 51, 1.0) 0%, rgba(97, 81, 68, 0.7) 100%)",
      backgroundClip: "text",
    },
    rearTextElementStyle: {
      textShadow: "0px 0px 10px white",
    },
    textElementsStyle: {
      transform: "scale(0.8)",
    },
    backdropStyle: {},
  },

  colors: {
    accent: "#ed9f5e",
    accentContrast: "black",
    glow: "#fff",
    wallpaper: "#144350", //
    backgroundSecondary: "rgba(0,0,0,0.2)",
    backgroundPrimary: "rgba(0,0,0,0.5)",
    backgroundButton: "rgba(0,0,0,0.1)",
    text: "#f3dbb2",
  },
});
