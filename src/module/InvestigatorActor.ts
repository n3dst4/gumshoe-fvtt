// enabling this rule because ts 5.5.x is having some issues with deep types
// that seem to come out here
/* eslint "@typescript-eslint/explicit-function-return-type": "error" */
import {
  equipment,
  occupationSlotIndex,
  pc,
  personalDetail,
} from "../constants";
import { confirmADoodleDo } from "../functions/confirmADoodleDo";
import { getTranslated } from "../functions/getTranslated";
import { convertNotes } from "../functions/textFunctions";
import { assertGame, isGame } from "../functions/utilities";
import { settings } from "../settings/settings";
import {
  AbilityType,
  BaseNote,
  MwInjuryStatus,
  MwRefreshGroup,
  MwType,
  NoteFormat,
  NoteWithFormat,
} from "../types";
import {
  assertActiveCharacterActor,
  assertMwItem,
  assertNPCActor,
  assertPartyActor,
  assertPCActor,
  assertPersonalDetailItem,
  isAbilityItem,
  isActiveCharacterActor,
  isEquipmentItem,
  isGeneralAbilityItem,
  isMwItem,
  isPCActor,
  isPersonalDetailItem,
  isWeaponItem,
  PersonalDetailItem,
} from "../v10Types";
import { InvestigatorItem } from "./InvestigatorItem";

export class InvestigatorActor extends Actor {
  shouldBrodcastRefreshes(): boolean {
    assertGame(game);
    return !game.user?.isGM || this.type === pc;
  }

  confirmRefresh = async (): Promise<void> => {
    const yes = await confirmADoodleDo({
      message: "Refresh all of (actor name)'s abilities?",
      confirmText: "Refresh",
      cancelText: "Cancel",
      confirmIconClass: "fa-sync",
      values: { ActorName: this.name ?? "" },
    });
    if (yes) {
      await this.refresh();
    }
  };

  confirm24hRefresh = async (): Promise<void> => {
    const yes = await confirmADoodleDo({
      message:
        "Refresh all of (actor name)'s abilities which refresh every 24h?",
      confirmText: "Refresh",
      cancelText: "Cancel",
      confirmIconClass: "fa-sync",
      values: { ActorName: this.name ?? "" },
      resolveFalseOnCancel: true,
    });
    if (yes) {
      await this.refresh24h();
    }
  };

  confirmMwRefresh(group: MwRefreshGroup) {
    return async (): Promise<void> => {
      const yes = await confirmADoodleDo({
        message:
          "Refresh all of {ActorName}'s abilities which refresh every {Hours} Hours?",
        confirmText: "Refresh",
        cancelText: "Cancel",
        confirmIconClass: "fa-sync",
        values: { ActorName: this.name ?? "", Hours: group },
      });
      if (yes) {
        await this.mWrefresh(group);
      }
    };
  }

  confirmMw2Refresh = this.confirmMwRefresh(2);
  confirmMw4Refresh = this.confirmMwRefresh(4);
  confirmMw8Refresh = this.confirmMwRefresh(8);

  refresh = async (): Promise<void> => {
    const updates = Array.from(this.items).flatMap((item) => {
      if (
        isAbilityItem(item) &&
        item.system.rating !== item.system.pool &&
        !item.system.excludeFromGeneralRefresh
      ) {
        return [
          {
            _id: item.id,
            system: {
              pool: item.system.rating,
            },
          },
        ];
      } else {
        return [];
      }
    });
    if (this.shouldBrodcastRefreshes()) {
      await this.broadcastUserMessage("RefreshedAllOfActorNamesAbilities");
    }
    await this.updateEmbeddedDocuments("Item", updates);
  };

  async mWrefresh(group: MwRefreshGroup): Promise<void> {
    const updates = Array.from(this.items).flatMap((item) => {
      if (
        isGeneralAbilityItem(item) &&
        // MW refreshes allow you to keep a boon
        item.system.rating > item.system.pool &&
        item.system.mwRefreshGroup === group
      ) {
        return [
          {
            _id: item.id,
            system: {
              pool: item.system.rating,
            },
          },
        ];
      } else {
        return [];
      }
    });
    if (this.shouldBrodcastRefreshes()) {
      await this.broadcastUserMessage(
        "RefreshedAllOfActorNamesHoursHoursRefreshAbilities",
        {
          Hours: group.toString(),
        },
      );
    }
    await this.updateEmbeddedDocuments("Item", updates);
  }

