import { equipment, weapon } from "../constants";
import { isAbility } from "../functions";

export class TrailActor extends Actor<any> {
  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData (): void {
    super.prepareData();

    const actorData = this.data;
    // const data = actorData.data;
    // const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === "character") this._prepareCharacterData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData (actorData: any): any {
    // const data = actorData.data;

    // Make modifications to data here. For example:

    // Loop through ability scores, and add their modifiers to our sheet output.
    // for (let [key, ability] of Object.entries(data.abilities)) {
    //   // Calculate the modifier using d20 rules.
    //   ability.mod = Math.floor((ability.value - 10) / 2);
    // }
  }

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

  getAbilityByName (name: string) {
    return this.items.find((item) => isAbility(item) && item.name === name);
  }

  getEquipment () {
    return this.items.filter((item) => item.type === equipment);
  }

  getWeapons () {
    return this.items.filter((item) => item.type === weapon);
  }

  getNotes () {
    return this.data.data.notes || "";
  }

  setNotes = (notes: string) => {
    this.update({
      data: {
        notes,
      },
    });
  }
}
