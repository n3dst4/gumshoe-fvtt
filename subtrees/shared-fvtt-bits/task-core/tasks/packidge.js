import archiver from "archiver";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";

/**
 * create a releasable package
 * (package is a reserved word)
 */
export async function packidge({ manifest, buildPath, log }) {
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
