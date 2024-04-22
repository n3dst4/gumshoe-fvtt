import system from "../../public/system.json";
import { defaultMigratedSystemVersion } from "../constants";
import { settings } from "../settings/settings";

/**
 * This is the legacy migration system, based on the one in 5e when this project
 * was started. It uses version comparison to determine if a migration is
 * needed. This means that all migrations must be idempotent because they will
 * all get re-run every time any migration is needed.
 */
export function getNeedsMigrationBasedOnLegacyVersionSystem() {
  const currentVersion = settings.systemMigrationVersion.get();
  // newest version that needs a migration (make this the current version when
  // you introduce a new migration)
  const NEEDS_MIGRATION_VERSION = "4.11.0";
  // oldest version which can be migrated reliably
  const COMPATIBLE_MIGRATION_VERSION = "3.0.0";
  const needsMigrationBasedOnLegacyVersionSystem = foundry.utils.isNewerVersion(
    NEEDS_MIGRATION_VERSION,
    currentVersion,
  );
  // if (!needsMigrationBasedOnLegacyVersionSystem) return;

  if (needsMigrationBasedOnLegacyVersionSystem) {
    // warn users on old versions
    if (
      currentVersion &&
      currentVersion !== defaultMigratedSystemVersion &&
      foundry.utils.isNewerVersion(COMPATIBLE_MIGRATION_VERSION, currentVersion)
    ) {
      const notificationText = `Your ${system.title} system data is from too old a version and cannot be reliably migrated to the latest version. The process will be attempted, but errors may occur.`;
      (ui as any).notifications.error(notificationText, { permanent: true });
    }
  }
  return needsMigrationBasedOnLegacyVersionSystem;
}
