import { assertGame } from "../functions";
import { migrateWorld } from "../migrations/migrateWorld";
import { settings } from "../settings";
import { flaggedMigrations } from "../migrations/flaggedMigrations";
import { getFlaggedMigrations } from "../migrations/getFlaggedMigrations";
import { getNeedsMigrationBasedOnLegacyVersionSystem } from "../migrations/getNeedsMigrationBasedOnLegacyVersionSystem";

/**
 * The startup task, which determines whether a migration is needed (using
 * either the legacy system or the new system) and then runs it.
 */
export const migrateWorldIfNeeded = async () => {
  assertGame(game);
  if (!game.user?.isGM) {
    return;
  }
  const migrationFlags = settings.migrationFlags.get();
  const [needsMigrationBasedOnFlags, filteredMigrations, newMigrationFlags] =
    getFlaggedMigrations(migrationFlags, flaggedMigrations);

  // Perform the migration
  if (
    getNeedsMigrationBasedOnLegacyVersionSystem() ||
    needsMigrationBasedOnFlags
  ) {
    migrateWorld(filteredMigrations);
    settings.migrationFlags.set(newMigrationFlags);
  }
};
