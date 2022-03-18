import { equipment, generalAbility, investigativeAbility, pc, npc, weapon } from "../constants";
import { assertGame, confirmADoodleDo, getThemes } from "../functions";
import { RecursivePartial, AbilityType, assertPCDataSource, assertActiveCharacterDataSource, assertPartyDataSource, InvestigativeAbilityDataSource, isAbilityDataSource, isMwItemDataSource, MwType, assertMwItemDataSource, MwRefreshGroup, assertNPCDataSource, NoteWithFormat, BaseNote, NoteFormat, MwInjuryStatus, InvestigatorActorDataSource } from "../types";
import { getDefaultThemeName, getNewPCPacks, getNewNPCPacks } from "../settingsHelpers";
import { ThemeV1 } from "../themes/types";
import { InvestigatorItem } from "./InvestigatorItem";
import { convertNotes } from "../textFunctions";

export class InvestigatorActor extends Actor {
  /**
   * Augment the basic actor data with additional dynamic data.
   */
  // prepareData (): void {
  //   super.prepareData();
  // }

  confirmRefresh = () => {
    confirmADoodleDo({
      message: "Refresh all of (actor name)'s abilities?",
      confirmText: "Refresh",
      cancelText: "Cancel",
      confirmIconClass: "fa-sync",
      values: { ActorName: this.data.name },
    }).then(this.refresh);
  };

  confirm24hRefresh = () => {
    confirmADoodleDo({
      message: "Refresh all of (actor name)'s abilities which refresh every 24h?",
      confirmText: "Refresh",
      cancelText: "Cancel",
      confirmIconClass: "fa-sync",
      values: { ActorName: this.data.name },
    }).then(this.refresh24h);
  };

  confirmMwRefresh (group: MwRefreshGroup) {
    return () => {
      confirmADoodleDo({
        message: "Refresh all of {ActorName}'s abilities which refresh every {Hours} Hours?",
        confirmText: "Refresh",
        cancelText: "Cancel",
        confirmIconClass: "fa-sync",
        values: { ActorName: this.data.name, Hours: group },
      }).then(() => this.mWrefresh(group));
    };
  }

  confirmMw2Refresh = this.confirmMwRefresh(2)
  confirmMw4Refresh = this.confirmMwRefresh(4)
  confirmMw8Refresh = this.confirmMwRefresh(8)

  refresh = () => {
    const updates = Array.from(this.items).flatMap((item) => {
      if (
        (item.data.type === generalAbility ||
          item.data.type === investigativeAbility) &&
        item.data.data.rating !== item.data.data.pool &&
        !item.data.data.excludeFromGeneralRefresh
      ) {
        return [{
          _id: item.data._id,
          data: {
            pool: item.data.data.rating,
          },
        }];
      } else {
        return [];
      }
    });
    this.updateEmbeddedDocuments("Item", updates);
  };

  mWrefresh (group: MwRefreshGroup) {
    const updates = Array.from(this.items).flatMap((item) => {
      if (
        (item.data.type === generalAbility) &&
        // MW refreshes allow you to keep a boon
        item.data.data.rating > item.data.data.pool &&
        item.data.data.mwRefreshGroup === group
      ) {
        return [{
          _id: item.data._id,
          data: {
            pool: item.data.data.rating,
          },
        }];
      } else {
        return [];
      }
    });
    this.updateEmbeddedDocuments("Item", updates);
  }

  // if we end up with even more types of refresh it may be worth factoring out
  // the actual refresh code but until then - rule of three
  refresh24h = () => {
    const updates = Array.from(this.items).flatMap((item) => {
      if (
        (item.data.type === generalAbility ||
          item.data.type === investigativeAbility) &&
        item.data.data.rating !== item.data.data.pool &&
        item.data.data.refreshesDaily
      ) {
        return [{
          _id: item.data._id,
          data: {
            pool: item.data.data.rating,
          },
        }];
      } else {
        return [];
      }
    });
    this.updateEmbeddedDocuments("Item", updates);
  };

  confirmNuke = () => {
    confirmADoodleDo({
      message: "NukeAllOfActorNamesAbilitiesAndEquipment",
      confirmText: "Nuke it from orbit",
      cancelText: "Whoops no!",
      confirmIconClass: "fa-radiation",
      values: { ActorName: this.data.name },
    }).then(() => this.nuke());
  };

  nuke = async () => {
    await this.deleteEmbeddedDocuments(
      "Item",
      this.items.map((i) => i.id).filter((i) => i !== null) as string[],
    );
    window.alert("Nuked");
  };

  // ###########################################################################
  // ITEMS

  getAbilityByName (name: string, type?: AbilityType) {
    return this.items.find(
      (item) =>
        (type ? item.data.type === type : isAbilityDataSource(item.data)) && item.name === name,
    );
  }

