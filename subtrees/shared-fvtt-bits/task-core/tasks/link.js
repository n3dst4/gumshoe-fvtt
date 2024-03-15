import chalk from "chalk";
import fs from "fs-extra";
import path from "path";

/**
 * Link build to foundrydata
 */
export async function link({ buildPath, linkDir, log }) {
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
