import {
  generalAbility,
  investigativeAbility,
  pc,
  npc,
  weapon,
  personalDetail,
  equipment,
  occupationSlotIndex,
} from "../constants";
import {
  assertGame,
  confirmADoodleDo,
  getTranslated,
  isNullOrEmptyString,
} from "../functions";
import {
  RecursivePartial,
  AbilityType,
  InvestigativeAbilityDataSource,
  MwType,
  MwRefreshGroup,
  NoteWithFormat,
  BaseNote,
  NoteFormat,
  MwInjuryStatus,
  InvestigatorActorDataSource,
} from "../types";
import {
  assertPCDataSource,
  assertActiveCharacterDataSource,
  assertPartyDataSource,
  isAbilityDataSource,
  isMwItemDataSource,
  assertMwItemDataSource,
  assertNPCDataSource,
} from "../typeAssertions";
// import { InvestigatorItem } from "./InvestigatorItem";
import { convertNotes } from "../textFunctions";
import { tealTheme } from "../themes/tealTheme";
import { runtimeConfig } from "../runtime";
import { settings } from "../settings";
import { ThemeV1 } from "../themes/types";

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
      message:
        "Refresh all of (actor name)'s abilities which refresh every 24h?",
      confirmText: "Refresh",
      cancelText: "Cancel",
      confirmIconClass: "fa-sync",
      values: { ActorName: this.data.name },
    }).then(this.refresh24h);
  };

  confirmMwRefresh(group: MwRefreshGroup) {
    return () => {
      confirmADoodleDo({
        message:
          "Refresh all of {ActorName}'s abilities which refresh every {Hours} Hours?",
        confirmText: "Refresh",
        cancelText: "Cancel",
        confirmIconClass: "fa-sync",
        values: { ActorName: this.data.name, Hours: group },
      }).then(() => this.mWrefresh(group));
    };
  }

  confirmMw2Refresh = this.confirmMwRefresh(2);
  confirmMw4Refresh = this.confirmMwRefresh(4);
  confirmMw8Refresh = this.confirmMwRefresh(8);

  refresh = () => {
    const updates = Array.from(this.items).flatMap((item) => {
      if (
        (item.data.type === generalAbility ||
          item.data.type === investigativeAbility) &&
        item.data.data.rating !== item.data.data.pool &&
        !item.data.data.excludeFromGeneralRefresh
      ) {
        return [
          {
            _id: item.data._id,
            data: {
              pool: item.data.data.rating,
            },
          },
        ];
      } else {
        return [];
      }
    });
    this.updateEmbeddedDocuments("Item", updates);
  };

  mWrefresh(group: MwRefreshGroup) {
    const updates = Array.from(this.items).flatMap((item) => {
      if (
        item.data.type === generalAbility &&
        // MW refreshes allow you to keep a boon
        item.data.data.rating > item.data.data.pool &&
        item.data.data.mwRefreshGroup === group
      ) {
        return [
          {
            _id: item.data._id,
            data: {
              pool: item.data.data.rating,
            },
          },
        ];
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
        return [
          {
            _id: item.data._id,
            data: {
              pool: item.data.data.rating,
            },
          },
        ];
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

  getAbilityByName(name: string, type?: AbilityType) {
    return this.items.find(
      (item) =>
        (type ? item.data.type === type : isAbilityDataSource(item.data)) &&
        item.name === name,
    );
  }

  getAbilityRatingByName(name: string) {
    return this.getAbilityByName(name)?.getRating() ?? 0;
  }

  getEquipment() {
    return this.items.filter((item) => item.type === equipment);
  }

  getWeapons() {
    return this.items.filter((item) => item.type === weapon);
  }

  getAbilities() {
    return this.items.filter((item) => isAbilityDataSource(item.data));
  }

  getPersonalDetails() {
    return this.items.filter((item) => item.type === personalDetail);
  }

  getMwItems() {
    const allItems = this.items.filter((item) => isMwItemDataSource(item.data));
    const items: { [type in MwType]: Item[] } = {
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

  getTrackerAbilities() {
    return this.getAbilities().filter(
      (item) => isAbilityDataSource(item.data) && item.data.data.showTracker,
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
  };

  setOccupation = (occupation: string) => {
    assertPCDataSource(this.data);
    this.update({ data: { occupation } });
  };

  getSheetTheme(): ThemeV1 {
    const themeName =
      this.getSheetThemeName() || settings.defaultThemeName.get();
    const theme = runtimeConfig.themes[themeName];
    if (theme !== undefined) {
      return theme;
    } else if (
      runtimeConfig.themes[settings.defaultThemeName.get()] !== undefined
    ) {
      return runtimeConfig.themes[settings.defaultThemeName.get()];
    } else {
      return tealTheme;
    }
  }

  getSheetThemeName(): string | null {
    return this.data.type === pc || this.data.type === npc
      ? this.data.data.sheetTheme
      : null;
  }

  setSheetTheme = (sheetTheme: string | null) =>
    this.update({ data: { sheetTheme } });

  getNotes = () => {
    assertNPCDataSource(this.data);
    return this.data.data.notes;
  };

  setNotes = (notes: NoteWithFormat) => {
    assertNPCDataSource(this.data);
    this.update({ data: { notes } });
  };

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

  setLongNotesFormat = async (longNotesFormat: NoteFormat) => {
    assertPCDataSource(this.data);
    const longNotesPromises = (this.data.data.longNotes || []).map<
      Promise<BaseNote>
    >(async (note) => {
      assertPCDataSource(this.data);
      const { newHtml, newSource } = await convertNotes(
        this.data.data.longNotesFormat,
        longNotesFormat,
        note.source,
      );
      return {
        html: newHtml,
        source: newSource,
      };
    });
    const longNotes = await Promise.all(longNotesPromises);
    this.update({ data: { longNotes, longNotesFormat } });
  };

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
  };

  setHitThreshold = (hitThreshold: number) => {
    assertActiveCharacterDataSource(this.data);
    return this.update({ data: { hitThreshold } });
  };

  getInitiativeAbility = () => {
    assertActiveCharacterDataSource(this.data);
    return this.data.data.initiativeAbility;
  };

  setInitiativeAbility = async (initiativeAbility: string) => {
    assertGame(game);
    assertActiveCharacterDataSource(this.data);
    await this.update({ data: { initiativeAbility } });
    const isInCombat = !!this.token?.combatant;
    if (isInCombat) {
      await this.rollInitiative({ rerollInitiative: true });
    }
  };

  setCombatBonus = async (combatBonus: number) => {
    assertNPCDataSource(this.data);
    await this.update({ data: { combatBonus } });
  };

  setDamageBonus = async (damageBonus: number) => {
    assertNPCDataSource(this.data);
    await this.update({ data: { damageBonus } });
  };

  setPassingTurns = async (initiativePassingTurns: number) => {
    assertActiveCharacterDataSource(this.data);
    await this.update({ data: { initiativePassingTurns } });
  };

  // ###########################################################################
  // Moribund World stuff
  getMwInjuryStatus = () => {
    assertActiveCharacterDataSource(this.data);
    return this.data.data.mwInjuryStatus;
  };

  setMwInjuryStatus = async (mwInjuryStatus: MwInjuryStatus) => {
    assertActiveCharacterDataSource(this.data);
    await this.update({ data: { mwInjuryStatus } });
  };

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

  createEquipment = async (categoryId: string) => {
    await this.createEmbeddedDocuments(
      "Item",
      [
        {
          type: equipment,
          name: "New item",
          data: {
            category: categoryId,
          },
        },
      ],
      {
        renderSheet: true,
      },
    );
  };

  createPersonalDetail = async (slotIndex: number) => {
    const detailName = settings.shortNotes.get()[slotIndex] ?? "detail";
    const name = `New ${detailName}`;
    await this.createEmbeddedDocuments(
      "Item",
      [
        {
          type: personalDetail,
          name,
          data: {
            index: slotIndex,
          },
        },
      ],
      {
        renderSheet: true,
      },
    );
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
Hooks.on(
  "updateItem",
  (
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
  },
);

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
      for (const packId of settings.newPCPacks.get()) {
        assertGame(game);
        console.log("PACK", packId);
        const content = await game.packs
          ?.find((p: any) => p.collection === packId)
          ?.getDocuments();
        const datas = content?.map((item) => {
          // clunky cast here because there doesn't seem to be a sane way to
          // check the type of something coming out of a compendium pack.
          // XXX if we cast as InvestigatorItem, we have a circular dependency
          const {
            data: { name, img, data, type },
          } = item as any;
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
      for (const packId of settings.newNPCPacks.get()) {
        assertGame(game);
        console.log("PACK", packId);
        const content = await game.packs
          ?.find((p) => p.documentName === "Item" && p.collection === packId)
          ?.getDocuments();
        // XXX eurgh - same as elsewhere - if we cast as InvestigatorItem, we
        // have a circular dependency
        const datas = (content as any[])?.map(
          ({ data: { name, img, data, type } }) => ({
            name,
            img,
            data,
            type,
          }),
        );
        console.log("datas", datas);
        await (actor as any).createEmbeddedDocuments("Item", datas);
      }
    }
  },
);

Hooks.on(
  "preUpdateActor",
  (
    actor: Actor,
    data: DeepPartial<InvestigatorActorDataSource>,
    options: any,
    userId: string,
  ) => {
    assertGame(game);
    if (game.userId !== userId) return;

    if (data.img && !data.token?.img) {
      data.token = data.token || {};
      data.token.img = data.img;
    }
  },
);

Hooks.on(
  "preCreateItem",
  async (
    item: Item,
    createData: { name: string; type: string; system?: any; img?: string },
    options: any,
    userId: string,
  ) => {
    assertGame(game);
    if (
      !(
        game.userId === userId &&
        item.type === personalDetail &&
        item.isEmbedded
      )
    ) {
      return;
    }
    const itemsAlreadyInSlot = item.actor?.items.filter(
      (i) =>
        i.data.type === personalDetail &&
        i.data.data.index === createData.system.index,
    );
    const existingCount = itemsAlreadyInSlot?.length ?? 0;
    if (existingCount > 0) {
      const tlMessage = getTranslated("Replace existing {Thing} with {Name}?", {
        Thing:
          createData.system.index === occupationSlotIndex
            ? settings.occupationLabel.get()
            : settings.shortNotes.get()[createData.system.index],
        Name: createData.name,
      });
      const replaceText = getTranslated("Replace");
      const addText = getTranslated("Add");
      const promise = new Promise<boolean>((resolve) => {
        const onAdd = () => {
          resolve(true);
        };
        const onReplace = () => {
          const itemIds =
            itemsAlreadyInSlot?.map((item) => item.id ?? "") ?? [];

          itemsAlreadyInSlot?.[0].actor?.deleteEmbeddedDocuments(
            "Item",
            itemIds,
          );
          resolve(true);
        };

        const d = new Dialog({
          title: "Replace or add?",
          content: `<p>${tlMessage}</p>`,
          buttons: {
            replace: {
              icon: '<i class="fas fa-eraser"></i>',
              label: replaceText,
              callback: onReplace,
            },
            add: {
              icon: '<i class="fas fa-plus"></i>',
              label: addText,
              callback: onAdd,
            },
          },
          default: "cancel",
        });
        d.render(true);
        return false;
      });
      await promise;
    }

    // add compendium pack stuff if it's there
    if (!isNullOrEmptyString(createData.system?.compendiumPackId)) {
      const pack = game.packs?.find(
        (p) => p.collection === createData.system?.compendiumPackId,
      );

      if (pack) {
        const shouldAdd = await confirmADoodleDo({
          message: "Add all items from pack {Name}?",
          cancelText: getTranslated("Cancel"),
          confirmText: getTranslated("Add"),
          confirmIconClass: "fas fa-plus",
          values: {
            Name: pack.metadata.label, //
          },
        });

        assertGame(game);

        if (shouldAdd) {
          const content = await pack.getDocuments();
          const datas = content?.map((item) => {
            // clunky cast here because there doesn't seem to be a sane way to
            // check the type of something coming out of a compendium pack.
            // XXX if we cast as InvestigatorItem, we have a circular dependency
            const {
              data: { name, img, data, type },
            } = item as any;
            return {
              name,
              img,
              data,
              type,
            };
          });
          console.log("datas", datas);
          await (item.actor as any).createEmbeddedDocuments("Item", datas);
        }
      }
    }
  },
);