  getAbilityRatingByName (name: string) {
    return this.getAbilityByName(name)?.getRating() ?? 0;
  }

  getEquipment () {
    return this.items.filter((item) => item.type === equipment);
  }

  getWeapons () {
    return this.items.filter((item) => item.type === weapon);
  }

  getAbilities () {
    return this.items.filter((item) => isAbilityDataSource(item.data));
  }

  getMwItems () {
    const allItems = this.items.filter((item) => isMwItemDataSource(item.data));
    const items: {[type in MwType]: Item[]} = {
      tweak: [],
      spell: [],
      cantrap: [],
      enchantedItem: [],
      meleeWeapon: [],
      missileWeapon: [],
      manse: [],
      retainer: [],
      sandestin: [],
    };
    for (const item of allItems) {
      assertMwItemDataSource(item.data);
      items[item.data.data.mwType].push(item);
    }
    return items;
  }

  getTrackerAbilities () {
    return this.getAbilities().filter((item) =>
      (isAbilityDataSource(item.data) && item.data.data.showTracker),
    );
  }

  // ###########################################################################
  // GETTERS GONNA GET
  // SETTERS GONNA SET
  // basically we have a getter/setter pair for every attribute so they can be
  // used as handy callbacks in the component tree
  // ###########################################################################

  getName = () => this.name;

  setName = (name: string) => {
    this.update({ name });
  };

  getOccupation = () => {
    assertPCDataSource(this.data);
    return this.data.data.occupation;
  }

  setOccupation = (occupation: string) => {
    assertPCDataSource(this.data);
    this.update({ data: { occupation } });
  }

  getSheetTheme (): ThemeV1 {
    const themes = getThemes();
    const themeName = this.getSheetThemeName() || getDefaultThemeName();
    const theme = themes[themeName];
    if (theme !== undefined) {
      return theme;
    } else {
      return themes[getDefaultThemeName()];
    }
  }

  getSheetThemeName (): string | null {
    return (this.data.type === pc || this.data.type === npc) ? this.data.data.sheetTheme : null;
  }

  setSheetTheme = (sheetTheme: string | null) =>
    this.update({ data: { sheetTheme } });

  getNotes = () => {
    assertNPCDataSource(this.data);
    return this.data.data.notes;
  }

  setNotes = (notes: NoteWithFormat) => {
    assertNPCDataSource(this.data);
    this.update({ data: { notes } });
  }

  getLongNote = (i: number) => {
    assertPCDataSource(this.data);
    return this.data.data.longNotes?.[i] ?? "";
  };

  getLongNotes = () => {
    assertPCDataSource(this.data);
    return this.data.data.longNotes ?? [];
  };

  setLongNote = (i: number, note: BaseNote) => {
    assertPCDataSource(this.data);
    const longNotes = [...(this.data.data.longNotes || [])];
    longNotes[i] = note;
    this.update({ data: { longNotes } });
  };

  setLongNotesFormat = (longNotesFormat: NoteFormat) => {
    assertPCDataSource(this.data);
    const longNotes = (this.data.data.longNotes || []).map<BaseNote>((note) => {
      assertPCDataSource(this.data);
      const { newHtml, newSource } = convertNotes(this.data.data.longNotesFormat, longNotesFormat, note.source);
      return {
        html: newHtml,
        source: newSource,
      };
    });
    this.update({ data: { longNotes, longNotesFormat } });
  }

  getShortNote = (i: number) => {
    assertPCDataSource(this.data);
    return this.data.data.shortNotes?.[i] ?? "";
  };

  getShortNotes = () => {
    assertPCDataSource(this.data);
    return this.data.data.shortNotes ?? [];
  };

  setShortNote = (i: number, text: string) => {
    assertPCDataSource(this.data);
    const newNotes = [...(this.data.data.shortNotes || [])];
    newNotes[i] = text;
    this.update({
      data: {
        shortNotes: newNotes,
      },
    });
  };

  setMwHiddenShortNote = (i: number, text: string) => {
    assertPCDataSource(this.data);
    const newNotes = [...(this.data.data.hiddenShortNotes || [])];
    newNotes[i] = text;
    this.update({
      data: {
        hiddenShortNotes: newNotes,
      },
    });
  };

  getHitThreshold = () => {
    assertActiveCharacterDataSource(this.data);
    return this.data.data.hitThreshold;
  }

  setHitThreshold = (hitThreshold: number) => {
    assertActiveCharacterDataSource(this.data);
    return this.update({ data: { hitThreshold } });
  }

  getInitiativeAbility = () => {
    assertActiveCharacterDataSource(this.data);
    return this.data.data.initiativeAbility;
  }

