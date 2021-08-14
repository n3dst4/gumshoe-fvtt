import { equipment, generalAbility, investigativeAbility, pc, weapon } from "../constants";
import { assertGame, isAbility } from "../functions";
import { RecursivePartial, AbilityType, InvestigatorItemDataSource, assertPCDataSource, assertPartyDataSource, InvestigativeAbilityDataSource } from "../types";
import { confirmADoodleDo } from "./confirm";
import { Theme, themes } from "../theme";
import { getDefaultThemeName, getNewPCPacks } from "../settingsHelpers";

export class GumshoeActor extends Actor {
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
      if ((item.data.type === generalAbility || item.data.type === investigativeAbility) && item.data.data.rating !== item.data.data.pool) {
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
    await this.deleteEmbeddedDocuments(
      "OwnedItem",
      this.items.map((i) => i.id).filter(i => i !== null) as string[],
    );
    window.alert("Nuked");
  };

  /// ///////////////////////////////////////////////////////////////////////////
  // ITEMS

  getAbilityByName (name: string, type?: AbilityType) {
    return this.items.find(
      (item) =>
        (type ? item.data.type === type : isAbility(item)) && item.name === name,
    );
  }

  getAbilityRatingByName (name: string) {
    return this.getAbilityByName(name)?.getRating() ?? 0;
  }

  getEquipment () {
    return this.items.filter((item) => item.type === equipment);
  }

  getWeapons () {
    return this.items.filter((item) => item.type === weapon);
  }

  getAbilities () {
    return this.items.filter((item) => isAbility(item));
  }

  getTrackerAbilities () {
    return this.getAbilities().filter(
      (item) => {
        const data = item.data;
        return (data.type === investigativeAbility || data.type === generalAbility) && data.data.showTracker;
      },
    );
  }

  // ---------------------------------------------------------------------------
  // THEME

  getSheetTheme (): Theme {
    const themeName = this.getSheetThemeName() || getDefaultThemeName();
    const theme = themes[themeName];
    if (theme !== undefined) {
      return theme;
    } else {
      return themes[getDefaultThemeName()];
    }
  }

  getSheetThemeName (): string | null {
    return this.data.type === "pc" ? this.data.data.sheetTheme : null;
  }

  setSheetTheme = (sheetTheme: string | null) =>
    this.update({ data: { sheetTheme } });

  getLongNote = (i: number) => {
    assertPCDataSource(this.data);
    return this.data.data.longNotes?.[i] ?? "";
  }

  getLongNotes = () => {
    assertPCDataSource(this.data);
    return this.data.data.longNotes ?? [];
  }

  setLongNote = (i: number, text: string) => {
    assertPCDataSource(this.data);
    const newNotes = [...(this.data.data.longNotes || [])];
    newNotes[i] = text;
    this.update({
      data: {
        longNotes: newNotes,
      },
    });
  };

  getShortNote = (i: number) => {
    assertPCDataSource(this.data);
    return this.data.data.shortNotes?.[i] ?? "";
  }

  getShortNotes = () => {
    assertPCDataSource(this.data);
    return this.data.data.shortNotes ?? [];
  }

  setShortNote = (i: number, text: string) => {
    assertPCDataSource(this.data);
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

  getActorIds = () => {
    assertPartyDataSource(this.data);
    return this.data.data.actorIds;
  }

  setActorIds = (actorIds: string[]) => {
    assertPartyDataSource(this.data);
    this.update({ data: { actorIds } });
  };

  getActors = () => {
    return this.getActorIds().map((id) => {
      assertGame(game);
      return game.actors?.get(id);
    }).filter((actor) => actor !== undefined) as Actor[];
  }

  addActorIds = (newIds: string[]) => {
    const currentIds = this.getActorIds();
    const effectiveIds = (newIds
      .map((id) => {
        assertGame(game);
        return game.actors?.get(id);
      })
      .filter(
        (actor) => actor !== undefined && actor.id !== null && actor.data.type === pc && !currentIds.includes(actor.id),
      ) as Actor[])
      .map((actor) => actor.id) as string[];
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

declare global {
  interface DocumentClassConfig {
    Actor: typeof GumshoeActor;
  }
}

/**
 * Keep "special" general abilities in sync with their corresponding resources
 */
Hooks.on("updateOwnedItem", (
  actor: GumshoeActor,
  itemData: InvestigatorItemDataSource,
  // this seems like a fib, but I can't see what else to type this as
  diff: RecursivePartial<InvestigativeAbilityDataSource>,
  options: Record<string, unknown>,
  userId: string,
) => {
  assertGame(game);
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
    assertGame(game);
    if (game.userId !== userId) return;

    if (actor.items.size > 0) {
      return;
    }

    if (actor.data.type !== pc) {
      return;
    }

    // this used to be done in parallel with Promise.all but I was seeing some
    // weird behaviour (duplicated or missing abilities, or weird reference
    // errors) so I have switched it to inline to see if that helps
    for (const packId of getNewPCPacks()) {
      assertGame(game);
      console.log("PACK", packId);
      // this was previously using getContent
      const content = await (game.packs?.find((p: any) => p.collection === packId)?.getDocuments());
      // const datas = content?.map(({ data: { name, img, data, type } }) => ({
      //   name,
      //   img,
      //   data,
      //   type,
      // }));
      const datas = content?.map((document) => {
        const obj = {
          name: document.data.name,
          img: document.data.img,
          data: document.data.data,
          type: document.data.type,
        };
        return obj;
      });
      console.log("datas", datas);
      await (actor as any).createEmbeddedDocuments("Item", datas);
      // createEmbeddedDocuments("Item", itemDataArray)
    }
    console.log("COMPLETED");
  },
);