  // if we end up with even more types of refresh it may be worth factoring out
  // the actual refresh code but until then - rule of three
  refresh24h = async (): Promise<void> => {
    const updates = Array.from(this.items).flatMap((item) => {
      if (
        isAbilityItem(item) &&
        item.system.rating !== item.system.pool &&
        item.system.refreshesDaily
      ) {
        return [
          {
            _id: item.id,
            system: {
              pool: item.system.rating,
            },
          },
        ];
      } else {
        return [];
      }
    });
    if (this.shouldBrodcastRefreshes()) {
      await this.broadcastUserMessage(
        "RefreshedAllOfActorNames24hRefreshAbilities",
      );
    }
    await this.updateEmbeddedDocuments("Item", updates);
  };

  broadcastUserMessage = async (
    text: string,
    extraData: Record<string, string> = {},
  ): Promise<void> => {
    if (isGame(game)) {
      const chatData = {
        user: game.user?.id,
        speaker: ChatMessage.getSpeaker({
          alias: game.user?.name ?? "",
        }),
        content: getTranslated(text, {
          ActorName: this.name ?? "",
          UserName: game.user?.name ?? "",
          ...extraData,
        }),
      };
      await ChatMessage.create(chatData, {});
    }
  };

  confirmNuke = async (): Promise<void> => {
    const yes = await confirmADoodleDo({
      message: "NukeAllOfActorNamesAbilitiesAndEquipment",
      confirmText: "Nuke it from orbit",
      cancelText: "Whoops no!",
      confirmIconClass: "fa-radiation",
      resolveFalseOnCancel: true,
      values: { ActorName: this.name ?? "" },
    });
    if (yes) {
      await this.nuke();
    }
  };

  nuke = async (): Promise<void> => {
    await this.deleteEmbeddedDocuments(
      "Item",
      this.items.map((i) => i.id).filter((i) => i !== null) as string[],
    );
    ui.notifications?.info(`Nuked ${this.name}.`);
  };

  // ###########################################################################
  // ITEMS

  getAbilityByName(
    name: string,
    type?: AbilityType,
  ): InvestigatorItem | undefined {
    return this.items.find(
      (item) =>
        (type ? item.type === type : isAbilityItem(item)) && item.name === name,
    );
  }

  getEquipment(): InvestigatorItem[] {
    return this.items.filter(isEquipmentItem);
  }

  getWeapons(): InvestigatorItem[] {
    return this.items.filter(isWeaponItem);
  }

  getAbilities(): InvestigatorItem[] {
    return this.items.filter(isAbilityItem);
  }

  getPersonalDetails(): PersonalDetailItem[] {
    return this.items.filter(isPersonalDetailItem);
  }

