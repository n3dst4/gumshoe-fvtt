import { assertGame, fixLength, isAbility } from "../functions";
import { themes } from "../themes/themes";
import { Theme } from "../themes/types";
import { InvestigatorActor } from "./InvestigatorActor";
import { getDefaultThemeName } from "../settingsHelpers";
import {
  assertAbilityDataSource,
  assertGeneralAbilityDataSource,
  assertMwItemDataSource,
  assertWeaponDataSource,
  MWDifficulty,
  MwRefreshGroup,
  MwType,
  RangeTuple,
} from "../types";
import * as constants from "../constants";
import { escape } from "html-escaper";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { turndown } from "../turndown";

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class InvestigatorItem extends Item {
  /**
   * classic gumshoe test: spend a number of points from the pool, and add that
   * to a d6
   */
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
          ${constants.htmlDataName}="${this.data.name}"
          ${constants.htmlDataImageUrl}="${this.data.img}"
        />
      `,
    });
    this.update({ data: { pool: this.data.data.pool - Number(spend) || 0 } });
  }

  /**
   * gumshoe spend - no dice, just spend a number of points in exchange for some
   * goodies
   */
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
          ${constants.htmlDataName}="${this.data.name}"
          ${constants.htmlDataImageUrl}="${this.data.img}"
        />
      `,
    });
    this.update({ data: { pool: this.data.data.pool - Number(spend) || 0 } });
  }

  /**
   * DERPG/"Moribund World" style roll - d6 +/- a difficulty modifier, with an
   * additional boon or levy on the pool. can be re-rolled for one extra point.
   */
  async mwTestAbility (difficulty: MWDifficulty, boonLevy: number, reRoll: number | null = null) {
    assertGame(game);
    assertAbilityDataSource(this.data);
    if (this.actor === null) { return; }
    const diffMod = (difficulty === "easy") ? 0 : difficulty;
    const operator = diffMod < 0 ? "-" : "+";
    const roll = diffMod === 0
      ? new Roll("1d6")
      : new Roll(`1d6 ${operator} @diffMod`, { diffMod: Math.abs(diffMod) });
    await roll.evaluate({ async: true });
    const cost = (reRoll === 1 ? 4 : reRoll === null ? 0 : 1) - boonLevy;
    if (cost > this.data.data.pool) {
      ui.notifications?.error(`Attempted to ${reRoll ? `re-roll a ${reRoll} with` : "roll"} ${this.data.name} with a levy of ${boonLevy} but pool is currently at ${this.data.data.pool}`);
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
          ${constants.htmlDataMwReRoll} = ${reRoll === null ? '""' : reRoll}
          ${constants.htmlDataMwPool} = ${newPool}
        />
      `,
    });
    this.update({ data: { pool: newPool } });
  }

  mWNegateIllustrious () {
    assertAbilityDataSource(this.data);
    const newPool = Math.max(0, this.data.data.pool - constants.mwNegateCost);
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

  async mWWallop () {
    assertAbilityDataSource(this.data);
    const newPool = Math.max(0, this.data.data.pool - constants.mwWallopCost);
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
  refreshPool () {
    assertAbilityDataSource(this.data);
    this.update({
      data: {
        pool: this.data.data.rating ?? 0,
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
    assertAbilityDataSource(this.data);
    return this.data.data.category;
  }

  setCategory = (category: string) => {
    assertAbilityDataSource(this.data);
    this.update({ data: { category } });
  }

  getMin = () => {
    assertAbilityDataSource(this.data);
    return this.data.data.min;
  }

  setMin = (min: number) => {
    assertAbilityDataSource(this.data);
    this.update({ data: { min } });
  }

  getMax = () => {
    assertAbilityDataSource(this.data);
    return this.data.data.max;
  }

  setMax = (max: number) => {
    assertAbilityDataSource(this.data);
    this.update({ data: { max } });
  }

  getOccupational = () => {
    assertAbilityDataSource(this.data);
    return this.data.data.occupational;
  }

  setOccupational = (occupational: boolean) => {
    assertAbilityDataSource(this.data);
    this.update({ data: { occupational } });
  }

  getCanBeInvestigative = () => {
    assertGeneralAbilityDataSource(this.data);
    return this.data.data.canBeInvestigative;
  }

  setCanBeInvestigative = (canBeInvestigative: boolean) => {
    assertAbilityDataSource(this.data);
    this.update({ data: { canBeInvestigative } });
  }

  getShowTracker = () => {
    assertAbilityDataSource(this.data);
    return this.data.data.showTracker;
  }

  setShowTracker = (showTracker: boolean) => {
    assertAbilityDataSource(this.data);
    this.update({ data: { showTracker } });
  }

  getExcludeFromGeneralRefresh = () => {
    assertAbilityDataSource(this.data);
    return this.data.data.excludeFromGeneralRefresh;
  }

  setExcludeFromGeneralRefresh = (excludeFromGeneralRefresh: boolean) => {
    assertAbilityDataSource(this.data);
    this.update({ data: { excludeFromGeneralRefresh } });
  }

  getRefreshesDaily = () => {
    assertAbilityDataSource(this.data);
    return this.data.data.refreshesDaily;
  }

  setRefreshesDaily = (refreshesDaily: boolean) => {
    assertAbilityDataSource(this.data);
    this.update({ data: { refreshesDaily } });
  }

  getGoesFirstInCombat = () => {
    assertGeneralAbilityDataSource(this.data);
    return this.data.data.goesFirstInCombat;
  }

  setGoesFirstInCombat = (goesFirstInCombat: boolean) => {
    assertAbilityDataSource(this.data);
    this.update({ data: { goesFirstInCombat } });
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

  setNotesFormat = (newFormat: NoteFormat) => {
    const oldFormat = this.data.data.notes.format;
    const oldSource = this.data.data.notes.source;
    let newSource = "";
    let newHtml = "";
    if (newFormat === oldFormat) {
      return;
    }
    if (newFormat === NoteFormat.plain) {
      if (oldFormat === NoteFormat.markdown) {
        newSource = oldSource;
      } else if (oldFormat === NoteFormat.richText) {
        newSource = turndown(oldSource);
      }
      newHtml = escape(newSource);
    } else if (newFormat === NoteFormat.markdown) {
      if (oldFormat === NoteFormat.plain) {
        newSource = oldSource;
      } else if (oldFormat === NoteFormat.richText) {
        newSource = turndown(oldSource);
      }
      newHtml = marked(newSource);
    } else if (newFormat === NoteFormat.richText) {
      if (oldFormat === NoteFormat.plain) {
        newSource = escape(oldSource);
      } else if (oldFormat === NoteFormat.markdown) {
        newSource = marked(oldSource);
      }
      newHtml = newSource;
    }
    const html = DOMPurify.sanitize(newHtml);
    this.update({
      data: {
        notes: { format: newFormat, source: newSource, html },
      },
    });
  }

  setNotesSource = (source: string) => {
    const format = this.data.data.notes.format;
    let newHtml = "";
    if (format === NoteFormat.plain) {
      newHtml = escape(source);
    } else if (format === NoteFormat.markdown) {
      newHtml = marked.parse(source);
    } else if (format === NoteFormat.richText) {
      newHtml = source;
    }
    const html = DOMPurify.sanitize(newHtml);
    this.update({ data: { notes: { format, source, html } } });
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

  // ---------------------------------------------------------------------------
  // MW specific fields

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

  getMwType = () => {
    assertMwItemDataSource(this.data);
    return this.data.data.mwType;
  }

  setMwType = (mwType: MwType) => {
    assertMwItemDataSource(this.data);
    this.update({ data: { mwType } });
  }

  getCharges = () => {
    assertMwItemDataSource(this.data);
    return this.data.data.charges;
  }

  setCharges = (charges: number) => {
    assertMwItemDataSource(this.data);
    this.update({ data: { charges } });
  }

  getRanges = () => {
    assertMwItemDataSource(this.data);
    return this.data.data.ranges;
  }

  getRange = (range: 0|1|2|3) => {
    assertMwItemDataSource(this.data);
    return this.data.data.ranges[range];
  }

  setRanges = (ranges: [number, number, number, number]) => {
    assertMwItemDataSource(this.data);
    this.update({ data: { ranges } });
  }

  setRange = (range: 0|1|2|3) => (value: number) => {
    assertMwItemDataSource(this.data);
    const ranges = [...this.data.data.ranges] as RangeTuple;
    ranges[range] = value;
    this.update({ data: { ranges } });
  }

  getMwRefreshGroup= () => {
    assertGeneralAbilityDataSource(this.data);
    return this.data.data.mwRefreshGroup;
  }

  setMwRefreshGroup = (mwRefreshGroup: MwRefreshGroup) => {
    assertGeneralAbilityDataSource(this.data);
    this.update({ data: { mwRefreshGroup } });
  }
}

declare global {
  interface DocumentClassConfig {
    Item: typeof InvestigatorItem;
  }
}
