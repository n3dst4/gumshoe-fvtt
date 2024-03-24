import { MigrationFlags } from "../migrations/types";
import { settings } from "../settings/settings";

export function installFlaggedMigrationSplatter() {
  async function splatMigration(type: string, migration: string) {
    const newFlags = {
      ...settings.migrationFlags.get(),
      [type]: {
        ...settings.migrationFlags.get()[type as keyof MigrationFlags],
        [migration]: true,
      },
    };
    await settings.migrationFlags.set(newFlags);
  }
  window.splatMigration = splatMigration;
}

declare global {
  interface Window {
    splatMigration: (type: string, migration: string) => Promise<void>;
  }
}
