import { equipment, generalAbility, weapon } from "../constants";
import { isAbility } from "../functions";
import { GetterDict, TrailActorData, RecursivePartial, SetterDict, TrailItemData } from "../types";
import { confirmADoodleDo } from "./confirm";
import { TrailItem } from "./TrailItem";

export class TrailActor<T=TrailActorData> extends Actor<T> {
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

  _getters: GetterDict<TrailActorData>
  _setters: SetterDict<TrailActorData>

  /// ///////////////////////////////////////////////////////////////////////////
  // General data setters and getters

  getter = <T extends keyof TrailActorData>(field: T) => {
    if (this._getters[field] === undefined) {
      this._getters[field] = (() => (this.data.data as any)[field]) as any;
    }
    return this._getters[field];
  }

  setter = <T extends keyof TrailActorData>(field: T) => {
    if (this._setters[field] === undefined) {
      this._setters[field] = (val: any) => {
        this.update({ data: { [field]: val } });
      };
    }
    return this._setters[field];
  }

  confirmRefresh = () => {
    confirmADoodleDo(
      `Refresh all of ${this.data.name}'s abilities? This will reset every pool back to match the rating of the ability.`,
      "Refresh",
      "Cancel",
      "fa-sync",
      this.refresh,
    );
  }

  refresh = () => {
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

  confirmNuke = () => {
    confirmADoodleDo(
      `Nuke all of ${this.data.name}'s abilities and equipment?`,
      "Nuke it from orbit",
      "Whoops no!",
      "fa-radiation",
      () => this.nuke(),
    );
  }

  nuke = async () => {
    await this.deleteEmbeddedEntity(
      "OwnedItem",
      this.items.map(i => i.id),
    );
    window.alert("Nuked");
  }

  /// ///////////////////////////////////////////////////////////////////////////
  // ITEMS

  getAbilityByName (name: string) {
    return this.items.find((item) => isAbility(item) && item.name === name);
  }

  getEquipment () {
    return this.items.filter((item) => item.type === equipment);
  }

  getWeapons (): TrailItem[] {
    return this.items.filter((item) => item.type === weapon);
  }
}

/**
 * Keep "special" general abilities in sync with their corresponding resources
 */
Hooks.on("updateOwnedItem", (
  actor: TrailActor,
  itemData: ItemData<TrailItemData>,
  diff: RecursivePartial<ItemData<TrailItemData>>,
  options: Record<string, unknown>,
  userId: string,
) => {
  // love 2 sink into a pit of imperative code
  if (itemData.type === generalAbility) {
    if (["Sanity", "Stability", "Health", "Magic"].includes(itemData.name)) {
      if (diff.data.pool !== undefined || diff.data.rating !== undefined) {
        actor.update({
          data: {
            resources: {
              [itemData.name.toLowerCase()]: {
                value: itemData.data.pool,
                max: itemData.data.rating,
              },
            },
          },
        });
      }
    }
  }
});
