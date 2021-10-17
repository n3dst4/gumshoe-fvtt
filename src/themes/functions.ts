import Irid from "irid";
import { Theme, ThemeSeed } from "./types";

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
    largeSheetRootStyle: {
      backgroundSize: "cover",
      backgroundPosition: "center",
      ...seed.largeSheetRootStyle,
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