  getMwItems(): { [type in MwType]: Item[] } {
    const allItems = this.items.filter(isMwItem);
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

  getTrackerAbilities(): InvestigatorItem[] {
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

  setName = (name: string): Promise<this | undefined> => {
    return this.update({ name });
  };

  getOccupations = (): PersonalDetailItem[] => {
    assertPCActor(this);
    return this.getPersonalDetailsInSlotIndex(occupationSlotIndex);
  };

  getPersonalDetailsInSlotIndex = (slotIndex: number): PersonalDetailItem[] => {
    assertPCActor(this);
    const personalDetailItems = this.getPersonalDetails().filter((item) => {
      assertPersonalDetailItem(item);
      return item.system.slotIndex === slotIndex;
    });
    return personalDetailItems;
  };

  getSheetThemeName(): string | null {
    return isActiveCharacterActor(this)
      ? this.system.sheetTheme
      : settings.defaultThemeName.get();
  }

  setSheetTheme = async (sheetTheme: string | null): Promise<void> => {
    await this.update({ system: { sheetTheme } });
  };

  setNotes = (notes: NoteWithFormat): Promise<this | undefined> => {
    assertNPCActor(this);
    return this.update({ system: { notes } });
  };

  setGMNotes = (gmNotes: NoteWithFormat): Promise<this | undefined> => {
    assertNPCActor(this);
    return this.update({ system: { gmNotes } });
  };

  getLongNote = (i: number): BaseNote => {
    assertPCActor(this);
    return this.system.longNotes?.[i] ?? "";
  };

  setLongNote = (i: number, note: BaseNote): Promise<this | undefined> => {
    assertPCActor(this);
    const longNotes = [...(this.system.longNotes || [])];
    longNotes[i] = note;
    return this.update({ system: { longNotes } });
  };

  setLongNotesFormat = async (
    longNotesFormat: NoteFormat,
  ): Promise<this | undefined> => {
    assertPCActor(this);
    const longNotesPromises = (this.system.longNotes || []).map<
      Promise<BaseNote>
    >(async (note) => {
      assertPCActor(this);
      const { newHtml, newSource } = await convertNotes(
        this.system.longNotesFormat,
        longNotesFormat,
        note?.source ?? "",
      );
      return {
        html: newHtml,
        source: newSource,
      };
    });
    const longNotes = await Promise.all(longNotesPromises);
    return this.update({ system: { longNotes, longNotesFormat } });
  };

  getShortNote = (i: number): string => {
    assertPCActor(this);
    return this.system.shortNotes?.[i] ?? "";
  };

  setShortNote = (i: number, text: string): Promise<this | undefined> => {
    assertPCActor(this);
    const newNotes = [...(this.system.shortNotes || [])];
    newNotes[i] = text;
    return this.update({
      system: {
        shortNotes: newNotes,
      },
    });
  };

  setMwHiddenShortNote = (
    i: number,
    text: string,
  ): Promise<this | undefined> => {
    assertPCActor(this);
    const newNotes = [...(this.system.hiddenShortNotes || [])];
    newNotes[i] = text;
    return this.update({
      system: {
        hiddenShortNotes: newNotes,
      },
    });
  };

  setHitThreshold = (hitThreshold: number): Promise<this | undefined> => {
    assertActiveCharacterActor(this);
    return this.update({ system: { hitThreshold } });
  };

  setInitiativeAbility = async (initiativeAbility: string): Promise<void> => {
    assertGame(game);
    assertActiveCharacterActor(this);
    await this.update({ system: { initiativeAbility } });
    const isInCombat = !!this.token?.combatant;
    if (isInCombat) {
      await this.rollInitiative({ rerollInitiative: true });
    }
  };

  setCombatBonus = async (combatBonus: number): Promise<void> => {
    assertNPCActor(this);
    await this.update({ system: { combatBonus } });
  };

  setDamageBonus = async (damageBonus: number): Promise<void> => {
    assertNPCActor(this);
    await this.update({ system: { damageBonus } });
  };

  setPassingTurns = async (initiativePassingTurns: number): Promise<void> => {
    assertActiveCharacterActor(this);
    await this.update({ system: { initiativePassingTurns } });
  };

  // ###########################################################################
  // Moribund World stuff
  setMwInjuryStatus = async (mwInjuryStatus: MwInjuryStatus): Promise<void> => {
    assertActiveCharacterActor(this);
    await this.update({ system: { mwInjuryStatus } });
  };

  // ###########################################################################
  // For the party sheet
  getActorIds = (): string[] => {
    assertPartyActor(this);
    return this.system.actorIds;
  };

  setActorIds = (actorIds: string[]): Promise<this | undefined> => {
    assertPartyActor(this);
    return this.update({ system: { actorIds } });
  };

  getActors = (): Actor[] => {
    return this.getActorIds()
      .map((id) => {
        assertGame(game);
        return game.actors?.get(id);
      })
      .filter((actor) => actor !== undefined) as Actor[];
  };

  addActorIds = (newIds: string[]): Promise<this | undefined> => {
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
            isPCActor(actor) &&
            !currentIds.includes(actor.id),
        ) as Actor[]
    ).map((actor) => actor.id) as string[];
    return this.setActorIds([...currentIds, ...effectiveIds]);
  };

  removeActorId = (id: string): Promise<this | undefined> => {
    return this.setActorIds(this.getActorIds().filter((x) => x !== id));
  };

  createEquipment = async (categoryId: string): Promise<void> => {
    await this.createEmbeddedDocuments(
      "Item",
      [
        {
          type: equipment,
          name: "New item",
          system: {
            category: categoryId,
          },
        },
      ],
      {
        renderSheet: true,
      },
    );
  };

  createPersonalDetail = async (
    slotIndex: number,
    renderSheet = true,
  ): Promise<void> => {
    const name =
      slotIndex === occupationSlotIndex
        ? settings.genericOccupation.get()
        : `New ${settings.personalDetails.get()[slotIndex]?.name ?? "detail"}`;
    await this.createEmbeddedDocuments(
      "Item",
      [
        {
          type: personalDetail,
          name,
          system: {
            slotIndex,
          },
        },
      ],
      {
        renderSheet,
      },
    );
  };
}

declare global {
  interface DocumentClassConfig {
    Actor: typeof InvestigatorActor;
  }
}
