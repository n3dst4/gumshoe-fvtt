import system from "../../public/system.json";
import { migrateActorData } from "./migrateActorData";
import { migrateCompendium } from "./migrateCompendium";
import { migrateItemData } from "./migrateItemData";
import { migrateSceneData } from "./migrateSceneData";
import { assertGame } from "../functions";
import * as constants from "../constants";
import { settings } from "../settings";
import { FlaggedMigrations } from "./types";
import { flaggedMigrations } from "./flaggedMigrations";

const title = system.title;

/**
 * Perform a system migration for the entire World, applying migrations for
 * Actors, Items, and Compendium packs
 * @return {Promise}      A Promise which resolves once the migration is completed
 */
export const migrateWorld = async function (
  flaggedMigrations: FlaggedMigrations,
) {
  assertGame(game);
  (ui as any).notifications.info(
    `Applying ${title} System Migration for version ${game.system.data.version}.
    Please be patient and do not close your game or shut down your server.`,
    { permanent: true },
  );

  // apply flagged world migrations
  for (const worldMigration in flaggedMigrations.world) {
    await flaggedMigrations.world[worldMigration](null, null);
  }

  // Migrate World Actors
  for (const a of game.actors?.contents ?? []) {
    try {
      const updateData = migrateActorData(a.data, flaggedMigrations);
      if (!isObjectEmpty(updateData)) {
        await a.update(updateData, { enforceTypes: false });
      }
    } catch (err: any) {
      err.message = `Failed ${title} system migration for Actor ${a.name}: ${err.message}`;
      console.error(err);
    }
  }

  // Migrate World Items
  for (const i of game.items?.contents ?? []) {
    try {
      const updateData = migrateItemData(i.data, flaggedMigrations);
      if (!isObjectEmpty(updateData)) {
        console.log(`Migrating Item entity ${i.name}`);
        await i.update(updateData, { enforceTypes: false });
      }
    } catch (err: any) {
      err.message = `Failed ${title} system migration for Item ${i.name}: ${err.message}`;
      console.error(err);
    }
  }

  // Migrate Actor Override Tokens
  for (const s of game.scenes?.contents ?? []) {
    try {
      const updateData = migrateSceneData(s.data, flaggedMigrations);
      if (!isObjectEmpty(updateData)) {
        console.log(`Migrating Scene entity ${s.name}`);
        await s.update(updateData, { enforceTypes: false });
      }
    } catch (err: any) {
      err.message = `Failed {title} system migration for Scene ${s.name}: ${err.message}`;
      console.error(err);
    }
  }

  // Migrate World Compendium Packs
  // XXX another any
  for (const p of game.packs as any) {
    if (p.metadata.package !== "world") continue;
    if (!["Actor", "Item", "Scene"].includes(p.metadata.entity)) continue;
    await migrateCompendium(p, flaggedMigrations);
  }

  // Set the migration as complete
  settings.systemMigrationVersion.set(system.version);
  ui.notifications?.info(
    `${system.title} system migration to version ${system.version} completed!`,
    { permanent: true },
  );
};

(window as any).migrateSystemCompendiums = async () => {
  assertGame(game);
  for (const p of game.packs as any) {
    if (p.metadata.package !== constants.systemId) continue;
    if (!["Actor", "Item", "Scene"].includes(p.metadata.entity)) continue;
    await migrateCompendium(p, flaggedMigrations);
  }
};
