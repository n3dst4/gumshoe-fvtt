import { equipment, weapon } from "../constants";
import { isAbility } from "../functions";
import { PCTrailActorData } from "../types";

type GetterDict<T> = {
  [P in keyof T]?: () => T[P];
}

type SetterDict<T> = {
  [P in keyof T]?: (val: T[P]) => void;
}

export class TrailActor extends Actor<any> {
  constructor (data, options) {
    super(data, options);
    this._getters = {};
    this._setters = {};
  }

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData (): void {
    super.prepareData();
  }

  _getters: GetterDict<PCTrailActorData>
  _setters: SetterDict<PCTrailActorData>

  refresh () {
    this.items.forEach((item) => {
      if (item.data.data.rating !== item.data.data.pool) {
        item.update({
          data: {
            pool: item.data.data.rating,
          },
        });
      }
    });
  }

  /// ///////////////////////////////////////////////////////////////////////////
  // ITEMS

  getAbilityByName (name: string) {
    return this.items.find((item) => isAbility(item) && item.name === name);
  }

  getEquipment () {
    return this.items.filter((item) => item.type === equipment);
  }

  getWeapons () {
    return this.items.filter((item) => item.type === weapon);
  }

  /// ///////////////////////////////////////////////////////////////////////////
  // General data setters and getters

  getter = <T extends keyof PCTrailActorData>(field: T) => {
    if (this._getters[field] === undefined) {
      this._getters[field] = () => this.data.data[field];
    }
    return this._getters[field];
  }

  setter = <T extends keyof PCTrailActorData>(field: T) => {
    if (this._setters[field] === undefined) {
      this._setters[field] = (val: any) => {
        this.update({ data: { [field]: val } });
      };
    }
    return this._setters[field];
  }
}
