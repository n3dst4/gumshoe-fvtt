#!/usr/bin/env -S sh -c '"`dirname $0`/node_modules/.bin/tsx" "$0" "$@"'

// The above shebang line is a hack to run this under the locally installed
// tsx, without having to install it globally. See
// https://stackoverflow.com/questions/20095351/shebang-use-interpreter-relative-to-the-script-path
//
// tsx is a wrapper around node that allows you to run typescript.
// https://github.com/privatenumber/tsx

import { boot } from "@lumphammer/shared-fvtt-bits/task-core/boot";
import {
  buildPackTranslations,
  clean,
  helloWorld,
  link,
  packidge,
  unlink,
  updateManifestFromCITagPush,
} from "@lumphammer/shared-fvtt-bits/task-core/tasks";
import { TaskArgs } from "@lumphammer/shared-fvtt-bits/task-core/types";
import fs from "fs";
import { globSync } from "glob";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "yaml";

const rootPath = path.dirname(fileURLToPath(import.meta.url));
process.chdir(rootPath);

function silly({ log }: TaskArgs) {
  log("silliness");
}

function validatePeerDependencies() {
  const workspaceFilename = path.join(rootPath, "pnpm-workspace.yaml");
  const workspaceYaml = fs.readFileSync(workspaceFilename, "utf8");
  const workspaceData = yaml.parse(workspaceYaml);
  const packageGlobs = workspaceData.packages;
  const includePackageGlobs = packageGlobs.filter(
    (packageGlob: string) => !packageGlob.startsWith("!"),
  );
  // const excludePackageGlobs = packageGlobs.filter((packageGlob) =>
  //   packageGlob.startsWith("!"),
  // );
  const includePackageDirectories = includePackageGlobs.flatMap(
    (packageGlob) => {
      const qualifiedGlob = path.join(rootPath, packageGlob);
      const folders = globSync(qualifiedGlob);
    },
  );

  const workspacePackages;
}

void boot({
  config: {
    rootPath,
    publicPath: "public",
    manifestName: "system.json",
    buildPath: "build",
    packagePath: "build_package",
  },

  commands: [
    link,
    unlink,
    clean,
    packidge,
    buildPackTranslations,
    updateManifestFromCITagPush,
    silly,
    helloWorld,
  ],
});
