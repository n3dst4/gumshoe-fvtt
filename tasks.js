#!/usr/bin/env node

import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import archiver from "archiver";
import { rimraf } from "rimraf";
import { fileURLToPath } from "url";
import { writeFile } from "fs/promises";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// This file replaces gulp/grunt/jake/whatever and just provides a place to put
// little build-related chunks of code and way to run them from the command
// line.

/// /////////////////////////////////////////////////////////////////////////////
// Config
const publicPath = "public";
const manifestName = "system.json";
const manifestPath = path.join(publicPath, manifestName);
const buildPath = "build";

/// ////////////////////////////////////////////////////////////////////////////
// Utilities

// logging function
const log = console.log.bind(console, chalk.green("[task] "));

// if subject is a semver string beginning with a v, remove the v
const stripInitialv = (subject) =>
  subject.replace(/^v(\d+\.\d+\.\d+.*)/i, (_, ...[match]) => match);

/// /////////////////////////////////////////////////////////////////////////////
// Startup
const manifest = JSON.parse((await fs.readFile(manifestPath)).toString());
const __dirname = path.dirname(fileURLToPath(import.meta.url));
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

/**
 * Remove built files from `build` folder
 * while ignoring source files
 */
async function clean() {
  const distPath = path.join(__dirname, buildPath);
  log("Cleaning...");
  await rimraf(distPath);
  log("Done.");
}

/**
 * go though the compendium packs, and for each one, emit an untranslated
 * template file. once comitted and pushed, this will be picked up by transifex
 * and update the translation list.
 */
async function buildPackTranslations() {
  log("Building pack translations");
  // load nedb async to avoid slowing unrelated tasks
  const { default: Datastore } = await import("@seald-io/nedb");

  const mapping = {
    category: "data.category",
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
        category: doc.data.category,
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

/**
 * Remove the link to foundrydata
 */
async function unlink() {
  if (!linkDir) {
    throw new Error("linkDir not set");
  }
  log(chalk.yellow(`Removing build link from ${chalk.blueBright(linkDir)}`));
  return fs.remove(linkDir);
}

/**
 * Link build to foundrydata
 */
async function link() {
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

/**
 * Update the manifest in CI
 */
async function updateManifestFromCITagPush() {
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

/**
 * create a releasable package
 * (package is a reserved word)
 */
async function packidge() {
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

// yargs turns this into a usable script
yargs(hideBin(process.argv))
  .command(
    "link",
    "Create link to your Foundry install",
    () => {},
    () => link(),
  )
  .command(
    "unlink",
    "Remove link to your Foundry install",
    () => {},
    () => unlink(),
  )
  .command(
    "clean",
    "Remove all generated files",
    () => {},
    () => clean(),
  )
  .command(
    "packidge",
    "Build package file from scratch",
    () => {},
    () => packidge(),
  )
  .command(
    "buildPackTranslations",
    "Generate translation files for packs",
    () => {},
    () => buildPackTranslations(),
  )
  .command(
    "updateManifestFromCITagPush",
    "",
    () => {},
    () => updateManifestFromCITagPush(),
  )
  .completion()
  .demandCommand(1)
  .parse();
