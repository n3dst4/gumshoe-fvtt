import { defaultCustomThemePath } from "../constants";
import { getCustomThemePath } from "../settingsHelpers";
// import YAML from "yaml";
import JSON5 from "json5";

export function loadCustomThemes () {
  const jsonRe = /\.(?:json|json5)$/;
  // const yamlRe = /\.(?:yaml|yml)$/;

  Hooks.on("setup", async () => {
    const customThemePath = getCustomThemePath();
    let files: string[] = [];

    try {
      const result = await FilePicker.browse("data", customThemePath, {});
      files = result.files;
    } catch {
      // probably the folder doesn't exist. if this is the case and the user has
      // modified the setting, warn them about it
      if (customThemePath !== defaultCustomThemePath) {
        ui.notifications?.error(`Custom theme path "${customThemePath}" does not exist.`, {});
        return;
      }
    }
    for (const filename of files) {
      // const blob: any = null;
      if (jsonRe.test(filename)) {
        // const url = `${customThemePath}/${filename}`;
        // logger.log({ url });
        const text = await (await fetch(filename)).text();
        logger.log({ text });
        const blob = JSON5.parse(text);
        logger.log({ blob });
      }
    }
  });

  // CONFIG.Investigator.installTheme: (id: string, seed: ThemeSeedV1)
}
