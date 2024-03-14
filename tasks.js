#!/usr/bin/env node
import path from "path";
import { fileURLToPath } from "url";

import {
  boot,
  buildPackTranslations,
  clean,
  link,
  packidge,
  unlink,
  updateManifestFromCITagPush,
} from "@lumphammer/shared-fvtt-bits/task-core.js";

// This file replaces gulp/grunt/jake/whatever and just provides a place to put
// little build-related chunks of code and way to run them from the command
// line.

function silly({ log }) {
  log("silliness");
}

boot({
  config: {
    rootPath: path.dirname(fileURLToPath(import.meta.url)),
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
  ],
});
