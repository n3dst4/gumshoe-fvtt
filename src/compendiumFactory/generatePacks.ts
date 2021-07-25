import {
  BaseAbilityDump,
  GeneralAbilityTemplate,
  InvestigativeAbilityTemplate,
} from "./types";
import * as trailData from "./trailData";
import * as nbaData from "./nbaData";
import * as fearData from "./fearData";
import * as ashenData from "./ashenData";
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
      // const folder = await Folder.create({ name: category, type: "Item" }, { temporary: true });
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
      for (const item of (items as unknown) as Entity<any>[]) {
        await pack.importEntity(item);
        console.log(
          `Imported Item ${item.name} into Compendium pack ${pack.collection}`,
        );
      }
    },
  );
};

export const initializePackGenerators = () => {
  (window as any).generateTrailAbilities = async () => {
    const pack = findPack(packNames.pathOfCthulhuAbilities);
    emptyPack(pack);
    await generatePacks(trailData.investigativeAbilities, trailData.investigativeTemplate, pack);
    await generatePacks(trailData.generalAbilities, trailData.generalTemplate, pack);
  };
  (window as any).generateNBAAbilities = async () => {
    const pack = findPack(packNames.niceBlackAgentsAbilities);
    emptyPack(pack);
    await generatePacks(nbaData.investigativeAbilities, nbaData.investigativeTemplate, pack);
    await generatePacks(nbaData.generalAbilities, nbaData.generalTemplate, pack);
  };
  (window as any).generateFearAbilities = async () => {
    const pack = findPack(packNames.nothingToFearAbilities);
    emptyPack(pack);
    await generatePacks(fearData.investigativeAbilities, fearData.investigativeTemplate, pack);
    await generatePacks(fearData.generalAbilities, fearData.generalTemplate, pack);
  };
  (window as any).generateAshenAbilities = async () => {
    const pack = findPack(packNames.pallidStarsAbilities);
    emptyPack(pack);
    await generatePacks(ashenData.investigativeAbilities, ashenData.investigativeTemplate, pack);
    await generatePacks(ashenData.generalAbilities, ashenData.generalTemplate, pack);
  };
};
