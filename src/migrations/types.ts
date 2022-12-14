export interface MigrationFlags {
  actor: Record<string, boolean>;
  item: Record<string, boolean>;
  scene: Record<string, boolean>;
  journal: Record<string, boolean>;
  macro: Record<string, boolean>;
  rollTable: Record<string, boolean>;
  compendium: Record<string, boolean>;
  playlist: Record<string, boolean>;
  world: Record<string, boolean>;
}

export type FlaggedMigrations = {
  [k in keyof MigrationFlags]: Record<
    string,
    (data: any, updateData: any) => any
  >;
};
