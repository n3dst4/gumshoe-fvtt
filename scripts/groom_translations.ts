import path from "path";
import { readdir, readFile, writeFile } from "fs/promises";
import chalk from "chalk";

const parts = path.parse(__filename);
const langDir = path.join(parts.dir, "..", "src", "lang");
const files = (await readdir(langDir)).filter((f) => f.endsWith(".json") && f !== "en.json");
const enPath = path.join(langDir, "en.json");
const enParsed = JSON.parse(await readFile(enPath).toString());
const enSorted: Record<string, string> = {};
for (const x of Object.keys(enParsed).sort()) {
  enSorted[x] = enParsed[x];
}
const json = JSON.stringify(enSorted, null, 4);
await writeFile(enPath, json);

async function sortLang (filename: string) {
  const filePath = path.join(langDir, filename);
  const parsed = JSON.parse(await readFile(filePath).toString());
  const result: Record<string, string> = {};
  for (const key of Object.keys(enSorted)) {
    const translation = parsed[key] as string;
    if (translation === undefined || translation.startsWith("FIXME")) {
      console.log(chalk.red(`${filename} is missing a translation for ${key}`));
    }
    result[key] = translation ?? `FIXME ${enSorted[key]}`;
  }
  const json = JSON.stringify(result, null, 4);
  await writeFile(filePath, json);
}

const proms = files.map(async (filename) => {
  sortLang(filename);
});

Promise.all(proms);
