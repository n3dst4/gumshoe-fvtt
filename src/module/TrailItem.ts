import { fixLength, isAbility } from "../functions";
import { Theme, themes } from "../theme";
import { GetterDict, SetterDict, ThemeName, TrailItemData } from "../types";
import { TrailActor } from "./TrailActor";
import system from "../system.json";
import { defaultTheme } from "../constants";

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class TrailItem extends Item<any> {
  constructor (data, options) {
    super(data, options);
    this._getters = {};
    this._setters = {};
  }

  _getters: GetterDict<TrailItemData>
  _setters: SetterDict<TrailItemData>

  getter = <T extends keyof TrailItemData>(field: T) => {
    if (this._getters[field] === undefined) {
      this._getters[field] = () => this.data.data[field];
    }
    return this._getters[field];
  }

  setter = <T extends keyof TrailItemData>(field: T) => {
    if (this._setters[field] === undefined) {
      this._setters[field] = (val: any) => {
        this.update({ data: { [field]: val } });
      };
    }
    return this._setters[field];
  }

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

  assertAbility () {
    if (!isAbility(this)) {
      throw new Error(`${this.type} is not an ability`);
    }
  }

  refreshPool () {
    this.assertAbility();
    this.update({
      data: {
        pool: this.data.data.rating ?? 0,
      },
    });
  }

  getSpecialities = () => {
    this.assertAbility();
    return fixLength(this.data.data.specialities, this.data.data.rating, "");
  }

  setSpecialities = (newSpecs: string[]) => {
    this.assertAbility();
    this.update({
      data: {
        specialities: fixLength(newSpecs, this.data.data.rating, ""),
      },
    });
  }

  getRating = (): number => {
    this.assertAbility();
    if (!isAbility(this)) {
      throw new Error(`${this.type} does not have a rating`);
    }
    return this.data.data.rating ?? 0;
  }

  setRating = (newRating: number) => {
    this.assertAbility();
    this.update({
      data: {
        rating: newRating,
        specialities: fixLength(this.data.data.specialities, newRating, ""),
      },
    });
  }

  getHasSpecialities = () => {
    this.assertAbility();
    return this.data.data.hasSpecialities ?? false;
  }

  setHasSpecialities = (hasSpecialities: boolean) => {
    this.assertAbility();
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
    return this.data.data.ammo?.value || 0;
  }

  reload = () => {
    this.update({
      data: {
        ammo: {
          value: this.getAmmoMax(),
        },
      },
    });
  }

  getDamage = () => this.data.data.damage ?? 0

  setAmmoPerShot = (ammoPerShot: number) => this.update({
    data: { ammoPerShot },
  })

  getAmmoPerShot = () => this.data.data.ammoPerShot ?? 1

  getUsesAmmo = () => this.data.data.usesAmmo ?? false

  setUsesAmmo = (usesAmmo: boolean) => this.update({
    data: { usesAmmo },
  })

  // ---------------------------------------------------------------------------
  // THEME

  getTheme (): Theme {
    return themes[this.getThemeName()];
  }

  getThemeName (): ThemeName {
    if (this.isOwned) {
      return (this.actor as TrailActor).getThemeName();
    } else {
      return game.settings.get(system.name, defaultTheme);
    }
  }
}
