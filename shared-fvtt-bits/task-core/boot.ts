import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { BootArgs, TaskArgs } from "./types";

// logging function
export const log = console.log.bind(console, chalk.green("[task]"));

export async function boot({
  config: { rootPath, publicPath, manifestName, buildPath },
  commands,
}: BootArgs) {
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

  const finalConfig: TaskArgs = {
    publicPath,
    manifestName,
    manifestPath,
    buildPath,
    linkDir,
    rootPath,
    manifest,
    log,
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
