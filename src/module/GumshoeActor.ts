import { equipment, generalAbility, weapon } from "../constants";
import { isAbility } from "../functions";
import { TrailActorData, RecursivePartial, TrailItemData } from "../types";
import { confirmADoodleDo } from "./confirm";
import { GumshoeItem } from "./GumshoeItem";
import { Theme, themes } from "../theme";
import { getDefaultThemeName, getNewPCPacks } from "../settingsHelpers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class GumshoeActor<T = any> extends Actor<TrailActorData> {
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
  };

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
  };

  confirmNuke = () => {
    confirmADoodleDo(
      `Nuke all of ${this.data.name}'s abilities and equipment?`,
      "Nuke it from orbit",
      "Whoops no!",
      "fa-radiation",
      () => this.nuke(),
    );
  };

  nuke = async () => {
    await this.deleteEmbeddedEntity(
      "OwnedItem",
      this.items.map((i: GumshoeItem) => i.id),
    );
    window.alert("Nuked");
  };

  /// ///////////////////////////////////////////////////////////////////////////
  // ITEMS

  getAbilityByName (name: string) {
    return this.items.find(
      (item: GumshoeItem) => isAbility(item) && item.name === name,
    );
  }

  getEquipment () {
    return this.items.filter((item: GumshoeItem) => item.type === equipment);
  }

  getWeapons (): GumshoeItem[] {
    return this.items.filter((item: GumshoeItem) => item.type === weapon);
  }

  getAbilities (): GumshoeItem[] {
    return this.items.filter((item: GumshoeItem) => isAbility(item));
  }

  getTrackerAbilities (): GumshoeItem[] {
    return this.getAbilities().filter(
      (item: GumshoeItem) => item.data.data.showTracker,
    );
  }

  // ---------------------------------------------------------------------------
  // THEME

  getSheetTheme (): Theme {
    const themeName = this.getSheetThemeName() || getDefaultThemeName();
    return themes[themeName];
  }

  getSheetThemeName (): string | null {
    return this.data.data.sheetTheme;
  }

  setSheetTheme = (sheetTheme: string | null) =>
    this.update({ data: { sheetTheme } });

  getNotes = () => this.data.data.notes ?? "";
  setNotes = (notes: string) => this.update({ data: { notes } });

  getOccupationalBenefits = () => this.data.data.occupationalBenefits ?? "";
  setOccupationalBenefits = (occupationalBenefits: string) =>
    this.update({ data: { occupationalBenefits } });

  getPillarsOfSanity = () => this.data.data.pillarsOfSanity ?? "";
  setPillarsOfSanity = (pillarsOfSanity: string) =>
    this.update({ data: { pillarsOfSanity } });

  getSourcesOfStability = () => this.data.data.sourcesOfStability ?? "";
  setSourcesOfStability = (sourcesOfStability: string) =>
    this.update({ data: { sourcesOfStability } });

  getBackground = () => this.data.data.background ?? "";
  setBackground = (background: string) => this.update({ data: { background } });

  getLongNote = (i: number) => this.data.data.longNotes?.[i] ?? "";
  getLongNotes = () => this.data.data.longNotes ?? [];
  setLongNote = (i: number, text: string) => {
    const newNotes = [...(this.data.data.longNotes || [])];
    newNotes[i] = text;
    this.update({
      data: {
        longNotes: newNotes,
      },
    });
  };

  getShortNote = (i: number) => this.data.data.shortNotes?.[i] ?? "";
  getShortNotes = () => this.data.data.shortNotes ?? [];
  setShortNote = (i: number, text: string) => {
    const newNotes = [...(this.data.data.shortNotes || [])];
    newNotes[i] = text;
    this.update({
      data: {
        shortNotes: newNotes,
      },
    });
  };

  getName = () => this.name;
  setName = (name: string) => {
    this.update({ name });
  };

  getActorIds = () => this.data.data.actorIds;
  setActorIds = (actorIds: string[]) => {
    this.update({ data: { actorIds } });
  };

  getActors = () => this.getActorIds().map((id) => game.actors.get(id));
  addActorIds = (newIds: string[]) => {
    const currentIds = this.getActorIds();
    const effectiveIds = newIds.filter((id) => !currentIds.includes(id));
    this.setActorIds([...currentIds, ...effectiveIds]);
  };

  removeActorId = (id: string) => {
    this.setActorIds(this.getActorIds().filter((x) => x !== id));
  };

  // getGeneralAbilityNames = () => this.data.data.abilityNames;
  // setGeneralAbilityNames = (abilityNames: string[]) => {
  //   this.update({ data: { abilityNames } });
  // };

  // addGeneralAbilityNames = (newNames: string[]) => {
  //   const currentNames = this.getGeneralAbilityNames();
  //   const effectiveNames = newNames.filter(
  //     (name) => !currentNames.includes(name),
  //   );
  //   this.setGeneralAbilityNames([...currentNames, ...effectiveNames]);
  // };

  // getInvestigativeAbilityNames = () => this.data.data.abilityNames;
  // setInvestigativeAbilityNames = (abilityNames: string[]) => {
  //   this.update({ data: { abilityNames } });
  // };

  // addInvestigativeAbilityNames = (newNames: string[]) => {
  //   const currentNames = this.getInvestigativeAbilityNames();
  //   const effectiveNames = newNames.filter(
  //     (name) => !currentNames.includes(name),
  //   );
  //   this.setInvestigativeAbilityNames([...currentNames, ...effectiveNames]);
  // };
}

/**
 * Keep "special" general abilities in sync with their corresponding resources
 */
Hooks.on("updateOwnedItem", (
  actor: GumshoeActor,
  itemData: ItemData<TrailItemData>,
  diff: RecursivePartial<ItemData<TrailItemData>>,
  options: Record<string, unknown>,
  userId: string,
) => {
  if (game.userId !== userId) return;

  // love 2 sink into a pit of imperative code
  if (itemData.type === generalAbility) {
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
    actor: GumshoeActor,
    options: Record<string, unknown>,
    userId: string,
  ) => {
    if (game.userId !== userId) return;

    if (actor.items.size > 0) {
      return;
    }
    const proms = getNewPCPacks().map(async (packId) => {
      const content = await (game.packs
        .find((p: any) => p.collection === packId)
        .getContent());
      const datas = content.map((i: any) => i.data);
      await actor.createOwnedItem(datas);
    });
    await Promise.all(proms);
  },
);
