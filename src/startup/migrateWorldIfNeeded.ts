import { defaultMigratedSystemVersion } from "../constants";
import { assertGame } from "../functions";
import system from "../system.json";
import { migrateWorld } from "../migrations/migrateWorld";
import { settings } from "../settings";

export const migrateWorldIfNeeded = async () => {
  assertGame(game);
  if (!game.user?.isGM) {
    return;
  }
  const currentVersion = settings.systemMigrationVersion.get();
  // newest version that needs a migration (make this the current version when
  // you introduce a new migration)
  const NEEDS_MIGRATION_VERSION = "4.8.0";
  // oldest version which can be migrated reliably
  const COMPATIBLE_MIGRATION_VERSION = "1.0.0";
  const needsMigration = isNewerVersion(
    NEEDS_MIGRATION_VERSION,
    currentVersion,
  );
  if (!needsMigration) return;

  // warn users on old versions
  if (
    currentVersion &&
      currentVersion !== defaultMigratedSystemVersion &&
      isNewerVersion(COMPATIBLE_MIGRATION_VERSION, currentVersion)
  ) {
    const warning = `Your ${system.title} system data is from too old a version and cannot be reliably migrated to the latest version. The process will be attempted, but errors may occur.`;
    (ui as any)/* oh fuck off */.notifications
      .error(warning, { permanent: true });
  }
  // Perform the migration
  migrateWorld();
};
