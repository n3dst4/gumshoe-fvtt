export type MigrationTypes =
  | "actor"
  | "compendium"
  | "item"
  | "journal"
  | "macro"
  | "playlist"
  | "rollTable"
  | "scene"
  | "world";

export type MigrationFlagsForType = { [migrationName: string]: boolean }

export type MigrationFlags = {
  [migrationType in MigrationTypes]: MigrationFlagsForType;
};

export type MigrationFunction = (data: any, updateData: any) => any;

export type MigrationFunctionsForType = {
  [migrationName: string]: MigrationFunction,
};

export type FlaggedMigrations = {
  [migrationType in MigrationTypes]: MigrationFunctionsForType;
};
