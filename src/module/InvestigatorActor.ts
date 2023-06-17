import { personalDetail, equipment, occupationSlotIndex } from "../constants";
import {
  assertGame,
  confirmADoodleDo,
  getTranslated,
  isGame,
} from "../functions";
import {
  AbilityType,
  MwType,
  MwRefreshGroup,
  NoteWithFormat,
  BaseNote,
  NoteFormat,
  MwInjuryStatus,
} from "../types";
import { convertNotes } from "../textFunctions";
import { settings } from "../settings";
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
} from "../v10Types";

export class InvestigatorActor extends Actor {
  confirmRefresh = () => {
    confirmADoodleDo({
      message: "Refresh all of (actor name)'s abilities?",
      confirmText: "Refresh",
      cancelText: "Cancel",
      confirmIconClass: "fa-sync",
      values: { ActorName: this.name ?? "" },
    }).then(this.refresh);
  };

  confirm24hRefresh = () => {
    confirmADoodleDo({
      message:
        "Refresh all of (actor name)'s abilities which refresh every 24h?",
      confirmText: "Refresh",
      cancelText: "Cancel",
      confirmIconClass: "fa-sync",
      values: { ActorName: this.name ?? "" },
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
        values: { ActorName: this.name ?? "", Hours: group },
      }).then(() => this.mWrefresh(group));
    };
  }

  confirmMw2Refresh = this.confirmMwRefresh(2);
  confirmMw4Refresh = this.confirmMwRefresh(4);
  confirmMw8Refresh = this.confirmMwRefresh(8);

  refresh = () => {
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
    this.broadcastUserMessage("RefreshedAllOfActorNamesAbilities");
    return this.updateEmbeddedDocuments("Item", updates);
  };

  mWrefresh(group: MwRefreshGroup) {
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
    this.broadcastUserMessage(
      "RefreshedAllOfActorNamesHoursHoursRefreshAbilities",
      {
        Hours: group.toString(),
      },
    );
    return this.updateEmbeddedDocuments("Item", updates);
  }

  // if we end up with even more types of refresh it may be worth factoring out
  // the actual refresh code but until then - rule of three
  refresh24h = () => {
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
    this.broadcastUserMessage("RefreshedAllOfActorNames24hRefreshAbilities");
    this.updateEmbeddedDocuments("Item", updates);
  };

  broadcastUserMessage = (
    text: string,
    extraData: Record<string, string> = {},
  ) => {
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
      ChatMessage.create(chatData, {});
    }
  };

  confirmNuke = () => {
    confirmADoodleDo({
      message: "NukeAllOfActorNamesAbilitiesAndEquipment",
      confirmText: "Nuke it from orbit",
      cancelText: "Whoops no!",
      confirmIconClass: "fa-radiation",
      values: { ActorName: this.name ?? "" },
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
        (type ? item.type === type : isAbilityItem(item)) && item.name === name,
    );
  }

  getAbilityRatingByName(name: string) {
    return this.getAbilityByName(name)?.getRating() ?? 0;
  }

  getEquipment() {
    return this.items.filter(isEquipmentItem);
  }

  getWeapons() {
    return this.items.filter(isWeaponItem);
  }

  getAbilities() {
    return this.items.filter(isAbilityItem);
  }

  getPersonalDetails() {
    return this.items.filter(isPersonalDetailItem);
  }

  getMwItems() {
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

  getOccupations = () => {
    assertPCActor(this);
    return this.getPersonalDetailsInSlotIndex(occupationSlotIndex);
  };

  getPersonalDetailsInSlotIndex = (slotIndex: number) => {
    assertPCActor(this);
    const personalDetailItems = this.getPersonalDetails().filter((item) => {
      assertPersonalDetailItem(item);
      return item.system.slotIndex === slotIndex;
    });
    return personalDetailItems;
  };

  getSheetThemeName(): string {
    return (
      (isActiveCharacterActor(this)
        ? this.system.sheetTheme
        : settings.defaultThemeName.get()) ?? "tealTheme"
    );
  }

  setSheetTheme = (sheetTheme: string | null) =>
    this.update({ system: { sheetTheme } });

  getNotes = () => {
    assertNPCActor(this);
    return this.system.notes;
  };

  setNotes = (notes: NoteWithFormat) => {
    assertNPCActor(this);
    return this.update({ system: { notes } });
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
    return this.update({ system: { longNotes } });
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
    return this.update({ system: { longNotes, longNotesFormat } });
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
      system: {
        shortNotes: newNotes,
      },
    });
  };

  setMwHiddenShortNote = (i: number, text: string) => {
    assertPCActor(this);
    const newNotes = [...(this.system.hiddenShortNotes || [])];
    newNotes[i] = text;
    return this.update({
      system: {
        hiddenShortNotes: newNotes,
      },
    });
  };

  getHitThreshold = () => {
    assertActiveCharacterActor(this);
    return this.system.hitThreshold;
  };

  setHitThreshold = (hitThreshold: number) => {
    assertActiveCharacterActor(this);
    return this.update({ system: { hitThreshold } });
  };

  getInitiativeAbility = () => {
    assertActiveCharacterActor(this);
    return this.system.initiativeAbility;
  };

  setInitiativeAbility = async (initiativeAbility: string) => {
    assertGame(game);
    assertActiveCharacterActor(this);
    await this.update({ system: { initiativeAbility } });
    const isInCombat = !!this.token?.combatant;
    if (isInCombat) {
      await this.rollInitiative({ rerollInitiative: true });
    }
  };

  setCombatBonus = async (combatBonus: number) => {
    assertNPCActor(this);
    await this.update({ system: { combatBonus } });
  };

  setDamageBonus = async (damageBonus: number) => {
    assertNPCActor(this);
    await this.update({ system: { damageBonus } });
  };

  setPassingTurns = async (initiativePassingTurns: number) => {
    assertActiveCharacterActor(this);
    await this.update({ system: { initiativePassingTurns } });
  };

  // ###########################################################################
  // Moribund World stuff
  getMwInjuryStatus = () => {
    assertActiveCharacterActor(this);
    return this.system.mwInjuryStatus;
  };

  setMwInjuryStatus = async (mwInjuryStatus: MwInjuryStatus) => {
    assertActiveCharacterActor(this);
    await this.update({ system: { mwInjuryStatus } });
  };

  // ###########################################################################
  // For the party sheet
  getActorIds = () => {
    assertPartyActor(this);
    return this.system.actorIds;
  };

  setActorIds = (actorIds: string[]) => {
    assertPartyActor(this);
    return this.update({ system: { actorIds } });
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
            isPCActor(actor) &&
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

  createPersonalDetail = async (slotIndex: number) => {
    const detailName =
      slotIndex === occupationSlotIndex
        ? settings.occupationLabel.get()
        : settings.personalDetails.get()[slotIndex]?.name ?? "detail";
    const name = `New ${detailName}`;
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
