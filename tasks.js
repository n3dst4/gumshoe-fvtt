#!/usr/bin/env node
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

function silly({ log }) {
  log("silliness");
}

const rootPath = path.dirname(fileURLToPath(import.meta.url));
process.chdir(rootPath);

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
