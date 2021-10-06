/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * go through the core en translations and mak sure all the non-en .json files
 * have the same entries.
 *
 * this should become redundant if we start using a translation management
 * platform
 */
async function groomTranslations () {
  const path = require("path");
  const { readdir, readFile, writeFile } = require("fs/promises");
  const chalk = require("chalk");

  const parts = path.parse(__filename);
  const langDir = path.join(parts.dir, "..", "src", "lang");
  const files = (await readdir(langDir)).filter((f: string) => f.endsWith(".json") && f !== "en.json");
  const enPath = path.join(langDir, "en.json");
  const text = await (await readFile(enPath)).toString();
  const enParsed = JSON.parse(text);
  const enSorted: Record<string, string> = {};
  for (const x of Object.keys(enParsed).sort()) {
    enSorted[x] = enParsed[x];
  }
  const json = JSON.stringify(enSorted, null, 4);
  await writeFile(enPath, json);

  async function sortLang (filename: string) {
    const filePath = path.join(langDir, filename);
    const parsed = JSON.parse(await (await readFile(filePath)).toString());
    const result: Record<string, string> = {};
    for (const key of Object.keys(enSorted)) {
      const translation = parsed[key] as string;
      if (translation === undefined || translation.startsWith("FIXME")) {
        console.log(chalk.red(`${filename} is missing a translation for ${key}`));
      }
      result[key] = translation ?? `FIXME ${enSorted[key]}`;
    }
    for (const key of Object.keys(parsed)) {
      if (enSorted[key] === undefined) {
        console.log(chalk.red(`${filename} has an extra (not in en.json) translation for ${key}`));
        result[key] = parsed[key];
      }
    }
    const json = JSON.stringify(result, null, 4);
    await writeFile(filePath, json);
  }

  const proms = files.map(async (filename: string) => {
    sortLang(filename);
  });

  return Promise.all(proms);
}

groomTranslations();
