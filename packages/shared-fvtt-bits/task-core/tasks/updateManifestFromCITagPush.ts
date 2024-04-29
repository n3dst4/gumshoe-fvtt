import fs from "fs-extra";

import { TaskArgs } from "../types";

// if subject is a semver string beginning with a v, remove the v
const stripInitialv = (subject: string) =>
  subject.replace(/^v(\d+\.\d+\.\d+.*)/i, (_, ...[match]) => match as string);

/**
 * Update the manifest in CI
 */
export function updateManifestFromCITagPush({
  manifest,
  manifestPath,
  log,
}: TaskArgs) {
  const tag = process.env["CI_COMMIT_TAG"];
  const path = process.env["CI_PROJECT_PATH"];
  if (!tag) {
    throw new Error(
      "This task should only be run from a CI tag push, but $CI_COMMIT_TAG was empty or undefined",
    );
  }
  if (stripInitialv(tag) !== manifest.version) {
    throw new Error(
      `Manifest version (${manifest.version}) does not match tag (${tag})`,
    );
  }
  manifest.download = `https://github.com/${path}/releases/download/${tag}/${manifest.id}.zip`;
  log({ tag, path, manifest });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

updateManifestFromCITagPush.description = "Update manifest from CI tag push";
