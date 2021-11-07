import { assertGame, fixLength, isAbility } from "../functions";
import { themes } from "../themes/themes";
import { Theme } from "../themes/types";
import { InvestigatorActor } from "./InvestigatorActor";
import { getDefaultThemeName } from "../settingsHelpers";
import { assertAbilityDataSource, assertGeneralAbilityDataSource, assertWeaponDataSource, MWDifficulty } from "../types";
import * as constants from "../constants";

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class InvestigatorItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData () {
    super.prepareData();

    // Get the Item's data
    // const itemData = this.data;
    // const actorData = this.actor ? this.actor.data : {};
    // const data = itemData.data;
  }

  async testAbility (spend: number) {
    assertGame(game);
    assertAbilityDataSource(this.data);
    if (this.actor === null) { return; }
    const useBoost = game.settings.get(constants.systemName, constants.useBoost);
    const isBoosted = useBoost && this.getBoost();
    const boost = isBoosted ? 1 : 0;
    const roll = isBoosted
      ? new Roll("1d6 + @spend + @boost", { spend, boost })
      : new Roll("1d6 + @spend", { spend });
    await roll.evaluate({ async: true });
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: `
        <div 
          class="${constants.abilityChatMessageClassName}"
          ${constants.htmlDataItemId}="${this.data._id}"
          ${constants.htmlDataActorId}="${this.parent?.data._id}"
          ${constants.htmlDataMode}="${constants.htmlDataModeTest}"
        />
      `,
    });
    this.update({ data: { pool: this.data.data.pool - Number(spend) || 0 } });
  }

  async spendAbility (spend: number) {
    assertAbilityDataSource(this.data);
    if (this.actor === null) { return; }
    const roll = new Roll("@spend", { spend });
    await roll.evaluate({ async: true });
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: `
        <div
          class="${constants.abilityChatMessageClassName}"
          ${constants.htmlDataItemId}="${this.data._id}"
          ${constants.htmlDataActorId}="${this.parent?.data._id}"
          ${constants.htmlDataMode}="${constants.htmlDataModeSpend}"
        />
      `,
    });
    this.update({ data: { pool: this.data.data.pool - Number(spend) || 0 } });
  }

  async mwTestAbility (difficulty: MWDifficulty, boonLevy: number, isReRoll = false) {
    assertGame(game);
    assertAbilityDataSource(this.data);
    if (this.actor === null) { return; }
    const diffMod = (difficulty === "easy") ? 0 : difficulty;
    const operator = diffMod < 0 ? "-" : "+";
    const roll = diffMod === 0
      ? new Roll("1d6")
      : new Roll(`1d6 ${operator} @diffMod`, { diffMod: Math.abs(diffMod) });
    await roll.evaluate({ async: true });
    const cost = (isReRoll ? 1 : 0) - boonLevy;
    if (cost > this.data.data.pool) {
      ui.notifications?.error(`Attempted to ${isReRoll ? "re-" : ""}roll ${this.data.name} with a levy of ${boonLevy} but pool is currently at ${this.data.data.pool}`);
      return;
    }
    const newPool = Math.max(0, this.data.data.pool - cost);
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: `
        <div 
          class="${constants.abilityChatMessageClassName}"
          ${constants.htmlDataItemId}="${this.data._id}"
          ${constants.htmlDataActorId}="${this.parent?.data._id}"
          ${constants.htmlDataMode}="${constants.htmlDataModeMwTest}"
          ${constants.htmlDataMwDifficulty} = ${difficulty}
          ${constants.htmlDataMwBoonLevy} = ${boonLevy}
          ${constants.htmlDataMwIsReRoll} = ${isReRoll}
          ${constants.htmlDataMwPool} = ${newPool}
        />
      `,
    });
    this.update({ data: { pool: newPool } });
  }

  refreshPool () {
    assertAbilityDataSource(this.data);
    this.update({
      data: {
        pool: this.data.data.rating ?? 0,
      },
    });
  }

  getSpecialities = () => {
    assertAbilityDataSource(this.data);
    return fixLength(this.data.data.specialities, this.data.data.rating, "");
  }

  setSpecialities = (newSpecs: string[]) => {
    assertAbilityDataSource(this.data);
    this.update({
      data: {
        specialities: fixLength(newSpecs, this.data.data.rating, ""),
      },
    });
  }

  getRating = (): number => {
    assertAbilityDataSource(this.data);
    if (!isAbility(this)) {
      throw new Error(`${this.type} does not have a rating`);
    }
    return this.data.data.rating ?? 0;
  }

  setRating = (newRating: number) => {
    assertAbilityDataSource(this.data);
    this.update({
      data: {
        rating: newRating,
        specialities: fixLength(this.data.data.specialities, newRating, ""),
      },
    });
  }

  setRatingRefresh = (newRating: number) => {
    assertAbilityDataSource(this.data);
    this.update({
      data: {
        rating: newRating,
        pool: newRating,
        specialities: fixLength(this.data.data.specialities, newRating, ""),
      },
    });
  }

  getHasSpecialities = () => {
    assertAbilityDataSource(this.data);
    return this.data.data.hasSpecialities ?? false;
  }

  setHasSpecialities = (hasSpecialities: boolean) => {
    assertAbilityDataSource(this.data);
    this.update({
      data: {
        hasSpecialities,
      },
    });
  }

  setName = (name: string) => {
    this.update({
      name,
    });
  }

  setAmmoMax = (max: number) => {
    this.update({
      data: {
        ammo: {
          max,
        },
      },
    });
  }

  getAmmoMax = () => {
    assertWeaponDataSource(this.data);
    return this.data.data.ammo?.max || 0;
  }

  setAmmo = (value: number) => {
    this.update({
      data: {
        ammo: {
          value,
        },
      },
    });
  }

  getAmmo = () => {
    assertWeaponDataSource(this.data);
    return this.data.data.ammo?.value || 0;
  }

  reload = () => {
    assertWeaponDataSource(this.data);
    this.update({
      data: {
        ammo: {
          value: this.getAmmoMax(),
        },
      },
    });
  }

  getAmmoPerShot = () => {
    assertWeaponDataSource(this.data);
    return this.data.data.ammoPerShot ?? 1;
  }

  setAmmoPerShot = (ammoPerShot: number) => {
    assertWeaponDataSource(this.data);
    this.update({
      data: { ammoPerShot },
    });
  }

  getUsesAmmo = () => {
    assertWeaponDataSource(this.data);
    return this.data.data.usesAmmo ?? false;
  }

  setUsesAmmo = (usesAmmo: boolean) => {
    assertWeaponDataSource(this.data);
    this.update({
      data: { usesAmmo },
    });
  }

  // ---------------------------------------------------------------------------
  // THEME

  getTheme (): Theme {
    const themeName = this.getThemeName();
    const theme = themes[themeName];
    return theme;
  }

  getThemeName (): string {
    const systemThemeName = getDefaultThemeName();
    if (this.isOwned) {
      return (this.actor as InvestigatorActor).getSheetThemeName() || systemThemeName;
    } else {
      return systemThemeName;
    }
  }

  getNotes = () => {
    return this.data.data.notes ?? "";
  }

  setNotes = (notes: string) => {
    this.update({ data: { notes } });
  }

  getAbility = () => {
    assertWeaponDataSource(this.data);
    return this.data.data.ability ?? "";
  }

  setAbility = (ability: string) => {
    assertWeaponDataSource(this.data);
    this.update({ data: { ability } });
  }

  getPool = () => {
    assertAbilityDataSource(this.data);
    return this.data.data.pool ?? 0;
  }

  setPool = (pool: number) => {
    assertAbilityDataSource(this.data);
    this.update({ data: { pool } });
  }

  getBoost = () => {
    assertAbilityDataSource(this.data);
    return this.data.data.boost ?? 0;
  }

  setBoost = (boost: boolean) => {
    assertAbilityDataSource(this.data);
    this.update({ data: { boost } });
  }

  getDamage = () => {
    assertWeaponDataSource(this.data);
    return this.data.data.damage ?? 0;
  }

  setDamage = (damage: number) => {
    assertWeaponDataSource(this.data);
    this.update({ data: { damage } });
  }

  getPointBlankDamage = () => {
    assertWeaponDataSource(this.data);
    return this.data.data.pointBlankDamage ?? 0;
  }

  setPointBlankDamage = (pointBlankDamage: number) => {
    assertWeaponDataSource(this.data);
    this.update({ data: { pointBlankDamage } });
  }

  getCloseRangeDamage = () => {
    assertWeaponDataSource(this.data);
    return this.data.data.closeRangeDamage ?? 0;
  }

  setCloseRangeDamage = (closeRangeDamage: number) => {
    assertWeaponDataSource(this.data);
    this.update({ data: { closeRangeDamage } });
  }

  getNearRangeDamage = () => {
    assertWeaponDataSource(this.data);
    return this.data.data.nearRangeDamage ?? 0;
  }

  setNearRangeDamage = (nearRangeDamage: number) => {
    assertWeaponDataSource(this.data);
    this.update({ data: { nearRangeDamage } });
  }

  getLongRangeDamage = () => {
    assertWeaponDataSource(this.data);
    return this.data.data.longRangeDamage ?? 0;
  }

  setLongRangeDamage = (longRangeDamage: number) => {
    assertWeaponDataSource(this.data);
    this.update({ data: { longRangeDamage } });
  }

  getIsPointBlank = () => {
    assertWeaponDataSource(this.data);
    return this.data.data.isPointBlank;
  }

  setIsPointBlank = (isPointBlank: boolean) => {
    assertWeaponDataSource(this.data);
    this.update({ data: { isPointBlank } });
  }

  getIsCloseRange = () => {
    assertWeaponDataSource(this.data);
    return this.data.data.isCloseRange;
  }

  setIsCloseRange = (isCloseRange: boolean) => {
    assertWeaponDataSource(this.data);
    this.update({ data: { isCloseRange } });
  }

  getIsNearRange = () => {
    assertWeaponDataSource(this.data);
    return this.data.data.isNearRange;
  }

  setIsNearRange = (isNearRange: boolean) => {
    assertWeaponDataSource(this.data);
    this.update({ data: { isNearRange } });
  }

  getIsLongRange = () => {
    assertWeaponDataSource(this.data);
    return this.data.data.isLongRange;
  }

  setIsLongRange = (isLongRange: boolean) => {
    assertWeaponDataSource(this.data);
    this.update({ data: { isLongRange } });
  }

  getHideIfZeroRated = () => {
    assertAbilityDataSource(this.data);
    return this.data.data.hideIfZeroRated;
  }

  setHideIfZeroRated = (hideIfZeroRated: boolean) => {
    assertAbilityDataSource(this.data);
    this.update({ data: { hideIfZeroRated } });
  }

  getMwTrumps = () => {
    assertGeneralAbilityDataSource(this.data);
    return this.data.data.mwTrumps;
  }

  setMwTrumps = (mwTrumps: string) => {
    assertGeneralAbilityDataSource(this.data);
    this.update({ data: { mwTrumps } });
  }

  getMwTrumpedBy = () => {
    assertGeneralAbilityDataSource(this.data);
    return this.data.data.mwTrumpedBy;
  }

  setMwTrumpedBy = (mwTrumpedBy: string) => {
    assertGeneralAbilityDataSource(this.data);
    this.update({ data: { mwTrumpedBy } });
  }

  getMwBenefits = () => {
    assertGeneralAbilityDataSource(this.data);
    return this.data.data.mwBenefits;
  }

  setMwBenefits = (mwBenefits: string) => {
    assertGeneralAbilityDataSource(this.data);
    this.update({ data: { mwBenefits } });
  }

  getMwDrawbacks = () => {
    assertGeneralAbilityDataSource(this.data);
    return this.data.data.mwDrawbacks;
  }

  setMwDrawbacks = (mwDrawbacks: string) => {
    assertGeneralAbilityDataSource(this.data);
    this.update({ data: { mwDrawbacks } });
  }

  getMwRefreshes = () => {
    assertGeneralAbilityDataSource(this.data);
    return this.data.data.mwRefreshes;
  }

  setMwRefreshes = (mwRefreshes: string) => {
    assertGeneralAbilityDataSource(this.data);
    this.update({ data: { mwRefreshes } });
  }

  getMwAutomaticSuccess = () => {
    assertGeneralAbilityDataSource(this.data);
    return this.data.data.mwAutomaticSuccess;
  }

  setMwAutomaticSuccess = (mwAutomaticSuccess: string) => {
    assertGeneralAbilityDataSource(this.data);
    this.update({ data: { mwAutomaticSuccess } });
  }
}

declare global {
  interface DocumentClassConfig {
    Item: typeof InvestigatorItem;
  }
}
