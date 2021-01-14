const gulp = require("gulp");
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const archiver = require("archiver");
const stringify = require("json-stringify-pretty-compact");
const less = require("gulp-less");
const sass = require("gulp-sass");
const git = require("gulp-git");
const argv = require("yargs").argv;
sass.compiler = require("sass");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");

function getConfig () {
  const configPath = path.resolve(process.cwd(), "foundryconfig.json");
  let config;

  if (fs.existsSync(configPath)) {
    config = fs.readJSONSync(configPath);
    return config;
  }
}

function getManifest () {
  const json = {};

  if (fs.existsSync("src")) {
    json.root = "src";
  } else {
    json.root = "dist";
  }

  const modulePath = path.join(json.root, "module.json");
  const systemPath = path.join(json.root, "system.json");

  if (fs.existsSync(modulePath)) {
    json.file = fs.readJSONSync(modulePath);
    json.name = "module.json";
  } else if (fs.existsSync(systemPath)) {
    json.file = fs.readJSONSync(systemPath);
    json.name = "system.json";
  } else {
    return;
  }

  return json;
}

/********************/
/* BUILD */
/********************/

/**
 * Build TypeScript
 */
function buildTS () {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err || stats.hasErrors()) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
  // return gulp.src("src/**/*.ts").pipe(tsConfig()).pipe(gulp.dest("dist"));
}

/**
 * Build Less
 */
function buildLess () {
  return gulp.src("src/*.less").pipe(less()).pipe(gulp.dest("dist"));
}

/**
 * Build SASS
 */
