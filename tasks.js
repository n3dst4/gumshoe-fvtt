#! env node

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

// promisified version of glob
function glob (pattern, options) {
  return new Promise((resolve, reject) => {
    globWithCallback(pattern, options, (err, files) => {
      if (err) { reject(err); } else { resolve(files); }
    });
  });
}

const log = console.log.bind(console, chalk.green("[task] "));

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
const lessGlob = `${srcPath}/**/*.less`;

/// /////////////////////////////////////////////////////////////////////////////
// Startup
const manifest = JSON.parse((await fs.readFile(manifestPath)).toString());
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let config, linkDir;
try {
  config = await fs.readJSON("foundryconfig.json");
} catch (e) {
  console.log(chalk.magenta("foundryconfig.json not found - assuming CI"));
}
if (config?.dataPath) {
  const linkRoot = manifestName === "system.json" ? "systems" : "modules";
  linkDir = path.join(config.dataPath, "Data", linkRoot, manifest.name);
}

function srcToBuild (inPath) {
  const outPath = path.join(buildPath, path.relative(srcPath, inPath));
  return outPath;
}

/**
 * Remove built files from `build` folder
 * while ignoring source files
 */
export function clean () {
  const distPath = path.join(__dirname, buildPath);
  return new Promise((resolve, reject) => {
    rimraf(distPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Build TypeScript
 */
export function buildCode () {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err || stats.hasErrors()) {
        reject(err || stats.toString());
      } else {
        resolve();
      }
    });
  });
}

export async function buildLess (paths) {
  if (paths === undefined) {
    paths = await glob(lessGlob);
  }
  return await Promise.all(paths.map(async (inPath) => {
    const src = await readFile(inPath);
    const result = await less.render(src.toString());
    const outPath = srcToBuild(inPath).replace(/\.less$/i, ".css");
    log("Building LESS from", chalk.cyan(inPath), "to", chalk.cyan(outPath));
    await writeFile(outPath, result.css);
  }));
}

/**
 * Copy static files
 */
export async function copyFiles (paths) {
  if (paths === undefined) {
    paths = staticPaths.map(p => path.join(srcPath, p));
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
export function watch () {
  webpack(webpackConfig).watch({
    aggregateTimeout: 300,
    poll: undefined,
  }, (err, stats) => {
    console.log(stats.toString({
      colors: true,
    }));
    if (err) {
      console.error(err);
    }
  });

  chokidar.watch("src/**/*.less").on("add", (path) => {
    buildLess([path]);
  }).on("change", (path) => {
    buildLess([path]);
  });
  chokidar.watch(staticPaths.map(x => path.join(srcPath, x)))
    .on("add", path => copyFiles([path]))
    .on("change", path => copyFiles([path]));
}

/**
 * Remove the link to foundrydata
 */
export async function unlink () {
  if (!linkDir) {
    throw new Error("linkDir not set");
  }
  console.log(
    chalk.yellow(`Removing build link from ${chalk.blueBright(linkDir)}`),
  );
  return fs.remove(linkDir);
}

/**
 * Link build to foundrydata
 */
export async function link () {
  if (!linkDir) {
    throw new Error("linkDir not set");
  }
  if (!fs.existsSync(linkDir)) {
    console.log(
      chalk.green(`Linking dist to ${chalk.blueBright(linkDir)}`),
    );
    return fs.symlink(path.resolve(buildPath), linkDir);
  } else {
    console.log(
      chalk.magenta(`${chalk.blueBright(linkDir)} already exists`),
    );
  }
}

const stripInitialv = (subject) => (
  subject.replace(
    /^v(\d+\.\d+\.\d+.*)/i,
    (_, ...[match]) => match,
  )
);

/**
 * Update the manifest in CI
 */
export async function updateManifestFromCITagPush () {
  const tag = process.env.CI_COMMIT_TAG;
  const path = process.env.CI_PROJECT_PATH;
  if (!tag) {
    throw new Error("This task should only be run from a CI tag push, but $CI_COMMIT_TAG was empty or undefined");
  }
  if (stripInitialv(tag) !== manifest.version) {
    throw new Error(`Manifest version (${manifest.version}) does not match tag (${tag})`);
  }
  manifest.download = `${process.env.CI_API_V4_URL}/projects/${encodeURIComponent(path)}/packages/generic/${manifest.name}/${tag}/${manifest.name}.zip`;
  console.log({ tag, path, manifest });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

/**
 * Package build
 */
export async function bundlePackage () {
  return new Promise((resolve, reject) => {
    try {
      // Ensure there is a directory to hold all the packaged versions
      fs.ensureDirSync("package");
      // Initialize the zip file
      const zipName = process.env.ZIP_FILE_NAME ?? `${manifest.name}.zip`;
      const zipFile = fs.createWriteStream(path.join("package", zipName));
      const zip = archiver("zip", { zlib: { level: 9 } });
      zipFile.on("close", () => {
        console.log(chalk.green(zip.pointer() + " total bytes"));
        console.log(
          chalk.green(`Zip file ${zipName} has been written`),
        );
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

function setProd () {
  process.env.NODE_ENV = "production";
  return Promise.resolve();
}

async function buildAll () {
  await Promise.all([
    buildCode(), buildLess(), copyFiles(),
  ]);
}

async function build () {
  await clean();
  await buildAll();
}

async function packidge () {
  await setProd();
  await clean();
  await buildAll();
  await bundlePackage();
}

yargs(hideBin(process.argv))
  .command("buildLess", "Build LESS files", () => {}, buildLess)
  .command("buildCode", "Build Typescript", () => {}, buildCode)
  .command("bundlePackage", "Create package .zip", () => {}, bundlePackage)
  .command("packidge", "", () => {}, packidge)
  .command("build", "", () => {}, build)
  .command("link", "", () => {}, link)
  .command("watch", "", () => {}, watch)
  .command("clean", "", () => {}, clean)
  .command("groomTranslations", "", () => {}, groomTranslations)
  .command("extractPackTranslationTemplates", "", () => {}, extractPackTranslationTemplates)
  .demandCommand(1)
  .parse();
