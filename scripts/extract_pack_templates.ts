/* eslint-disable @typescript-eslint/no-var-requires */

const mapping = {
  category: "data.category",
} as const;

/**
 * go though the compendium packs, and for each one, emit an untranslated
 * template file. once comiotted and pushed, this will be picked up by transifex
 * and update the translation list.
 */
async function updatePackSourceTranslations () {
  // ===========================================================================
  // requires
  // ===========================================================================
  const system = require("../src/system.json");
  const path = require("path");
  const {
    // readdir,
    // readFile,
    writeFile,
  } = require("fs/promises");
  const chalk = require("chalk");
  const Datastore = require("nedb-promises");

  // ===========================================================================
  // actual code
  // ===========================================================================
  const parts = path.parse(__filename);
  const srcDir = path.join(parts.dir, "..", "src");
  const itemPacks = system.packs.filter((p: any) => p.entity === "Item");

  for (const pack of itemPacks) {
    process.stdout.write(`Processing ${chalk.green(pack.label)}... `);
    const entries: Record<string, {name: string, category: string}> = {};
    const store = Datastore.create({
      filename: path.join(srcDir, pack.path),
      autoload: true,
    });
    const docs = await store.find({});
    for (const doc of docs) {
      entries[doc.name] = {
        name: doc.name,
        category: doc.data.category,
      };
    }
    const numEntries = Object.keys(entries).length;
    process.stdout.write(`found ${numEntries} entries\n`);
    const babeleData = {
      label: pack.label,
      mapping,
      entries,
    };
    const outFilePath = path.join(srcDir, "lang", "babele-sources", path.basename(pack.path, ".db"));
    const json = JSON.stringify(babeleData, null, 4);
    await writeFile(outFilePath, json);
  }
}

updatePackSourceTranslations();
