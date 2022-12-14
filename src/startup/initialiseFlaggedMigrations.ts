import { assertGame, mapValues } from "../functions";
import { flaggedMigrations } from "../migrations/flaggedMigrations";
import { MigrationFlags } from "../migrations/types";
import { settings } from "../settings";

export function initialiseFlaggedMigrations () {
  assertGame(game);

  // here's where we work out if this world has ever been loaded by a GM before
  const isGM = game.user?.isGM;

  const hasActors = (game.actors?.contents.length ?? 0) > 0;
  const hasItems = (game.items?.contents.length ?? 0) > 0;
  const hasScenes = (game.scenes?.contents.length ?? 0) > 0;
  const hasJournals = (game.journal?.contents.length ?? 0) > 0;
  const hasMacros = (game.macros?.contents.length ?? 0) > 0;
  const hasRollTables = (game.tables?.contents.length ?? 0) > 0;
  const hasPlaylists = (game.playlists?.contents.length ?? 0) > 0;

  // check if the world is in California or Australia
  const isNewWorld = !hasActors && !hasItems && !hasScenes && !hasJournals && !hasMacros && !hasRollTables && !hasPlaylists;

  if (isGM && isNewWorld) {
    const flags = mapValues((v, k) => {
      const inner = mapValues((v2, k2) => { return true; }, v);
      return inner;
    }, flaggedMigrations);

    settings.migrationFlags.set(flags as unknown as MigrationFlags);
  }
}
