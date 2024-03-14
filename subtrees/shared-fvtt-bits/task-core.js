#!/usr/bin/env node

import archiver from "archiver";
import chalk from "chalk";
import { writeFile } from "fs/promises";
import fs from "fs-extra";
import path from "path";
import { rimraf } from "rimraf";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

/// ////////////////////////////////////////////////////////////////////////////
// Utilities

// logging function
export const log = console.log.bind(console, chalk.green("[task]"));

// if subject is a semver string beginning with a v, remove the v
const stripInitialv = (subject) =>
  subject.replace(/^v(\d+\.\d+\.\d+.*)/i, (_, ...[match]) => match);

/**
 * Remove built files from `build` folder
 * while ignoring source files
 */
export async function clean({ rootPath, buildPath }) {
  const distPath = path.join(rootPath, buildPath);
  log("Cleaning...");
  await rimraf(distPath);
  log("Done.");
}

clean.description = "Remove built files from `build` folder";

/**
 * go though the compendium packs, and for each one, emit an untranslated
 * template file. once comitted and pushed, this will be picked up by transifex
 * and update the translation list.
 */
export async function buildPackTranslations({ manifest, publicPath }) {
  log("Building pack translations");
  // load nedb async to avoid slowing unrelated tasks
  const { default: Datastore } = await import("@seald-io/nedb");

  const mapping = {
    category: "system.category",
  };

  const itemPacks = manifest.packs.filter((p) => p.type === "Item");

  for (const pack of itemPacks) {
    log(`Processing ${chalk.green(pack.label)}... `);
    const entries = {};

    const store = new Datastore({
      filename: path.join(publicPath, pack.path),
      autoload: true,
    });

    const docs = await store.find({});
    docs.sort((a, b) => a.name.localeCompare(b.name));
    for (const doc of docs) {
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

/**
 * Remove the link to foundrydata
 */
export async function unlink({ linkDir }) {
  if (!linkDir) {
    throw new Error("linkDir not set");
  }
  log(chalk.yellow(`Removing build link from ${chalk.blueBright(linkDir)}`));
  return fs.remove(linkDir);
}

unlink.description = "Remove the link to foundrydata";

/**
 * Link build to foundrydata
 */
export async function link({ buildPath, linkDir }) {
  if (!linkDir) {
    throw new Error("linkDir not set");
  }
  if (!fs.existsSync(linkDir)) {
    log(
      `Linking ${chalk.blueBright(buildPath)} to ${chalk.blueBright(linkDir)}`,
    );
    return fs.symlink(path.resolve(buildPath), linkDir);
  } else {
    log(chalk.magenta(`${chalk.blueBright(linkDir)} already exists`));
  }
}

link.description = "Link build to foundrydata";

/**
 * Update the manifest in CI
 */
export async function updateManifestFromCITagPush({ manifest, manifestPath }) {
  const tag = process.env.CI_COMMIT_TAG;
  const path = process.env.CI_PROJECT_PATH;
  if (!tag) {
    throw new Error(
      "This task should only be run from a CI tag push, but $CI_COMMIT_TAG was empty or undefined",
    );
  }
  if (stripInitialv(tag) !== manifest.version) {
    throw new Error(
      `Manifest version (${manifest.version}) does not match tag (${tag})`,
    );
  }
  manifest.download = `https://github.com/${path}/releases/download/${tag}/${manifest.id}.zip`;
  log({ tag, path, manifest });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

updateManifestFromCITagPush.description = "Update manifest from CI tag push";

/**
 * create a releasable package
 * (package is a reserved word)
 */
export async function packidge({ manifest, buildPath }) {
  return new Promise((resolve, reject) => {
    try {
      // Ensure there is a directory to hold all the packaged versions
      fs.ensureDirSync("package");
      // Initialize the zip file
      const zipName = process.env.ZIP_FILE_NAME ?? `${manifest.id}.zip`;
      const zipFile = fs.createWriteStream(path.join("package", zipName));
      const zip = archiver("zip", { zlib: { level: 9 } });
      zipFile.on("close", () => {
        log(chalk.green(zip.pointer() + " total bytes"));
        log(chalk.green(`Zip file ${zipName} has been written`));
        return resolve();
      });
      zip.on("error", (err) => {
        throw err;
      });
      zip.pipe(zipFile);
      // Add the directory with the final code
      zip.directory(buildPath, manifest.id);
      zip.finalize();
    } catch (err) {
      return reject(err);
    }
  });
}

packidge.description = "Create a releasable package";

export async function boot({
  config: { rootPath, publicPath, manifestName, buildPath },
  commands,
}) {
  const manifestPath = path.join(publicPath, manifestName);
  const manifest = JSON.parse((await fs.readFile(manifestPath)).toString());

  let config, linkDir;
  try {
    config = await fs.readJSON("foundryconfig.json");
  } catch (e) {
    log(chalk.magenta("foundryconfig.json not found - assuming CI"));
  }
  if (config?.dataPath) {
    const linkRoot = manifestName === "system.json" ? "systems" : "modules";
    linkDir = path.join(config.dataPath, "Data", linkRoot, manifest.id);
  }

  const finalConfig = {
    publicPath,
    manifestName,
    manifestPath,
    buildPath,
    linkDir,
    rootPath,
    manifest,
  };
  // log(finalConfig);

  const proc = yargs(hideBin(process.argv));
  for (const command of commands) {
    proc.command(
      command.name,
      command.description ?? "",
      () => {},
      () => command(finalConfig),
    );
  }
  proc.completion();
  proc.demandCommand(1);
  proc.parse();
}
