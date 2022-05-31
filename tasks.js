#!/usr/bin/env node

import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import archiver from "archiver";
import rimraf from "rimraf";
import { fileURLToPath } from "url";
import webpack from "webpack";
import webpackConfig from "./webpack.config.js";
import less from "less";
import { readFile, writeFile } from "fs/promises";
import chokidar from "chokidar";
import globWithCallback from "glob";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// This file replaces gulp/grunk/jake/whatever and just provides a place to put
// little build-related chunks of code and way to run them from the command
// line.

/// /////////////////////////////////////////////////////////////////////////////
// Config
const srcPath = "src";
const manifestName = "system.json";
const manifestPath = path.join(srcPath, manifestName);
const buildPath = "build";
const staticPaths = [
  manifestName,
  "lang",
  "assets",
  "templates",
  "template.json",
  "packs",
];
const lessGlobPattern = `${srcPath}/**/*.less`;

/// ////////////////////////////////////////////////////////////////////////////
// Utilities

// promisified version of glob
function glob (pattern, options) {
  return new Promise((resolve, reject) => {
    globWithCallback(pattern, options, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

// logging function
const log = console.log.bind(console, chalk.green("[task] "));
const error = console.log.bind(console, chalk.red("[error] "));

// if subject is a semver string beginning with a v, remove the v
const stripInitialv = (subject) =>
  subject.replace(/^v(\d+\.\d+\.\d+.*)/i, (_, ...[match]) => match);

// given a path in the src folder, map it to the equivalent build folder path
function srcToBuild (inPath) {
  const outPath = path.join(buildPath, path.relative(srcPath, inPath));
  return outPath;
}

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
  linkDir = path.join(config.dataPath, "Data", linkRoot, manifest.name);
}

/**
 * Remove built files from `build` folder
 * while ignoring source files
 */
async function clean () {
  const distPath = path.join(__dirname, buildPath);
  log("Cleaning...");
  await new Promise((resolve, reject) => {
    rimraf(distPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
  log("Done.");
}

/**
 * Build TypeScript
 */
async function buildCode () {
  log("Building Typescript...");
  await new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err || stats.hasErrors()) {
        reject(err || stats.toString());
      } else {
        resolve();
      }
    });
  });
  log("Finished building Typescript.");
}

async function buildLess (paths) {
  if (paths === undefined) {
    paths = await glob(lessGlobPattern);
  }
  return await Promise.all(
    paths.map(async (inPath) => {
      const src = await readFile(inPath);
      const result = await less.render(src.toString());
      const outPath = srcToBuild(inPath).replace(/\.less$/i, ".css");
      log("Building LESS from", chalk.cyan(inPath), "to", chalk.cyan(outPath));
      await writeFile(outPath, result.css);
    }),
  );
}

/**
 * Copy static files
 */
async function copyFiles (paths) {
  if (paths === undefined) {
    paths = staticPaths.map((p) => path.join(srcPath, p));
  }
  for (const fromPath of paths) {
    const toPath = srcToBuild(fromPath);
    log("Copying", chalk.cyan(fromPath), "to", chalk.cyan(toPath));
    await fs.copy(fromPath, toPath);
  }
}

/**
 * Watch for changes for each build step
 */
function watch () {
  webpack(webpackConfig).watch(
    {
      aggregateTimeout: 300,
      poll: undefined,
    },
    (err, stats) => {
      log(
        stats.toString({
          colors: true,
        }),
      );
      if (err) {
        error(err);
      }
    },
  );
  chokidar
    .watch("src/**/*.less")
    .on("add", (path) => {
      buildLess([path]);
    })
    .on("change", (path) => {
      buildLess([path]);
    });
  chokidar
    .watch(staticPaths.map((x) => path.join(srcPath, x)))
    .on("add", (path) => copyFiles([path]))
    .on("change", (path) => copyFiles([path]));
}

/**
 * go though the compendium packs, and for each one, emit an untranslated
 * template file. once comitted and pushed, this will be picked up by transifex
 * and update the translation list.
 */
async function buildPackTranslations () {
  log("Building pack translations");
  // load nedb async to avoid slowing unrelated tasks tasks
  const { default: Datastore } = await import("@seald-io/nedb");

  const mapping = {
    category: "data.category",
  };

  const itemPacks = manifest.packs.filter((p) => p.type === "Item");

  for (const pack of itemPacks) {
    log(`Processing ${chalk.green(pack.label)}... `);
    const entries = {};

    const store = new Datastore({
      filename: path.join(srcPath, pack.path),
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
    const outFileName = `${manifest.name}.${path.basename(
      pack.path,
      ".db",
    )}.json`;
    const outFilePath = path.join(
      srcPath,
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
async function unlink () {
  if (!linkDir) {
    throw new Error("linkDir not set");
  }
  log(chalk.yellow(`Removing build link from ${chalk.blueBright(linkDir)}`));
  return fs.remove(linkDir);
}

/**
 * Link build to foundrydata
 */
async function link () {
  if (!linkDir) {
    throw new Error("linkDir not set");
  }
  if (!fs.existsSync(linkDir)) {
    log(`Linking ${buildPath} to ${chalk.blueBright(linkDir)}`);
    return fs.symlink(path.resolve(buildPath), linkDir);
  } else {
    log(chalk.magenta(`${chalk.blueBright(linkDir)} already exists`));
  }
}

/**
 * Update the manifest in CI
 */
async function updateManifestFromCITagPush () {
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
  manifest.download = `${
    process.env.CI_API_V4_URL
  }/projects/${encodeURIComponent(path)}/packages/generic/${
    manifest.name
  }/${tag}/${manifest.name}.zip`;
  log({ tag, path, manifest });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

/**
 * Package build
 */
async function bundlePackage () {
  return new Promise((resolve, reject) => {
    try {
      // Ensure there is a directory to hold all the packaged versions
      fs.ensureDirSync("package");
      // Initialize the zip file
      const zipName = process.env.ZIP_FILE_NAME ?? `${manifest.name}.zip`;
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
      zip.directory(buildPath, manifest.name);
      zip.finalize();
    } catch (err) {
      return reject(err);
    }
  });
}

/**
 * go into production mode
 */
async function setProd () {
  process.env.NODE_ENV = "production";
}

/**
 * cleand and then build
 */
async function build () {
  await clean();
  await Promise.all([buildCode(), buildLess(), copyFiles()]);
}

/**
 * create a releasable package
 * (package is a reserved word)
 */
async function packidge () {
  await setProd();
  await build();
  await bundlePackage();
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
    "buildLess",
    "Build LESS files",
    () => {},
    () => buildLess(),
  )
  .command(
    "buildCode",
    "Build Typescript",
    () => {},
    () => buildCode(),
  )
  .command(
    "clean",
    "Remove all generated files",
    () => {},
    () => clean(),
  )
  .command(
    "build",
    "Build everything into output folder",
    () => {},
    () => build(),
  )
  .command(
    "bundlePackage",
    "Create package .zip",
    () => {},
    () => bundlePackage(),
  )
  .command(
    "packidge",
    "Build package file from scratch",
    () => {},
    () => packidge(),
  )
  .command(
    "watch",
    "Build-on-chnage mode",
    () => {},
    () => watch(),
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