  setInitiativeAbility = async (initiativeAbility: string) => {
    assertGame(game);
    assertActiveCharacterDataSource(this.data);
    await this.update({ data: { initiativeAbility } });
    const isInCombat = !!(this.token?.combatant);
    if (isInCombat) {
      await this.rollInitiative({ rerollInitiative: true });
    }
  }

  // ###########################################################################
  // Moribund World stuff
  getMwInjuryStatus = () => {
    assertActiveCharacterDataSource(this.data);
    return this.data.data.mwInjuryStatus;
  }

  setMwInjuryStatus = async (mwInjuryStatus: MwInjuryStatus) => {
    assertActiveCharacterDataSource(this.data);
    await this.update({ data: { mwInjuryStatus } });
  }

  // ###########################################################################
  // For the party sheet
  getActorIds = () => {
    assertPartyDataSource(this.data);
    return this.data.data.actorIds;
  };

  setActorIds = (actorIds: string[]) => {
    assertPartyDataSource(this.data);
    this.update({ data: { actorIds } });
  };

  getActors = () => {
    return this.getActorIds()
      .map((id) => {
        assertGame(game);
        return game.actors?.get(id);
      })
      .filter((actor) => actor !== undefined) as Actor[];
  };

  addActorIds = (newIds: string[]) => {
    const currentIds = this.getActorIds();
    const effectiveIds = (
      newIds
        .map((id) => {
          assertGame(game);
          return game.actors?.get(id);
        })
        .filter(
          (actor) =>
            actor !== undefined &&
            actor.id !== null &&
            actor.data.type === pc &&
            !currentIds.includes(actor.id),
        ) as Actor[]
    ).map((actor) => actor.id) as string[];
    this.setActorIds([...currentIds, ...effectiveIds]);
  };

  removeActorId = (id: string) => {
    this.setActorIds(this.getActorIds().filter((x) => x !== id));
  };
}

declare global {
  interface DocumentClassConfig {
    Actor: typeof InvestigatorActor;
  }
}

/**
 * Keep "special" general abilities in sync with their corresponding resources
 */
Hooks.on("updateItem", (
  item: Item,
  // this seems like a fib, but I can't see what else to type this as
  diff: RecursivePartial<InvestigativeAbilityDataSource> & { _id: string },
  options: Record<string, unknown>,
  userId: string,
) => {
  assertGame(game);
  if (game.userId !== userId || item.actor === undefined) {
    return;
  }

  // love 2 sink into a pit of imperative code
  if (item.data.type === generalAbility) {
    if (["Sanity", "Stability", "Health", "Magic"].includes(item.data.name)) {
      if (diff.data?.pool !== undefined || diff.data?.rating !== undefined) {
        item.actor?.update({
          data: {
            resources: {
              [item.data.name.toLowerCase()]: {
                value: item.data.data.pool,
                max: item.data.data.rating,
              },
            },
          },
        });
      }
    }
  }
});

Hooks.on(
  "createActor",
  async (
    actor: InvestigatorActor,
    options: Record<string, unknown>,
    userId: string,
  ) => {
    assertGame(game);
    if (game.userId !== userId) return;

    if (actor.items.size > 0) {
      return;
    }

    if (actor.data.type === pc) {
      // this used to be done in parallel with Promise.all but I was seeing some
      // weird behaviour (duplicated or missing abilities, or weird reference
      // errors) so I have switched it to serial to see if that helps
      for (const packId of getNewPCPacks()) {
        assertGame(game);
        console.log("PACK", packId);
        const content = await (game.packs?.find((p: any) => p.collection === packId)?.getDocuments());
        const datas = content?.map((item) => {
          // clunky cast here because there doesn't seem to be a sane way to
          // check the type of something coming out of a compendium pack.
          const { data: { name, img, data, type } } = item as InvestigatorItem;
          return {
            name,
            img,
            data,
            type,
          };
        });
        console.log("datas", datas);
        await (actor as any).createEmbeddedDocuments("Item", datas);
      }
    }

    if (actor.data.type === npc) {
      for (const packId of getNewNPCPacks()) {
        assertGame(game);
        console.log("PACK", packId);
        const content = await (game.packs?.find((p) => p.documentName === "Item" && p.collection === packId)?.getDocuments());
        const datas = (content as InvestigatorItem[])?.map(({ data: { name, img, data, type } }) => ({
          name,
          img,
          data,
          type,
        }));
        console.log("datas", datas);
        await (actor as any).createEmbeddedDocuments("Item", datas);
      }
    }
  },
);

Hooks.on("preUpdateActor", (actor: Actor, diff: DeepPartial<InvestigatorActorDataSource>, options: any, userId: string) => {
  assertGame(game);
  if (game.userId !== userId) return;

  if (diff.img && !diff.token?.img) {
    diff.token = diff.token || {};
    diff.token.img = diff.img;
  }
});
