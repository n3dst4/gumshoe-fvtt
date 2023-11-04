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
  assertEquipmentItem,
  assertEquipmentOrAbilityItem,
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
    const isBoosted = settings.useBoost.get() && this.getBoost();
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
      rollValues.boost = boost;
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
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({
        actor: this.actor as InvestigatorActor,
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
    this.update({ system: { pool } });
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
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({
        actor: this.actor as InvestigatorActor,
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
    const boost = settings.useBoost.get() && this.getBoost() ? 1 : 0;
    const pool = this.system.pool - (Number(spend) || 0) + boost;
    this.update({ system: { pool } });
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
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({
        actor: this.actor as InvestigatorActor,
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
    this.update({ system: { pool: newPool } });
  }

  mWNegateIllustrious() {
    assertAbilityItem(this);
    const newPool = Math.max(0, this.system.pool - constants.mwNegateCost);
    ChatMessage.create({
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
    this.update({ system: { pool: newPool } });
  }

  async mWWallop() {
    assertAbilityItem(this);
    const newPool = Math.max(0, this.system.pool - constants.mwWallopCost);
    ChatMessage.create({
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
    this.update({ system: { pool: newPool } });
  }

  /**
   * reset the pool to the rating
   */
  refreshPool() {
    assertAbilityItem(this);
    this.update({
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

  getCategory = (): string => {
    assertEquipmentOrAbilityItem(this);
    return this.system.category;
  };

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

  getMin = () => {
    assertAbilityItem(this);
    return this.system.min;
  };

  setMin = (min: number) => {
    assertAbilityItem(this);
    return this.update({ system: { min } });
  };

  getMax = () => {
    assertAbilityItem(this);
    return this.system.max;
  };

  setMax = (max: number) => {
    assertAbilityItem(this);
    return this.update({ system: { max } });
  };

  getOccupational = () => {
    assertAbilityItem(this);
    return this.system.occupational;
  };

  setOccupational = (occupational: boolean) => {
    assertAbilityItem(this);
    return this.update({ system: { occupational } });
  };

  getCanBeInvestigative = () => {
    assertGeneralAbilityItem(this);
    return this.system.canBeInvestigative;
  };

  setCanBeInvestigative = (canBeInvestigative: boolean) => {
    assertAbilityItem(this);
    return this.update({ system: { canBeInvestigative } });
  };

  getShowTracker = () => {
    assertAbilityItem(this);
    return this.system.showTracker;
  };

  setShowTracker = (showTracker: boolean) => {
    assertAbilityItem(this);
    return this.update({ system: { showTracker } });
  };

  getExcludeFromGeneralRefresh = () => {
    assertAbilityItem(this);
    return this.system.excludeFromGeneralRefresh;
  };

  setExcludeFromGeneralRefresh = (excludeFromGeneralRefresh: boolean) => {
    assertAbilityItem(this);
    return this.update({ system: { excludeFromGeneralRefresh } });
  };

  getRefreshesDaily = () => {
    assertAbilityItem(this);
    return this.system.refreshesDaily;
  };

  setRefreshesDaily = (refreshesDaily: boolean) => {
    assertAbilityItem(this);
    return this.update({ system: { refreshesDaily } });
  };

  getGoesFirstInCombat = () => {
    assertGeneralAbilityItem(this);
    return this.system.goesFirstInCombat;
  };

  setGoesFirstInCombat = (goesFirstInCombat: boolean) => {
    assertAbilityItem(this);
    return this.update({ system: { goesFirstInCombat } });
  };

  getSpecialities = () => {
    assertAbilityItem(this);
    return fixLength(this.system.specialities, this.getSpecialitesCount(), "");
  };

  getSpecialitesCount = () => {
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

  getRating = (): number => {
    assertAbilityItem(this);
    return this.system.rating ?? 0;
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

  getHasSpecialities = () => {
    assertAbilityItem(this);
    return this.system.hasSpecialities ?? false;
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

  getAmmoMax = (): number => {
    assertWeaponItem(this);
    return this.system.ammo?.max || 0;
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

  getAmmo = (): number => {
    assertWeaponItem(this);
    return this.system.ammo?.value || 0;
  };

  reload = async () => {
    assertWeaponItem(this);
    await this.update({
      system: {
        ammo: {
          value: this.getAmmoMax(),
        },
      },
    });
  };

  getAmmoPerShot = (): number => {
    assertWeaponItem(this);
    return this.system.ammoPerShot ?? 1;
  };

  setAmmoPerShot = async (ammoPerShot: number) => {
    assertWeaponItem(this);
    await this.update({
      system: { ammoPerShot },
    });
  };

  getUsesAmmo = (): boolean => {
    assertWeaponItem(this);
    return this.system.usesAmmo ?? false;
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

  getAbility = (): string => {
    assertWeaponItem(this);
    return this.system.ability ?? "";
  };

  setAbility = async (ability: string) => {
    assertWeaponItem(this);
    await this.update({ system: { ability } });
  };

  getPool = () => {
    assertAbilityItem(this);
    return this.system.pool ?? 0;
  };

  setPool = (pool: number) => {
    assertAbilityItem(this);
    return this.update({ system: { pool } });
  };

  getBoost = () => {
    assertAbilityItem(this);
    return this.system.boost ?? 0;
  };

  setBoost = (boost: boolean) => {
    assertAbilityItem(this);
    return this.update({ system: { boost } });
  };

  getDamage = (): number => {
    assertWeaponItem(this);
    return this.system.damage ?? 0;
  };

  setDamage = async (damage: number) => {
    assertWeaponItem(this);
    await this.update({ system: { damage } });
  };

  getPointBlankDamage = (): number => {
    assertWeaponItem(this);
    return this.system.pointBlankDamage ?? 0;
  };

  setPointBlankDamage = async (pointBlankDamage: number) => {
    assertWeaponItem(this);
    await this.update({ system: { pointBlankDamage } });
  };

  getCloseRangeDamage = (): number => {
    assertWeaponItem(this);
    return this.system.closeRangeDamage ?? 0;
  };

  setCloseRangeDamage = async (closeRangeDamage: number) => {
    assertWeaponItem(this);
    await this.update({ system: { closeRangeDamage } });
  };

  getNearRangeDamage = (): number => {
    assertWeaponItem(this);
    return this.system.nearRangeDamage ?? 0;
  };

  setNearRangeDamage = async (nearRangeDamage: number) => {
    assertWeaponItem(this);
    await this.update({ system: { nearRangeDamage } });
  };

  getLongRangeDamage = (): number => {
    assertWeaponItem(this);
    return this.system.longRangeDamage ?? 0;
  };

  setLongRangeDamage = async (longRangeDamage: number) => {
    assertWeaponItem(this);
    await this.update({ system: { longRangeDamage } });
  };

  getIsPointBlank = (): boolean => {
    assertWeaponItem(this);
    return this.system.isPointBlank;
  };

  setIsPointBlank = async (isPointBlank: boolean) => {
    assertWeaponItem(this);
    await this.update({ system: { isPointBlank } });
  };

  getIsCloseRange = (): boolean => {
    assertWeaponItem(this);
    return this.system.isCloseRange;
  };

  setIsCloseRange = async (isCloseRange: boolean) => {
    assertWeaponItem(this);
    await this.update({ system: { isCloseRange } });
  };

  getIsNearRange = (): boolean => {
    assertWeaponItem(this);
    return this.system.isNearRange;
  };

  setIsNearRange = async (isNearRange: boolean) => {
    assertWeaponItem(this);
    await this.update({ system: { isNearRange } });
  };

  getIsLongRange = (): boolean => {
    assertWeaponItem(this);
    return this.system.isLongRange;
  };

  setIsLongRange = async (isLongRange: boolean) => {
    assertWeaponItem(this);
    await this.update({ system: { isLongRange } });
  };

  getHideIfZeroRated = (): boolean => {
    assertAbilityItem(this);
    return this.system.hideIfZeroRated;
  };

  setHideIfZeroRated = async (hideIfZeroRated: boolean) => {
    assertAbilityItem(this);
    await this.update({ system: { hideIfZeroRated } });
  };

  // ---------------------------------------------------------------------------
  // MW specific fields

  getMwTrumps = () => {
    assertGeneralAbilityItem(this);
    return this.system.mwTrumps;
  };

  setMwTrumps = (mwTrumps: string) => {
    assertGeneralAbilityItem(this);
    return this.update({ system: { mwTrumps } });
  };

  getMwTrumpedBy = () => {
    assertGeneralAbilityItem(this);
    return this.system.mwTrumpedBy;
  };

  setMwTrumpedBy = (mwTrumpedBy: string) => {
    assertGeneralAbilityItem(this);
    return this.update({ system: { mwTrumpedBy } });
  };

  getMwType = (): MwType => {
    assertMwItem(this);
    return this.system.mwType;
  };

  setMwType = async (mwType: MwType) => {
    assertMwItem(this);
    await this.update({ system: { mwType } });
  };

  getCharges = (): number => {
    assertMwItem(this);
    return this.system.charges;
  };

  setCharges = async (charges: number) => {
    assertMwItem(this);
    await this.update({ system: { charges } });
  };

  getRanges = (): RangeTuple => {
    assertMwItem(this);
    return this.system.ranges;
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

  getMwRefreshGroup = () => {
    assertGeneralAbilityItem(this);
    return this.system.mwRefreshGroup;
  };

  setMwRefreshGroup = async (mwRefreshGroup: MwRefreshGroup) => {
    assertGeneralAbilityItem(this);
    await this.update({ system: { mwRefreshGroup } });
  };

  getActiveUnlocks = () => {
    assertAbilityItem(this);
    return this.system.unlocks.filter(
      ({ rating: targetRating, description }) => {
        assertAbilityItem(this);
        return this.system.rating >= targetRating && description !== "";
      },
    );
  };

  getVisibleSituationalModifiers = () => {
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

  isSituationalModifierActive = (id: string) => {
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

  setSlotIndex = (slotIndex: number) => {
    assertPersonalDetailItem(this);
    this.update({
      system: {
        slotIndex,
      },
    });
  };

  setCompendiumPack = (id: string | null) => {
    assertPersonalDetailItem(this);
    this.update({
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
