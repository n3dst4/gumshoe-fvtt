import archiver from "archiver";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";

import { Manifest, TaskArgs } from "../types";

/**
 * create a releasable package
 * (package is a reserved word)
 */
export async function packidge({
  manifest,
  buildPath,
  log,
  packagePath = "package",
}: TaskArgs) {
  return new Promise<void>((resolve, reject) => {
    const id = (manifest as Manifest).id;
    // Ensure there is a directory to hold all the packaged versions
    fs.ensureDirSync(packagePath);
    // Initialize the zip file
    const zipName = process.env["ZIP_FILE_NAME"] ?? `${id}.zip`;
    const zipFile = fs.createWriteStream(path.join(packagePath, zipName));
    const zip = archiver("zip", { zlib: { level: 9 } });
    zipFile.on("close", () => {
      log(chalk.green(zip.pointer() + " total bytes"));
      log(chalk.green(`Zip file ${zipName} has been written`));
      resolve();
    });
    zip.on("error", reject);
    zip.pipe(zipFile);
    // Add the directory with the final code
    zip.directory(buildPath, id);
    zip.finalize().catch(reject);
  });
}

packidge.description = "Create a releasable package";
