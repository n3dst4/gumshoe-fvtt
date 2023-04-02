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
import { assertGame, confirmADoodleDo } from "../functions";
import {
  AbilityType,
  MwType,
  MwRefreshGroup,
  NoteWithFormat,
  BaseNote,
  NoteFormat,
  MwInjuryStatus,
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
import { convertNotes } from "../textFunctions";
import { tealTheme } from "../themes/tealTheme";
import { runtimeConfig } from "../runtime";
import { settings } from "../settings";
import { ThemeV1 } from "../themes/types";

export class InvestigatorActor extends Actor {
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
        item.system.rating !== item.system.pool &&
        !item.system.excludeFromGeneralRefresh
      ) {
        return [
          {
            _id: item.data._id,
            data: {
              pool: item.system.rating,
            },
          },
        ];
      } else {
        return [];
      }
    });
    return this.updateEmbeddedDocuments("Item", updates);
  };

  mWrefresh(group: MwRefreshGroup) {
    const updates = Array.from(this.items).flatMap((item) => {
      if (
        item.data.type === generalAbility &&
        // MW refreshes allow you to keep a boon
        item.system.rating > item.system.pool &&
        item.system.mwRefreshGroup === group
      ) {
        return [
          {
            _id: item.data._id,
            data: {
              pool: item.system.rating,
            },
          },
        ];
      } else {
        return [];
      }
    });
    return this.updateEmbeddedDocuments("Item", updates);
  }

  // if we end up with even more types of refresh it may be worth factoring out
  // the actual refresh code but until then - rule of three
  refresh24h = () => {
    const updates = Array.from(this.items).flatMap((item) => {
      if (
        (item.data.type === generalAbility ||
          item.data.type === investigativeAbility) &&
        item.system.rating !== item.system.pool &&
        item.system.refreshesDaily
      ) {
        return [
          {
            _id: item.data._id,
            data: {
              pool: item.system.rating,
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
    ui.notifications?.info(`Nuked ${this.name}.`);
  };

  // ###########################################################################
  // ITEMS

  getAbilityByName(name: string, type?: AbilityType) {
    return this.items.find(
      (item) =>
        (type ? item.data.type === type : isAbilityItem(item)) &&
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
    return this.items.filter((item) => isAbilityItem(item));
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
      assertMwItem(item);
      items[item.system.mwType].push(item);
    }
    return items;
  }

  getTrackerAbilities() {
    return this.getAbilities().filter(
      (item) => isAbilityItem(item) && item.system.showTracker,
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
    return this.update({ name });
  };

  getOccupation = () => {
    assertPCActor(this);
    return this.system.occupation;
  };

  setOccupation = (occupation: string) => {
    assertPCActor(this);
    return this.update({ data: { occupation } });
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
      ? this.system.sheetTheme
      : null;
  }

  setSheetTheme = (sheetTheme: string | null) =>
    this.update({ data: { sheetTheme } });

  getNotes = () => {
    assertNPCItem(this);
    return this.system.notes;
  };

  setNotes = (notes: NoteWithFormat) => {
    assertNPCItem(this);
    return this.update({ data: { notes } });
  };

  getLongNote = (i: number) => {
    assertPCActor(this);
    return this.system.longNotes?.[i] ?? "";
  };

  getLongNotes = () => {
    assertPCActor(this);
    return this.system.longNotes ?? [];
  };

  setLongNote = (i: number, note: BaseNote) => {
    assertPCActor(this);
    const longNotes = [...(this.system.longNotes || [])];
    longNotes[i] = note;
    return this.update({ data: { longNotes } });
  };

  setLongNotesFormat = async (longNotesFormat: NoteFormat) => {
    assertPCActor(this);
    const longNotesPromises = (this.system.longNotes || []).map<
      Promise<BaseNote>
    >(async (note) => {
      assertPCActor(this);
      const { newHtml, newSource } = await convertNotes(
        this.system.longNotesFormat,
        longNotesFormat,
        note.source,
      );
      return {
        html: newHtml,
        source: newSource,
      };
    });
    const longNotes = await Promise.all(longNotesPromises);
    return this.update({ data: { longNotes, longNotesFormat } });
  };

  getShortNote = (i: number) => {
    assertPCActor(this);
    return this.system.shortNotes?.[i] ?? "";
  };

  getShortNotes = () => {
    assertPCActor(this);
    return this.system.shortNotes ?? [];
  };

  setShortNote = (i: number, text: string) => {
    assertPCActor(this);
    const newNotes = [...(this.system.shortNotes || [])];
    newNotes[i] = text;
    return this.update({
      data: {
        shortNotes: newNotes,
      },
    });
  };

  setMwHiddenShortNote = (i: number, text: string) => {
    assertPCActor(this);
    const newNotes = [...(this.system.hiddenShortNotes || [])];
    newNotes[i] = text;
    return this.update({
      data: {
        hiddenShortNotes: newNotes,
      },
    });
  };

  getHitThreshold = () => {
    assertActiveCharacterItem(this);
    return this.system.hitThreshold;
  };

  setHitThreshold = (hitThreshold: number) => {
    assertActiveCharacterItem(this);
    return this.update({ data: { hitThreshold } });
  };

  getInitiativeAbility = () => {
    assertActiveCharacterItem(this);
    return this.system.initiativeAbility;
  };

  setInitiativeAbility = async (initiativeAbility: string) => {
    assertGame(game);
    assertActiveCharacterItem(this);
    await this.update({ data: { initiativeAbility } });
    const isInCombat = !!this.token?.combatant;
    if (isInCombat) {
      await this.rollInitiative({ rerollInitiative: true });
    }
  };

  setCombatBonus = async (combatBonus: number) => {
    assertNPCItem(this);
    await this.update({ data: { combatBonus } });
  };

  setDamageBonus = async (damageBonus: number) => {
    assertNPCItem(this);
    await this.update({ data: { damageBonus } });
  };

  setPassingTurns = async (initiativePassingTurns: number) => {
    assertActiveCharacterItem(this);
    await this.update({ data: { initiativePassingTurns } });
  };

  // ###########################################################################
  // Moribund World stuff
  getMwInjuryStatus = () => {
    assertActiveCharacterItem(this);
    return this.system.mwInjuryStatus;
  };

  setMwInjuryStatus = async (mwInjuryStatus: MwInjuryStatus) => {
    assertActiveCharacterItem(this);
    await this.update({ data: { mwInjuryStatus } });
  };

  // ###########################################################################
  // For the party sheet
  getActorIds = () => {
    assertPartyItem(this);
    return this.system.actorIds;
  };

  setActorIds = (actorIds: string[]) => {
    assertPartyItem(this);
    return this.update({ data: { actorIds } });
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
    return this.setActorIds([...currentIds, ...effectiveIds]);
  };

  removeActorId = (id: string) => {
    return this.setActorIds(this.getActorIds().filter((x) => x !== id));
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
    const detailName =
      slotIndex === occupationSlotIndex
        ? settings.occupationLabel.get()
        : settings.shortNotes.get()[slotIndex] ?? "detail";
    const name = `New ${detailName}`;
    await this.createEmbeddedDocuments(
      "Item",
      [
        {
          type: personalDetail,
          name,
          data: {
            slotIndex,
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
