#!/usr/bin/env -S sh -c '"`dirname $0`/node_modules/.bin/tsx" "$0" "$@"'

// The above shebang line is a hack to run this under the locally installed
// ts-node, without having to install it globally. See
// https://stackoverflow.com/questions/20095351/shebang-use-interpreter-relative-to-the-script-path

import { boot } from "@lumphammer/shared-fvtt-bits/task-core/boot.js";
import {
  buildPackTranslations,
  clean,
  helloWorld,
  link,
  packidge,
  unlink,
  updateManifestFromCITagPush,
} from "@lumphammer/shared-fvtt-bits/task-core/tasks/index.js";
import path from "path";
import { fileURLToPath } from "url";

const rootPath = path.dirname(fileURLToPath(import.meta.url));
process.chdir(rootPath);

function silly({ log }) {
  log("silliness");
}

boot({
  config: {
    rootPath,
    publicPath: "public",
    manifestName: "system.json",
    buildPath: "build",
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
