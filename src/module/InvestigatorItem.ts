import { assertGame, fixLength } from "../functions";
import { InvestigatorActor } from "./InvestigatorActor";
import {
  EquipmentDataSource,
  MWDifficulty,
  MwRefreshGroup,
  MwType,
  NoteWithFormat,
  RangeTuple,
  SituationalModifier,
  Unlock,
} from "../types";
import * as constants from "../constants";
import { runtimeConfig } from "../runtime";
import { settings } from "../settings";
import { ThemeV1 } from "../themes/types";
import { nanoid } from "nanoid";
import {
  assertAbilityItem,
  assertEquipmentItem,
  assertEquipmentOrAbilityItem,
  assertGeneralAbilityItem,
  isEquipmentItem,
  isEquipmentOrAbilityItem,
  assertWeaponItem,
  assertAnyItem,
  assertMwItem,
  assertPersonalDetailItem,
} from "../v10Types";

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
          ${constants.htmlDataItemId}="${this.data._id}"
          ${constants.htmlDataActorId}="${this.parent?.data._id}"
          ${constants.htmlDataMode}="${constants.htmlDataModeTest}"
          ${constants.htmlDataName}="${this.data.name}"
          ${constants.htmlDataImageUrl}="${this.data.img}"
        />
      `,
    });
    const pool = this.system.pool - (Number(spend) || 0);
    this.update({ data: { pool } });
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
          ${constants.htmlDataItemId}="${this.data._id}"
          ${constants.htmlDataActorId}="${this.parent?.data._id}"
          ${constants.htmlDataMode}="${constants.htmlDataModeSpend}"
          ${constants.htmlDataName}="${this.data.name}"
          ${constants.htmlDataImageUrl}="${this.data.img}"
        />
      `,
    });
    const boost = settings.useBoost.get() && this.getBoost() ? 1 : 0;
    const pool = this.system.pool - (Number(spend) || 0) + boost;
    this.update({ data: { pool } });
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
          this.data.name
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
          ${constants.htmlDataItemId}="${this.data._id}"
          ${constants.htmlDataActorId}="${this.parent?.data._id}"
          ${constants.htmlDataMode}="${constants.htmlDataModeMwTest}"
          ${constants.htmlDataMwDifficulty} = ${difficulty}
          ${constants.htmlDataMwBoonLevy} = ${boonLevy}
          ${constants.htmlDataMwReRoll} = ${reRoll === null ? '""' : reRoll}
          ${constants.htmlDataMwPool} = ${newPool}
        />
      `,
    });
    this.update({ data: { pool: newPool } });
  }

  mWNegateIllustrious() {
    assertAbilityItem(this);
    const newPool = Math.max(0, this.system.pool - constants.mwNegateCost);
    ChatMessage.create({
      content: `
        <div
          class="${constants.abilityChatMessageClassName}"
          ${constants.htmlDataItemId}="${this.data._id}"
          ${constants.htmlDataActorId}="${this.parent?.data._id}"
          ${constants.htmlDataMode}="${constants.htmlDataModeMwNegate}"
          ${constants.htmlDataMwPool} = ${newPool}
        />
      `,
    });
    this.update({ data: { pool: newPool } });
  }

  async mWWallop() {
    assertAbilityItem(this);
    const newPool = Math.max(0, this.system.pool - constants.mwWallopCost);
    ChatMessage.create({
      content: `
        <div
          class="${constants.abilityChatMessageClassName}"
          ${constants.htmlDataItemId}="${this.data._id}"
          ${constants.htmlDataActorId}="${this.parent?.data._id}"
          ${constants.htmlDataMode}="${constants.htmlDataModeMwWallop}"
          ${constants.htmlDataMwPool} = ${newPool}
        />
      `,
    });
    this.update({ data: { pool: newPool } });
  }

  /**
   * reset the pool to the rating
   */
  refreshPool() {
    assertAbilityItem(this);
    this.update({
      data: {
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

  getCategory = () => {
    assertEquipmentOrAbilityItem(this);
    return this.system.category;
  };

  setCategory = (category: string) => {
    isEquipmentOrAbilityItem(this);
    const updateData: Pick<EquipmentDataSource["data"], "category" | "fields"> =
      { category, fields: {} };
    if (isEquipmentItem(this)) {
      const fields = settings.equipmentCategories.get()[category]?.fields ?? {};
      for (const field in fields) {
        updateData.fields[field] =
          this.system.fields[field] ?? fields[field].default;
      }
    }
    return this.update({ data: updateData });
  };

  setField = (field: string, value: string | number | boolean) => {
    assertEquipmentItem(this);
    return this.update({ data: { fields: { [field]: value } } });
  };

  deleteField = (field: string) => {
    assertEquipmentItem(this);
    return this.update({ [`data.fields.-=${field}`]: null });
  };

  getMin = () => {
    assertAbilityItem(this);
    return this.system.min;
  };

  setMin = (min: number) => {
    assertAbilityItem(this);
    return this.update({ data: { min } });
  };

  getMax = () => {
    assertAbilityItem(this);
    return this.system.max;
  };

  setMax = (max: number) => {
    assertAbilityItem(this);
    return this.update({ data: { max } });
  };

  getOccupational = () => {
    assertAbilityItem(this);
    return this.system.occupational;
  };

  setOccupational = (occupational: boolean) => {
    assertAbilityItem(this);
    return this.update({ data: { occupational } });
  };

  getCanBeInvestigative = () => {
    assertGeneralAbilityItem(this);
    return this.system.canBeInvestigative;
  };

  setCanBeInvestigative = (canBeInvestigative: boolean) => {
    assertAbilityItem(this);
    return this.update({ data: { canBeInvestigative } });
  };

  getShowTracker = () => {
    assertAbilityItem(this);
    return this.system.showTracker;
  };

  setShowTracker = (showTracker: boolean) => {
    assertAbilityItem(this);
    return this.update({ data: { showTracker } });
  };

  getExcludeFromGeneralRefresh = () => {
    assertAbilityItem(this);
    return this.system.excludeFromGeneralRefresh;
  };

  setExcludeFromGeneralRefresh = (excludeFromGeneralRefresh: boolean) => {
    assertAbilityItem(this);
    return this.update({ data: { excludeFromGeneralRefresh } });
  };

  getRefreshesDaily = () => {
    assertAbilityItem(this);
    return this.system.refreshesDaily;
  };

  setRefreshesDaily = (refreshesDaily: boolean) => {
    assertAbilityItem(this);
    return this.update({ data: { refreshesDaily } });
  };

  getGoesFirstInCombat = () => {
    assertGeneralAbilityItem(this);
    return this.system.goesFirstInCombat;
  };

  setGoesFirstInCombat = (goesFirstInCombat: boolean) => {
    assertAbilityItem(this);
    return this.update({ data: { goesFirstInCombat } });
  };

  getSpecialities = () => {
    assertAbilityItem(this);
    return fixLength(this.system.specialities, this.system.rating, "");
  };

  setSpecialities = (newSpecs: string[]) => {
    assertAbilityItem(this);
    return this.update({
      data: {
        specialities: fixLength(newSpecs, this.system.rating, ""),
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
      data: {
        rating: newRating,
        specialities: fixLength(this.system.specialities, newRating, ""),
      },
    });
  };

  setRatingRefresh = (newRating: number) => {
    assertAbilityItem(this);
    return this.update({
      data: {
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
      data: {
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
      data: {
        cost,
      },
    });
  };

  setAmmoMax = (max: number) => {
    return this.update({
      data: {
        ammo: {
          max,
        },
      },
    });
  };

  getAmmoMax = () => {
    assertWeaponItem(this);
    return this.system.ammo?.max || 0;
  };

  setAmmo = (value: number) => {
    return this.update({
      data: {
        ammo: {
          value,
        },
      },
    });
  };

  getAmmo = () => {
    assertWeaponItem(this);
    return this.system.ammo?.value || 0;
  };

  reload = () => {
    assertWeaponItem(this);
    return this.update({
      data: {
        ammo: {
          value: this.getAmmoMax(),
        },
      },
    });
  };

  getAmmoPerShot = () => {
    assertWeaponItem(this);
    return this.system.ammoPerShot ?? 1;
  };

  setAmmoPerShot = (ammoPerShot: number) => {
    assertWeaponItem(this);
    return this.update({
      data: { ammoPerShot },
    });
  };

  getUsesAmmo = () => {
    assertWeaponItem(this);
    return this.system.usesAmmo ?? false;
  };

  setUsesAmmo = (usesAmmo: boolean) => {
    assertWeaponItem(this);
    return this.update({
      data: { usesAmmo },
    });
  };

  getTheme(): ThemeV1 {
    const themeName = this.getThemeName();
    const theme = runtimeConfig.themes[themeName];
    return theme;
  }

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

  getNotes = () => {
    assertAnyItem(this);
    return this.system.notes ?? "";
  };

  setNotes = async (newNotes: NoteWithFormat) => {
    await this.update({ data: { notes: newNotes } });
  };

  getAbility = () => {
    assertWeaponItem(this);
    return this.system.ability ?? "";
  };

  setAbility = (ability: string) => {
    assertWeaponItem(this);
    return this.update({ data: { ability } });
  };

  getPool = () => {
    assertAbilityItem(this);
    return this.system.pool ?? 0;
  };

  setPool = (pool: number) => {
    assertAbilityItem(this);
    return this.update({ data: { pool } });
  };

  getBoost = () => {
    assertAbilityItem(this);
    return this.system.boost ?? 0;
  };

  setBoost = (boost: boolean) => {
    assertAbilityItem(this);
    return this.update({ data: { boost } });
  };

  getDamage = () => {
    assertWeaponItem(this);
    return this.system.damage ?? 0;
  };

  setDamage = (damage: number) => {
    assertWeaponItem(this);
    return this.update({ data: { damage } });
  };

  getPointBlankDamage = () => {
    assertWeaponItem(this);
    return this.system.pointBlankDamage ?? 0;
  };

  setPointBlankDamage = (pointBlankDamage: number) => {
    assertWeaponItem(this);
    return this.update({ data: { pointBlankDamage } });
  };

  getCloseRangeDamage = () => {
    assertWeaponItem(this);
    return this.system.closeRangeDamage ?? 0;
  };

  setCloseRangeDamage = (closeRangeDamage: number) => {
    assertWeaponItem(this);
    return this.update({ data: { closeRangeDamage } });
  };

  getNearRangeDamage = () => {
    assertWeaponItem(this);
    return this.system.nearRangeDamage ?? 0;
  };

  setNearRangeDamage = (nearRangeDamage: number) => {
    assertWeaponItem(this);
    return this.update({ data: { nearRangeDamage } });
  };

  getLongRangeDamage = () => {
    assertWeaponItem(this);
    return this.system.longRangeDamage ?? 0;
  };

  setLongRangeDamage = (longRangeDamage: number) => {
    assertWeaponItem(this);
    return this.update({ data: { longRangeDamage } });
  };

  getIsPointBlank = () => {
    assertWeaponItem(this);
    return this.system.isPointBlank;
  };

  setIsPointBlank = (isPointBlank: boolean) => {
    assertWeaponItem(this);
    return this.update({ data: { isPointBlank } });
  };

  getIsCloseRange = () => {
    assertWeaponItem(this);
    return this.system.isCloseRange;
  };

  setIsCloseRange = (isCloseRange: boolean) => {
    assertWeaponItem(this);
    return this.update({ data: { isCloseRange } });
  };

  getIsNearRange = () => {
    assertWeaponItem(this);
    return this.system.isNearRange;
  };

  setIsNearRange = (isNearRange: boolean) => {
    assertWeaponItem(this);
    return this.update({ data: { isNearRange } });
  };

  getIsLongRange = () => {
    assertWeaponItem(this);
    return this.system.isLongRange;
  };

  setIsLongRange = (isLongRange: boolean) => {
    assertWeaponItem(this);
    return this.update({ data: { isLongRange } });
  };

  getHideIfZeroRated = () => {
    assertAbilityItem(this);
    return this.system.hideIfZeroRated;
  };

  setHideIfZeroRated = (hideIfZeroRated: boolean) => {
    assertAbilityItem(this);
    return this.update({ data: { hideIfZeroRated } });
  };

  // ---------------------------------------------------------------------------
  // MW specific fields

  getMwTrumps = () => {
    assertGeneralAbilityItem(this);
    return this.system.mwTrumps;
  };

  setMwTrumps = (mwTrumps: string) => {
    assertGeneralAbilityItem(this);
    return this.update({ data: { mwTrumps } });
  };

  getMwTrumpedBy = () => {
    assertGeneralAbilityItem(this);
    return this.system.mwTrumpedBy;
  };

  setMwTrumpedBy = (mwTrumpedBy: string) => {
    assertGeneralAbilityItem(this);
    return this.update({ data: { mwTrumpedBy } });
  };

  getMwType = () => {
    assertMwItem(this);
    return this.system.mwType;
  };

  setMwType = (mwType: MwType) => {
    assertMwItem(this);
    return this.update({ data: { mwType } });
  };

  getCharges = () => {
    assertMwItem(this);
    return this.system.charges;
  };

  setCharges = (charges: number) => {
    assertMwItem(this);
    return this.update({ data: { charges } });
  };

  getRanges = () => {
    assertMwItem(this);
    return this.system.ranges;
  };

  getRange = (range: 0 | 1 | 2 | 3) => {
    assertMwItem(this);
    return this.system.ranges[range];
  };

  setRanges = (ranges: [number, number, number, number]) => {
    assertMwItem(this);
    return this.update({ data: { ranges } });
  };

  setRange = (range: 0 | 1 | 2 | 3) => (value: number) => {
    assertMwItem(this);
    const ranges = [...this.system.ranges] as RangeTuple;
    ranges[range] = value;
    return this.update({ data: { ranges } });
  };

  getMwRefreshGroup = () => {
    assertGeneralAbilityItem(this);
    return this.system.mwRefreshGroup;
  };

  setMwRefreshGroup = (mwRefreshGroup: MwRefreshGroup) => {
    assertGeneralAbilityItem(this);
    return this.update({ data: { mwRefreshGroup } });
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
    return this.update({ data: { unlocks } });
  };

  setUnlockRating = (index: number, rating: number) => {
    assertAbilityItem(this);
    const unlocks = [...this.system.unlocks];
    unlocks[index] = {
      ...unlocks[index],
      rating,
    };
    return this.update({ data: { unlocks } });
  };

  deleteUnlock = (index: number) => {
    assertAbilityItem(this);
    const unlocks = [...this.system.unlocks];
    unlocks.splice(index, 1);
    return this.update({ data: { unlocks } });
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
    return this.update({ data: { unlocks } });
  };

  setSituationalModifierSituation = (index: number, situation: string) => {
    assertAbilityItem(this);
    const situationalModifiers = [...this.system.situationalModifiers];
    situationalModifiers[index] = {
      ...situationalModifiers[index],
      situation,
    };
    return this.update({ data: { situationalModifiers } });
  };

  setSituationalModifierModifier = (index: number, modifier: number) => {
    assertAbilityItem(this);
    const situationalModifiers = [...this.system.situationalModifiers];
    situationalModifiers[index] = {
      ...situationalModifiers[index],
      modifier,
    };
    return this.update({ data: { situationalModifiers } });
  };

  deleteSituationalModifier = (index: number) => {
    assertAbilityItem(this);
    const situationalModifiers = [...this.system.situationalModifiers];
    situationalModifiers.splice(index, 1);
    return this.update({ data: { situationalModifiers } });
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
    return this.update({ data: { situationalModifiers } });
  };

  setCombatBonus = async (combatBonus: number) => {
    assertGeneralAbilityItem(this);
    await this.update({ data: { combatBonus } });
  };

  setDamageBonus = async (damageBonus: number) => {
    assertGeneralAbilityItem(this);
    await this.update({ data: { damageBonus } });
  };

  setSlotIndex = (slotIndex: number) => {
    assertPersonalDetailItem(this);
    this.update({
      data: {
        slotIndex,
      },
    });
  };

  setCompendiumPack = (id: string | null) => {
    assertPersonalDetailItem(this);
    this.update({
      data: {
        compendiumPackId: id,
      },
    });
  };
}

declare global {
  interface DocumentClassConfig {
    Item: typeof InvestigatorItem;
  }
}
