import { getFlaggedMigrations } from "./getFlaggedMigrations";
import { FlaggedMigrations, MigrationFlags } from "./types";

const emptyFlaggedMigrations: FlaggedMigrations = {
  item: {},
  actor: {},
  world: {},
  compendium: {},
  journal: {},
  macro: {},
  scene: {},
  rollTable: {},
  playlist: {},
};

const emptyMigrationFlags: MigrationFlags = {
  item: {},
  actor: {},
  world: {},
  compendium: {},
  journal: {},
  macro: {},
  scene: {},
  rollTable: {},
  playlist: {},
};

describe("getFlaggedMigrations", () => {
  test("empty", () => {
    expect(3).toEqual(3);
  });
  test.each<[MigrationFlags, FlaggedMigrations, [boolean, FlaggedMigrations]]>([
    [emptyMigrationFlags, emptyFlaggedMigrations, [false, emptyFlaggedMigrations]],
  ])("getFlaggedMigrations(%s)", (migrationFlags, flaggedMigrations, expected) => {
    const result = getFlaggedMigrations(migrationFlags, flaggedMigrations);
    expect(result).toEqual(
      expected,
    );
  });
});
