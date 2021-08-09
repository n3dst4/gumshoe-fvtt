import { assertInvestigativeAbility, fixLength, isAbility } from "../functions";
import { Theme, themes } from "../theme";
import { GumshoeActor } from "./GumshoeActor";
import { getDefaultThemeName } from "../settingsHelpers";
import { AbilityDataSource, assertAbilityDataSource, assertWeaponDataSource, InvestigativeAbilityDataSource } from "../types";

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class GumshoeItem extends Item {
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
      return (this.actor as GumshoeActor).getSheetThemeName() || systemThemeName;
    } else {
      return systemThemeName;
    }
  }

  getNotes = () => this.data.data.notes ?? ""
  setNotes = (notes: string) => this.update({ data: { notes } })

  getAbility = () => this.data.data.ability ?? ""
  setAbility = (ability: string) => this.update({ data: { ability } })

  getPool = () => this.data.data.pool ?? 0
  setPool = (pool: number) => this.update({ data: { pool } })

  getBoost = () => this.data.data.boost ?? 0
  setBoost = (boost: boolean) => this.update({ data: { boost } })

  getDamage = () => this.data.data.damage ?? 0
  setDamage = (damage: number) => this.update({ data: { damage } })

  getPointBlankDamage = () => this.data.data.pointBlankDamage ?? 0
  setPointBlankDamage = (pointBlankDamage: number) => this.update({ data: { pointBlankDamage } })

  getCloseRangeDamage = () => this.data.data.closeRangeDamage ?? 0
  setCloseRangeDamage = (closeRangeDamage: number) => this.update({ data: { closeRangeDamage } })

  getNearRangeDamage = () => this.data.data.nearRangeDamage ?? 0
  setNearRangeDamage = (nearRangeDamage: number) => this.update({ data: { nearRangeDamage } })

  getLongRangeDamage = () => this.data.data.longRangeDamage ?? 0
  setLongRangeDamage = (longRangeDamage: number) => this.update({ data: { longRangeDamage } })

  getIsPointBlank = () => this.data.data.isPointBlank
  setIsPointBlank = (isPointBlank: boolean) => this.update({ data: { isPointBlank } })

  getIsCloseRange = () => this.data.data.isCloseRange
  setIsCloseRange = (isCloseRange: boolean) => this.update({ data: { isCloseRange } })

  getIsNearRange = () => this.data.data.isNearRange
  setIsNearRange = (isNearRange: boolean) => this.update({ data: { isNearRange } })

  getIsLongRange = () => this.data.data.isLongRange
  setIsLongRange = (isLongRange: boolean) => this.update({ data: { isLongRange } })
}

declare global {
  interface DocumentClassConfig {
    Item: typeof GumshoeItem;
  }
}