function buildSASS () {
  return gulp
    .src("src/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("dist"));
}

/**
 * Copy static files
 */
async function copyFiles () {
  const statics = [
    "lang",
    "fonts",
    "assets",
    "templates",
    "module.json",
    "system.json",
    "template.json",
  ];
  try {
    for (const file of statics) {
      if (fs.existsSync(path.join("src", file))) {
        await fs.copy(path.join("src", file), path.join("dist", file));
      }
    }
    return Promise.resolve();
  } catch (err) {
    Promise.reject(err);
  }
}

/**
 * Watch for changes for each build step
 */
function buildWatch () {
  webpack(webpackConfig).watch({
    aggregateTimeout: 300,
    poll: undefined,
  }, (err, stats) => {
    console.log(stats.toString({
      colors: true,
    }));
    if (err) {
      console.err(err);
    }
  });
  gulp.watch("src/**/*.less", { ignoreInitial: false }, buildLess);
  gulp.watch("src/**/*.scss", { ignoreInitial: false }, buildSASS);
  gulp.watch(
    ["src/fonts", "src/lang", "src/templates", "src/*.json"],
    { ignoreInitial: false },
    copyFiles,
  );
}

/********************/
/* CLEAN */
/********************/

/**
 * Remove built files from `dist` folder
 * while ignoring source files
 */
async function clean () {
  const name = path.basename(path.resolve("."));
  const files = [];

  // If the project uses TypeScript
  if (fs.existsSync(path.join("src", `${name}.ts`))) {
    files.push(
      "lang",
      "templates",
      "assets",
      "module",
      `${name}.js`,
      "module.json",
      "system.json",
      "template.json",
    );
  }

  // If the project uses Less or SASS
  if (
    fs.existsSync(path.join("src", `${name}.less`)) ||
    fs.existsSync(path.join("src", `${name}.scss`))
  ) {
    files.push("fonts", `${name}.css`);
  }

  console.log(" ", chalk.yellow("Files to clean:"));
  console.log("   ", chalk.blueBright(files.join("\n    ")));

  // Attempt to remove the files
  try {
    for (const filePath of files) {
      await fs.remove(path.join("dist", filePath));
    }
    return Promise.resolve();
  } catch (err) {
    Promise.reject(err);
  }
}

/********************/
/* LINK */
/********************/

/**
 * Get the path to link to `dist`
 */
function getLinkDir () {
  const name = path.basename(path.resolve("."));
  const config = fs.readJSONSync("foundryconfig.json");
  let destDir;

  // work out if we're linking to systems or modules
  if (
    fs.existsSync(path.resolve(".", "dist", "module.json")) ||
    fs.existsSync(path.resolve(".", "src", "module.json"))
  ) {
    destDir = "modules";
  } else if (
    fs.existsSync(path.resolve(".", "dist", "system.json")) ||
    fs.existsSync(path.resolve(".", "src", "system.json"))
  ) {
    destDir = "systems";
  } else {
    throw Error(
      `Could not find ${chalk.blueBright(
        "module.json",
      )} or ${chalk.blueBright("system.json")}`,
    );
  }

  let linkDir;
  if (config.dataPath) {
    if (!fs.existsSync(path.join(config.dataPath, "Data"))) {
      throw Error("User Data path invalid, no Data directory found");
    }
    linkDir = path.join(config.dataPath, "Data", destDir, name);
  } else {
    throw Error("No User Data path defined in foundryconfig.json");
  }

  return linkDir;
}

/**
 * Remove the link to foundrydata
 */
function unlink () {
  const linkDir = getLinkDir();
  console.log(
    chalk.yellow(`Removing build link from ${chalk.blueBright(linkDir)}`),
  );
  return fs.remove(linkDir);
}

/**
 * Link build to foundrydata
 */
function link () {
  const linkDir = getLinkDir();
  if (argv.clean || argv.c) {
    return unlink();
  } else if (!fs.existsSync(linkDir)) {
    console.log(
      chalk.green(`Linking dist to ${chalk.blueBright(linkDir)}`),
    );
    return fs.symlink(path.resolve("./dist"), linkDir);
  }
}

/*********************/
/* PACKAGE */
/*********************/

/**
 * Package build
 */
async function packageBuild () {
  const manifest = getManifest();

  return new Promise((resolve, reject) => {
    try {
    // Remove the package dir without doing anything else
      if (argv.clean || argv.c) {
        console.log(chalk.yellow("Removing all packaged files"));
        fs.removeSync("package");
        return;
      }

      // Ensure there is a directory to hold all the packaged versions
      fs.ensureDirSync("package");

      // Initialize the zip file
      const zipName = `${manifest.file.name}-v${manifest.file.version}.zip`;
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
      zip.directory("dist/", manifest.file.name);

      zip.finalize();
    } catch (err) {
      return reject(err);
    }
  });
}

/*********************/
/* PACKAGE */
/*********************/

/**
 * Update version and URLs in the manifest JSON
 */
function updateManifest (cb) {
  const packageJson = fs.readJSONSync("package.json");
  const config = getConfig();
  const manifest = getManifest();
  const rawURL = config.rawURL;
  const repoURL = config.repository;
  const manifestRoot = manifest.root;

  if (!config) cb(Error(chalk.red("foundryconfig.json not found")));
  if (!manifest) cb(Error(chalk.red("Manifest JSON not found")));
  if (!rawURL || !repoURL) {
    cb(
      Error(
        chalk.red(
          "Repository URLs not configured in foundryconfig.json",
        ),
      ),
    );
  }

  try {
    const version = argv.update || argv.u;

    /* Update version */

    const versionMatch = /^(\d{1,}).(\d{1,}).(\d{1,})$/;
    const currentVersion = manifest.file.version;
    let targetVersion = "";

    if (!version) {
      cb(Error("Missing version number"));
    }

    if (versionMatch.test(version)) {
      targetVersion = version;
    } else {
      targetVersion = currentVersion.replace(
        versionMatch,
        (substring, major, minor, patch) => {
          console.log(
            substring,
            Number(major) + 1,
            Number(minor) + 1,
            Number(patch) + 1,
          );
          if (version === "major") {
            return `${Number(major) + 1}.0.0`;
          } else if (version === "minor") {
            return `${major}.${Number(minor) + 1}.0`;
          } else if (version === "patch") {
            return `${major}.${minor}.${Number(patch) + 1}`;
          } else {
            return "";
          }
        },
      );
    }

    if (targetVersion === "") {
      return cb(Error(chalk.red("Error: Incorrect version arguments.")));
    }

    if (targetVersion === currentVersion) {
      return cb(
        Error(
          chalk.red(
            "Error: Target version is identical to current version.",
          ),
        ),
      );
    }
    console.log(`Updating version number to '${targetVersion}'`);

    packageJson.version = targetVersion;
    manifest.file.version = targetVersion;

    /* Update URLs */

    const result = `${rawURL}/v${manifest.file.version}/package/${manifest.file.name}-v${manifest.file.version}.zip`;

    manifest.file.url = repoURL;
    manifest.file.manifest = `${rawURL}/master/${manifestRoot}/${manifest.name}`;
    manifest.file.download = result;

    const prettyProjectJson = stringify(manifest.file, {
      maxLength: 35,
      indent: "\t",
    });

    fs.writeJSONSync("package.json", packageJson, { spaces: "\t" });
    fs.writeFileSync(
      path.join(manifest.root, manifest.name),
      prettyProjectJson,
      "utf8",
    );

    return cb();
  } catch (err) {
    cb(err);
  }
}

function gitAdd () {
  return gulp.src("package").pipe(git.add({ args: "--no-all" }));
}

function gitCommit () {
  return gulp.src("./*").pipe(
    git.commit(`v${getManifest().file.version}`, {
      args: "-a",
      disableAppendPaths: true,
    }),
  );
}

function gitTag () {
  const manifest = getManifest();
  return git.tag(
    `v${manifest.file.version}`,
    `Updated to ${manifest.file.version}`,
    (err) => {
      if (err) throw err;
    },
  );
}

const execGit = gulp.series(gitAdd, gitCommit, gitTag);

const execBuild = gulp.parallel(buildTS, buildLess, buildSASS, copyFiles);

exports.build = gulp.series(clean, execBuild);
exports.watch = buildWatch;
exports.clean = clean;
exports.link = link;
exports.unlink = unlink;
exports.package = packageBuild;
exports.update = updateManifest;
exports.publish = gulp.series(
  clean,
  updateManifest,
  execBuild,
  packageBuild,
  execGit,
);
