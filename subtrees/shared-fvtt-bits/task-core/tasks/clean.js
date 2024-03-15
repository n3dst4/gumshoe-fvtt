import path from "path";
import { rimraf } from "rimraf";

/**
 * Remove built files from `build` folder
 * while ignoring source files
 */
export async function clean({ rootPath, buildPath, log }) {
  const distPath = path.join(rootPath, buildPath);
  log("Cleaning...");
  await rimraf(distPath);
  log("Done.");
}

clean.description = "Remove built files from `build` folder";
