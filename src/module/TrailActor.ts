import { defaultTheme, equipment, generalAbility, weapon } from "../constants";
import { isAbility } from "../functions";
import { TrailActorData, RecursivePartial, TrailItemData } from "../types";
import { confirmADoodleDo } from "./confirm";
import { TrailItem } from "./TrailItem";
import system from "../system.json";
import { Theme, themes } from "../theme";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TrailActor<T=any> extends Actor<TrailActorData> {
  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData (): void {
    super.prepareData();
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
      this.items.map((i: TrailItem) => i.id),
    );
    window.alert("Nuked");
  }

  /// ///////////////////////////////////////////////////////////////////////////
  // ITEMS

  getAbilityByName (name: string) {
    return this.items.find((item: TrailItem) => isAbility(item) && item.name === name);
  }

  getEquipment () {
    return this.items.filter((item: TrailItem) => item.type === equipment);
  }

  getWeapons (): TrailItem[] {
    return this.items.filter((item: TrailItem) => item.type === weapon);
  }

  getAbilities (): TrailItem[] {
    return this.items.filter((item: TrailItem) => isAbility(item));
  }

  getTrackerAbilities (): TrailItem[] {
    return this.getAbilities().filter((item: TrailItem) => item.data.data.showTracker);
  }

  // ---------------------------------------------------------------------------
  // THEME

  getSheetTheme (): Theme {
    const themeName = this.getSheetThemeName() || game.settings.get(system.name, defaultTheme);
    return themes[themeName];
  }

  getSheetThemeName (): string|null {
    return this.data.data.sheetTheme;
  }

  setSheetTheme = (sheetTheme: string|null) => this.update({ data: { sheetTheme } });

  getNotes = () => this.data.data.notes ?? ""
  setNotes = (notes: string) => this.update({ data: { notes } })

  getOccupationalBenefits = () => this.data.data.occupationalBenefits ?? ""
  setOccupationalBenefits = (occupationalBenefits: string) => this.update({ data: { occupationalBenefits } })

  getPillarsOfSanity = () => this.data.data.pillarsOfSanity ?? ""
  setPillarsOfSanity = (pillarsOfSanity: string) => this.update({ data: { pillarsOfSanity } })

  getSourcesOfStability = () => this.data.data.sourcesOfStability ?? ""
  setSourcesOfStability = (sourcesOfStability: string) => this.update({ data: { sourcesOfStability } })

  getBackground = () => this.data.data.background ?? ""
  setBackground = (background: string) => this.update({ data: { background } })
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
  if (itemData.type === generalAbility && userId === game.data.userId) {
    if (["Sanity", "Stability", "Health", "Magic"].includes(itemData.name)) {
      if (diff.data?.pool !== undefined || diff.data?.rating !== undefined) {
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

Hooks.on(
  "createActor",
  async (
    actor: TrailActor,
    options: Record<string, unknown>,
    userId: string,
  ) => {
    if (actor.items.size > 0) {
      return;
    }
    const investigative = (
      await game.packs
        .find((p: any) => p.collection === `${system.name}.investigativeAbilities`)
        .getContent()
    ).map((i: any) => i.data);
    const general = (
      await game.packs
        .find((p: any) => p.collection === `${system.name}.generalAbilities`)
        .getContent()
    ).map((i: any) => i.data);
    await actor.createOwnedItem(investigative);
    await actor.createOwnedItem(general);
  },
);
