import { defaultCustomThemePath } from "../constants";
import JSON5 from "json5";
import { ThemeSeedV1 } from "@lumphammer/investigator-fvtt-types";
import { highContrastTheme } from "../themes/highContrastTheme";
import { assertGame } from "../functions";
import { settings } from "../settings";
import yaml from "yamljs";

export function loadCustomThemes () {
  const jsonRe = /\.(?:json|json5)$/;
  const yamlRe = /\.(?:yaml|yml)$/;
  const schemaRe = /^v(?:1)/;

  Hooks.on("setup", async () => {
    assertGame(game);
    const customThemePath = settings.customThemePath.get();
    logger.log({ customThemePath });
    let files: string[] = [];

    try {
      const result = await FilePicker.browse("data", customThemePath, {});
      files = result.files;
    } catch {
      // probably the folder doesn't exist. if this is the case and the user has
      // modified the setting, warn them about it
      if (customThemePath !== defaultCustomThemePath) {
        if (game?.user?.isGM) {
          ui.notifications?.error(
            `Custom theme path "${customThemePath}" does not exist.`,
            {},
          );
        }
        return;
      }
    }
    logger.log({ files });
    for (const filename of files) {
      let blob: any = null;
      try {
        const getText = async () => await (await fetch(filename)).text();
        if (jsonRe.test(filename)) {
          const text = await getText();
          blob = JSON5.parse(text);
        } else if (yamlRe.test(filename)) {
          const text = await getText();
          // blob = YAML.parse(text);
          // blob = {};
          blob = yaml.parse(text);
        } else {
          continue;
        }
        if (!blob) {
          throw new Error("Could not parse");
        }
        if (!blob.displayName) {
          throw new Error("No displayName");
        }
        if (!blob.schemaVersion) {
          throw new Error("No schemaVersion");
        }
        if (!schemaRe.test(blob.schemaVersion)) {
          throw new Error(`schemaVersion "${blob.schemaVersion}" not recognised`);
        }
        const seed: ThemeSeedV1 = {
          colors: {
            accent: highContrastTheme.colors.accent,
            accentContrast: highContrastTheme.colors.accentContrast,
            glow: highContrastTheme.colors.glow,
            wallpaper: highContrastTheme.colors.wallpaper,
            text: highContrastTheme.colors.text,
            backgroundButton: highContrastTheme.colors.backgroundButton,
            backgroundPrimary: highContrastTheme.colors.backgroundPrimary,
            backgroundSecondary: highContrastTheme.colors.backgroundSecondary,
            ...blob.colors,
          },
          displayName: blob.displayName,
          largeSheetRootStyle: blob.largeSheetRootStyle ?? {},
          logo: {
            backdropStyle:
              blob.logo?.backdropStyle ??
              highContrastTheme.logo.backdropStyle,
            frontTextElementStyle:
              blob.logo?.frontTextElementStyle ??
              highContrastTheme.logo.frontTextElementStyle,
            rearTextElementStyle:
              blob.logo?.rearTextElementStyle ??
              highContrastTheme.logo.rearTextElementStyle,
            textElementsStyle:
              blob.logo?.textElementsStyle ??
              highContrastTheme.logo.textElementsStyle,
            fontScaleFactor: blob.logo?.fontScaleFactor,
          },
          schemaVersion: blob.schemaVersion,
          appWindowStyle: blob.appWindowStyle ?? {},
          bodyFont: blob.bodyFont ?? highContrastTheme.bodyFont,
          displayFont: blob.displayFont ?? highContrastTheme.displayFont,
          global: blob.global ?? highContrastTheme.global,
          smallSheetRootStyle: blob.smallSheetRootStyle ?? {},
        };
        logger.log(`Loaded local theme ${filename}`, seed);
        CONFIG.Investigator?.installTheme(filename, seed);
      } catch (e: any) {
        if (game?.user?.isGM) {
          ui.notifications?.error(
            `Problem with custom theme "${filename}": ${e?.message}.`,
            {},
          );
        }
      }
    }
  });

  // CONFIG.Investigator.installTheme: (id: string, seed: ThemeSeedV1)
}
