import {
  BaseAbilityDump,
  GeneralAbilityTemplate,
  InvestigativeAbilityTemplate,
} from "./types";
import * as pathOfCthulhuData from "./pathOfCthulhuData";
import * as niceBlackAgentsData from "./niceBlackAgentsData";
import * as nothingToFearData from "./nothingToFearData";
import * as pallidStarsData from "./pallidStarsData";
import { packNames, systemName } from "../constants";

export const emptyPack = async (pack: any) => {
  const content = await pack.getContent();
  content.forEach((item: Entity) => {
    item.delete();
  });
};

export const findPack = (packName: string) => {
  const pack = game.packs.find(
    (p: any) => p.collection === `${systemName}.${packName}`,
  );
  return pack;
};

export const generatePacks = async <
  T extends InvestigativeAbilityTemplate | GeneralAbilityTemplate
>(
  abilityData: BaseAbilityDump<T>,
  template: T,
  pack: any,
) => {
  // const invFolder;

  Object.keys(abilityData).forEach(
    async (category: keyof typeof abilityData) => {
      const abilityDatas = abilityData[category].map((data: any) => {
        const { name, type, img, ...rest } = data;
        return {
          type: template.type,
          name,
          img: img ?? template.img,
          // folder: folder.id,
          data: {
            ...template,
            category,
            ...rest,
          },
        };
      });
      const items = await Item.create(abilityDatas, { temporary: true });
      // await pack.importEntity(folder);//
      for (const item of items as unknown as Entity<any>[]) {
        await pack.importEntity(item);
        console.log(
          `Imported Item ${item.name} into Compendium pack ${pack.collection}`,
        );
      }
    },
  );
};

export const initializePackGenerators = () => {
  window.generatePacks = {
    pathOfCthulhu: async () => {
      const pack = findPack(packNames.pathOfCthulhuAbilities);
      emptyPack(pack);
      await generatePacks(
        pathOfCthulhuData.investigativeAbilities,
        pathOfCthulhuData.investigativeTemplate,
        pack,
      );
      await generatePacks(
        pathOfCthulhuData.generalAbilities,
        pathOfCthulhuData.generalTemplate,
        pack,
      );
    },
    niceBlackAgents: async () => {
      const pack = findPack(packNames.niceBlackAgentsAbilities);
      emptyPack(pack);
      await generatePacks(
        niceBlackAgentsData.investigativeAbilities,
        niceBlackAgentsData.investigativeTemplate,
        pack,
      );
      await generatePacks(
        niceBlackAgentsData.generalAbilities,
        niceBlackAgentsData.generalTemplate,
        pack,
      );
    },
    nothingToFear: async () => {
      const pack = findPack(packNames.nothingToFearAbilities);
      emptyPack(pack);
      await generatePacks(
        nothingToFearData.investigativeAbilities,
        nothingToFearData.investigativeTemplate,
        pack,
      );
      await generatePacks(
        nothingToFearData.generalAbilities,
        nothingToFearData.generalTemplate,
        pack,
      );
    },
    pallidStars: async () => {
      const pack = findPack(packNames.pallidStarsAbilities);
      emptyPack(pack);
      await generatePacks(
        pallidStarsData.investigativeAbilities,
        pallidStarsData.investigativeTemplate,
        pack,
      );
      await generatePacks(
        pallidStarsData.generalAbilities,
        pallidStarsData.generalTemplate,
        pack,
      );
    },
  };
};

declare global {
  interface Window {
    generatePacks: {
      pathOfCthulhu(): Promise<void>,
      niceBlackAgents(): Promise<void>,
      nothingToFear(): Promise<void>,
      pallidStars(): Promise<void>,
    };
  }
}
