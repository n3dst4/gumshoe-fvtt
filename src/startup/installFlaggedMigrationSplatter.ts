import { MigrationFlags } from "../migrations/types";
import { settings } from "../settings";

export function installFlaggedMigrationSplatter() {
  function splatMigration(type: string, migration: string) {
    const newFlags = {
      ...settings.migrationFlags.get(),
      [type]: {
        ...settings.migrationFlags.get()[type as keyof MigrationFlags],
        [migration]: true,
      },
    };
    settings.migrationFlags.set(newFlags);
  }
  window.splatMigration = splatMigration;
}

declare global {
  interface Window {
    splatMigration: (type: string, migration: string) => void;
  }
}
