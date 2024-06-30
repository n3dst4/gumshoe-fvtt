import { nanoid } from "nanoid";

import * as constants from "../constants";
import { assertGame, fixLength } from "../functions/utilities";
import { settings } from "../settings/settings";
import {
  EquipmentSystemData,
  MWDifficulty,
  MwRefreshGroup,
  MwType,
  NoteWithFormat,
  RangeTuple,
  SituationalModifier,
  SpecialitiesMode,
  Unlock,
} from "../types";
import {
  assertAbilityItem,
  assertAnyItem,
  assertCardItem,
  assertEquipmentItem,
  assertGeneralAbilityItem,
  assertMwItem,
  assertPersonalDetailItem,
  assertWeaponItem,
  isEquipmentItem,
  isEquipmentOrAbilityItem,
} from "../v10Types";
import { InvestigatorActor } from "./InvestigatorActor";

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class InvestigatorItem extends Item {
  activeSituationalModifiers: string[] = [];

  /**
   * classic gumshoe test: spend a number of points from the pool, and add that
   * to a d6
   */
  async testAbility(spend: number) {
    assertGame(game);
    assertAbilityItem(this);
    if (this.actor === null) {
      return;
    }
    const isBoosted = settings.useBoost.get() && this.system.boost;
    const boost = isBoosted ? 1 : 0;
    const situationalModifiers = this.activeSituationalModifiers.map((id) => {
      assertAbilityItem(this);
      const situationalModifier = this.system.situationalModifiers.find(
        (situationalModifier) => situationalModifier?.id === id,
      );
      return situationalModifier;
    });

    let rollExpression = "1d6 + @spend";
    const rollValues: Record<string, number> = { spend };
    if (isBoosted) {
      rollExpression += " + @boost";
      rollValues["boost"] = boost;
    }
    for (const situationalModifier of situationalModifiers) {
      if (situationalModifier === undefined) {
        continue;
      }
      rollExpression += ` + @${situationalModifier.id}`;
      rollValues[situationalModifier.id] = situationalModifier.modifier;
    }

    const roll = new Roll(rollExpression, rollValues);
    await roll.evaluate({ async: true });
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({
        actor: this.actor,
      }),
      content: `
        <div
          class="${constants.abilityChatMessageClassName}"
          ${constants.htmlDataItemId}="${this.id}"
          ${constants.htmlDataActorId}="${this.parent?.id ?? ""}"
          ${constants.htmlDataMode}="${constants.htmlDataModeTest}"
          ${constants.htmlDataName}="${this.name}"
          ${constants.htmlDataImageUrl}="${this.img}"
          ${constants.htmlDataTokenId}="${this.parent?.token?.id ?? ""}"
        />
      `,
    });
    const pool = this.system.pool - (Number(spend) || 0);
    await this.update({ system: { pool } });
  }

  /**
   * gumshoe spend - no dice, just spend a number of points in exchange for some
   * goodies
   */
  async spendAbility(spend: number) {
    assertAbilityItem(this);
    if (this.actor === null) {
      return;
    }
    const roll = new Roll("@spend", { spend });
    await roll.evaluate({ async: true });
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({
        actor: this.actor,
      }),
      content: `
        <div
          class="${constants.abilityChatMessageClassName}"
          ${constants.htmlDataItemId}="${this.id}"
          ${constants.htmlDataActorId}="${this.parent?.id ?? ""}"
          ${constants.htmlDataMode}="${constants.htmlDataModeSpend}"
          ${constants.htmlDataName}="${this.name}"
          ${constants.htmlDataImageUrl}="${this.img}"
          ${constants.htmlDataTokenId}="${this.parent?.token?.id ?? ""}"
        />
      `,
    });
    const boost = settings.useBoost.get() && this.system.boost ? 1 : 0;
    const pool = this.system.pool - (Number(spend) || 0) + boost;
    await this.update({ system: { pool } });
  }

  /**
   * DERPG/"Moribund World" style roll - d6 +/- a difficulty modifier, with an
   * additional boon or levy on the pool. can be re-rolled for one extra point.
   */
  async mwTestAbility(
    difficulty: MWDifficulty,
    boonLevy: number,
    reRoll: number | null = null,
  ) {
    assertGame(game);
    assertAbilityItem(this);
    if (this.actor === null) {
      return;
    }
    const diffMod = difficulty === "easy" ? 0 : difficulty;
    const operator = diffMod < 0 ? "-" : "+";
    const roll =
      diffMod === 0
        ? new Roll("1d6")
        : new Roll(`1d6 ${operator} @diffMod`, { diffMod: Math.abs(diffMod) });
    await roll.evaluate({ async: true });
    const cost = (reRoll === 1 ? 4 : reRoll === null ? 0 : 1) - boonLevy;
    if (cost > this.system.pool) {
      ui.notifications?.error(
        `Attempted to ${reRoll ? `re-roll a ${reRoll} with` : "roll"} ${
          this.name
        } with a levy of ${boonLevy} but pool is currently at ${
          this.system.pool
        }`,
      );
      return;
    }
    const newPool = Math.max(0, this.system.pool - cost);
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({
        actor: this.actor,
      }),
      content: `
        <div
          class="${constants.abilityChatMessageClassName}"
          ${constants.htmlDataItemId}="${this.id}"
          ${constants.htmlDataActorId}="${this.parent?.id ?? ""}"
          ${constants.htmlDataMode}="${constants.htmlDataModeMwTest}"
          ${constants.htmlDataMwDifficulty} = ${difficulty}
          ${constants.htmlDataMwBoonLevy} = ${boonLevy}
          ${constants.htmlDataMwReRoll} = ${reRoll === null ? '""' : reRoll}
          ${constants.htmlDataMwPool} = ${newPool}
          ${constants.htmlDataTokenId}="${this.parent?.token?.id ?? ""}"
        />
      `,
    });
    await this.update({ system: { pool: newPool } });
  }

  async mWNegateIllustrious() {
    assertAbilityItem(this);
    const newPool = Math.max(0, this.system.pool - constants.mwNegateCost);
    await ChatMessage.create({
      content: `
        <div
          class="${constants.abilityChatMessageClassName}"
          ${constants.htmlDataItemId}="${this.id}"
          ${constants.htmlDataActorId}="${this.parent?.id}"
          ${constants.htmlDataMode}="${constants.htmlDataModeMwNegate}"
          ${constants.htmlDataMwPool} = ${newPool}
        />
      `,
    });
    await this.update({ system: { pool: newPool } });
  }

  async mWWallop() {
    assertAbilityItem(this);
    const newPool = Math.max(0, this.system.pool - constants.mwWallopCost);
    await ChatMessage.create({
      content: `
        <div
          class="${constants.abilityChatMessageClassName}"
          ${constants.htmlDataItemId}="${this.id}"
          ${constants.htmlDataActorId}="${this.parent?.id}"
          ${constants.htmlDataMode}="${constants.htmlDataModeMwWallop}"
          ${constants.htmlDataMwPool} = ${newPool}
        />
      `,
    });
    await this.update({ system: { pool: newPool } });
  }

  /**
   * reset the pool to the rating
   */
  async refreshPool() {
    assertAbilityItem(this);
    await this.update({
      system: {
        pool: this.system.rating ?? 0,
      },
    });
  }

  // ###########################################################################
  // GETTERS GONNA GET
  // SETTERS GONNA SET
  // basically we have a getter/setter pair for every attribute so they can be
  // used as handy callbacks in the component tree
  // ###########################################################################

  setCategory = async (category: string): Promise<void> => {
    isEquipmentOrAbilityItem(this);
    const updateData: Pick<EquipmentSystemData, "category" | "fields"> = {
      category,
      fields: {},
    };
    if (isEquipmentItem(this)) {
      const fields = settings.equipmentCategories.get()[category]?.fields ?? {};
      for (const field in fields) {
        updateData.fields[field] =
          this.system.fields[field] ?? fields[field].default;
      }
    }
    await this.update({ system: updateData });
  };

  setField = async (
    field: string,
    value: string | number | boolean,
  ): Promise<void> => {
    assertEquipmentItem(this);
    await this.update({ system: { fields: { [field]: value } } });
  };

  deleteField = async (field: string) => {
    assertEquipmentItem(this);
    await this.update({ [`system.fields.-=${field}`]: null });
  };

  setMin = (min: number) => {
    assertAbilityItem(this);
    return this.update({ system: { min } });
  };

  setMax = (max: number) => {
    assertAbilityItem(this);
    return this.update({ system: { max } });
  };

  setOccupational = (occupational: boolean) => {
    assertAbilityItem(this);
    return this.update({ system: { occupational } });
  };

  setCanBeInvestigative = (canBeInvestigative: boolean) => {
    assertAbilityItem(this);
    return this.update({ system: { canBeInvestigative } });
  };

  setShowTracker = (showTracker: boolean) => {
    assertAbilityItem(this);
    return this.update({ system: { showTracker } });
  };

  setExcludeFromGeneralRefresh = (excludeFromGeneralRefresh: boolean) => {
    assertAbilityItem(this);
    return this.update({ system: { excludeFromGeneralRefresh } });
  };

  setRefreshesDaily = (refreshesDaily: boolean) => {
    assertAbilityItem(this);
    return this.update({ system: { refreshesDaily } });
  };

  setGoesFirstInCombat = (goesFirstInCombat: boolean) => {
    assertAbilityItem(this);
    return this.update({ system: { goesFirstInCombat } });
  };

  getSpecialities = (): string[] => {
    assertAbilityItem(this);
    return fixLength(this.system.specialities, this.getSpecialitesCount(), "");
  };

  getSpecialitesCount = (): number => {
    assertAbilityItem(this);
    if (!this.system.hasSpecialities) {
      return 0;
    } else if (this.system.specialitiesMode === "twoThreeFour") {
      // NBA langauges style
      switch (this.system.rating) {
        case 0:
          return 0;
        case 1:
          return 2;
        case 2:
          return 5;
        default:
          return Math.max(0, (this.system.rating - 2) * 4 + 5);
      }
    } else {
      return this.system.rating;
    }
  };

  setSpecialities = (newSpecs: string[]): Promise<this | undefined> => {
    assertAbilityItem(this);
    return this.update({
      system: {
        specialities: fixLength(newSpecs, this.getSpecialitesCount(), ""),
      },
    });
  };

  setRating = (newRating: number) => {
    assertAbilityItem(this);
    return this.update({
      system: {
        rating: newRating,
        specialities: fixLength(this.system.specialities, newRating, ""),
      },
    });
  };

  setRatingRefresh = (newRating: number) => {
    assertAbilityItem(this);
    return this.update({
      system: {
        rating: newRating,
        pool: newRating,
        specialities: fixLength(this.system.specialities, newRating, ""),
      },
    });
  };

  setHasSpecialities = (hasSpecialities: boolean) => {
    assertAbilityItem(this);
    return this.update({
      system: {
        hasSpecialities,
      },
    });
  };

  setName = (name: string) => {
    return this.update({
      name,
    });
  };

  setCost = (cost: number) => {
    return this.update({
      system: {
        cost,
      },
    });
  };

  setAmmoMax = (max: number) => {
    return this.update({
      system: {
        ammo: {
          max,
        },
      },
    });
  };

  setAmmo = (value: number) => {
    return this.update({
      system: {
        ammo: {
          value,
        },
      },
    });
  };

  reload = async () => {
    assertWeaponItem(this);
    await this.update({
      system: {
        ammo: {
          value: this.system.ammo.max,
        },
      },
    });
  };

  setAmmoPerShot = async (ammoPerShot: number) => {
    assertWeaponItem(this);
    await this.update({
      system: { ammoPerShot },
    });
  };

  setUsesAmmo = async (usesAmmo: boolean) => {
    assertWeaponItem(this);
    await this.update({
      system: { usesAmmo },
    });
  };

  getThemeName(): string {
    const systemThemeName = settings.defaultThemeName.get();
    if (this.isOwned) {
      return (
        (this.actor as InvestigatorActor).getSheetThemeName() || systemThemeName
      );
    } else {
      return systemThemeName;
    }
  }

  getNotes = (): NoteWithFormat => {
    assertAnyItem(this);
    return (
      this.system.notes ?? {
        format: "richtext",
        value: "",
        html: "",
      }
    );
  };

  setNotes = async (newNotes: NoteWithFormat) => {
    await this.update({ system: { notes: newNotes } });
  };

  setAbility = async (ability: string) => {
    assertWeaponItem(this);
    await this.update({ system: { ability } });
  };

  setPool = (pool: number) => {
    assertAbilityItem(this);
    return this.update({ system: { pool } });
  };

  setBoost = (boost: boolean) => {
    assertAbilityItem(this);
    return this.update({ system: { boost } });
  };

  setDamage = async (damage: number) => {
    assertWeaponItem(this);
    await this.update({ system: { damage } });
  };

  setPointBlankDamage = async (pointBlankDamage: number) => {
    assertWeaponItem(this);
    await this.update({ system: { pointBlankDamage } });
  };

  setCloseRangeDamage = async (closeRangeDamage: number) => {
    assertWeaponItem(this);
    await this.update({ system: { closeRangeDamage } });
  };

  setNearRangeDamage = async (nearRangeDamage: number) => {
    assertWeaponItem(this);
    await this.update({ system: { nearRangeDamage } });
  };

  setLongRangeDamage = async (longRangeDamage: number) => {
    assertWeaponItem(this);
    await this.update({ system: { longRangeDamage } });
  };

  setIsPointBlank = async (isPointBlank: boolean) => {
    assertWeaponItem(this);
    await this.update({ system: { isPointBlank } });
  };

  setIsCloseRange = async (isCloseRange: boolean) => {
    assertWeaponItem(this);
    await this.update({ system: { isCloseRange } });
  };

  setIsNearRange = async (isNearRange: boolean) => {
    assertWeaponItem(this);
    await this.update({ system: { isNearRange } });
  };

  setIsLongRange = async (isLongRange: boolean) => {
    assertWeaponItem(this);
    await this.update({ system: { isLongRange } });
  };

  setHideIfZeroRated = async (hideIfZeroRated: boolean) => {
    assertAbilityItem(this);
    await this.update({ system: { hideIfZeroRated } });
  };

  setActive = async (active: boolean) => {
    assertCardItem(this);
    await this.update({ system: { active } });
  };

  // ---------------------------------------------------------------------------
  // MW specific fields

  setMwTrumps = (mwTrumps: string) => {
    assertGeneralAbilityItem(this);
    return this.update({ system: { mwTrumps } });
  };

  setMwTrumpedBy = (mwTrumpedBy: string) => {
    assertGeneralAbilityItem(this);
    return this.update({ system: { mwTrumpedBy } });
  };

  setMwType = async (mwType: MwType) => {
    assertMwItem(this);
    await this.update({ system: { mwType } });
  };

  setCharges = async (charges: number) => {
    assertMwItem(this);
    await this.update({ system: { charges } });
  };

  getRange = (range: 0 | 1 | 2 | 3): number => {
    assertMwItem(this);
    return this.system.ranges[range];
  };

  setRanges = async (ranges: [number, number, number, number]) => {
    assertMwItem(this);
    await this.update({ system: { ranges } });
  };

  setRange = (range: 0 | 1 | 2 | 3) => async (value: number) => {
    assertMwItem(this);
    const ranges = [...this.system.ranges] as RangeTuple;
    ranges[range] = value;
    await this.update({ system: { ranges } });
  };

  setMwRefreshGroup = async (mwRefreshGroup: MwRefreshGroup) => {
    assertGeneralAbilityItem(this);
    await this.update({ system: { mwRefreshGroup } });
  };

  getActiveUnlocks = (): Unlock[] => {
    assertAbilityItem(this);
    return this.system.unlocks.filter(
      ({ rating: targetRating, description }) => {
        assertAbilityItem(this);
        return this.system.rating >= targetRating && description !== "";
      },
    );
  };

  getVisibleSituationalModifiers = (): SituationalModifier[] => {
    assertAbilityItem(this);
    return this.system.situationalModifiers.filter(({ situation }) => {
      assertAbilityItem(this);
      return situation !== "";
    });
  };

  toggleSituationalModifier = (id: string) => {
    assertAbilityItem(this);
    if (this.isSituationalModifierActive(id)) {
      const index = this.activeSituationalModifiers.indexOf(id);
      if (index !== -1) {
        this.activeSituationalModifiers.splice(index, 1);
      }
    } else {
      if (!this.activeSituationalModifiers.includes(id)) {
        this.activeSituationalModifiers.push(id);
      }
    }
    this.sheet?.render();
    this.actor?.sheet?.render();
  };

  isSituationalModifierActive = (id: string): boolean => {
    assertAbilityItem(this);
    return this.activeSituationalModifiers.includes(id);
  };

  setUnlockDescription = (index: number, description: string) => {
    assertAbilityItem(this);
    const unlocks = [...this.system.unlocks];
    unlocks[index] = {
      ...unlocks[index],
      description,
    };
    return this.update({ system: { unlocks } });
  };

  setUnlockRating = (index: number, rating: number) => {
    assertAbilityItem(this);
    const unlocks = [...this.system.unlocks];
    unlocks[index] = {
      ...unlocks[index],
      rating,
    };
    return this.update({ system: { unlocks } });
  };

  deleteUnlock = (index: number) => {
    assertAbilityItem(this);
    const unlocks = [...this.system.unlocks];
    unlocks.splice(index, 1);
    return this.update({ system: { unlocks } });
  };

  addUnlock = () => {
    assertAbilityItem(this);
    const unlocks: Unlock[] = [
      ...this.system.unlocks,
      {
        description: "",
        rating: 0,
        id: nanoid(),
      },
    ];
    return this.update({ system: { unlocks } });
  };

  setSituationalModifierSituation = (index: number, situation: string) => {
    assertAbilityItem(this);
    const situationalModifiers = [...this.system.situationalModifiers];
    situationalModifiers[index] = {
      ...situationalModifiers[index],
      situation,
    };
    return this.update({ system: { situationalModifiers } });
  };

  setSituationalModifierModifier = (index: number, modifier: number) => {
    assertAbilityItem(this);
    const situationalModifiers = [...this.system.situationalModifiers];
    situationalModifiers[index] = {
      ...situationalModifiers[index],
      modifier,
    };
    return this.update({ system: { situationalModifiers } });
  };

  deleteSituationalModifier = (index: number) => {
    assertAbilityItem(this);
    const situationalModifiers = [...this.system.situationalModifiers];
    situationalModifiers.splice(index, 1);
    return this.update({ system: { situationalModifiers } });
  };

  addSituationalModifier = () => {
    assertAbilityItem(this);
    const situationalModifiers: SituationalModifier[] = [
      ...this.system.situationalModifiers,
      {
        situation: "",
        modifier: 0,
        id: nanoid(),
      },
    ];
    return this.update({ system: { situationalModifiers } });
  };

  setCombatBonus = async (combatBonus: number) => {
    assertGeneralAbilityItem(this);
    await this.update({ system: { combatBonus } });
  };

  setDamageBonus = async (damageBonus: number) => {
    assertGeneralAbilityItem(this);
    await this.update({ system: { damageBonus } });
  };

  setSlotIndex = async (slotIndex: number) => {
    assertPersonalDetailItem(this);
    await this.update({
      system: {
        slotIndex,
      },
    });
  };

  setCompendiumPack = async (id: string | null) => {
    assertPersonalDetailItem(this);
    await this.update({
      system: {
        compendiumPackId: id,
      },
    });
  };

  setSpecialitiesMode = (mode: SpecialitiesMode) => {
    assertAbilityItem(this);
    return this.update({ system: { specialitiesMode: mode } });
  };
}

declare global {
  interface DocumentClassConfig {
    Item: typeof InvestigatorItem;
  }
}
