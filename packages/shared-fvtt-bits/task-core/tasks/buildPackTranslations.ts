// this entire task is going to stop working because of the switch to leveldb
// so I cba to fix it
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import chalk from "chalk";
import { writeFile } from "fs/promises";
import path from "path";

import { TaskArgs } from "../types";

/**
 * go though the compendium packs, and for each one, emit an untranslated
 * template file. once comitted and pushed, this will be picked up by transifex
 * and update the translation list.
 */
export async function buildPackTranslations({
  manifest,
  publicPath,
  log,
}: TaskArgs) {
  log("Building pack translations");
  // load nedb async to avoid slowing unrelated tasks
  const { default: Datastore } = await import("@seald-io/nedb");

  const mapping = {
    category: "system.category",
  };

  const itemPacks = manifest.packs?.filter((p) => p.type === "Item");

  for (const pack of itemPacks ?? []) {
    log(`Processing ${chalk.green(pack.label)}... `);
    const entries: Record<string, any> = {};

    const store = new Datastore({
      filename: path.join(publicPath, pack.path),
      autoload: true,
    });

    const docs = await store.find({});
    docs["sort"]((a: any, b: any) => a.name.localeCompare(b.name));
    for (const docId in docs) {
      const doc = docs[docId];
      entries[doc.name] = {
        name: doc.name,
        category: doc.system.category,
      };
    }
    const numEntries = Object.keys(entries).length;
    log(`found ${numEntries} entries\n`);
    const babeleData = {
      label: pack.label,
      mapping,
      entries,
    };
    const outFileName = `${manifest.id}.${path.basename(
      pack.path,
      ".db",
    )}.json`;
    const outFilePath = path.join(
      publicPath,
      "lang",
      "babele-sources",
      outFileName,
    );
    const json = JSON.stringify(babeleData, null, 4);
    await writeFile(outFilePath, json);
  }
}

buildPackTranslations.description = "Build pack translations";
