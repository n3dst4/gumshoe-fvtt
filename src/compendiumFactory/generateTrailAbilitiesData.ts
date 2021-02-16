import system from "../system.json";
import {
  BaseAbilityDump,
  GeneralAbilityTemplate,
  InvestigativeAbilityTemplate,
} from "./types";
import * as trailData from "./trailData";

export const emptyPack = async (pack: any) => {
  const content = await pack.getContent();
  content.forEach((item: Entity) => {
    item.delete();
  });
};

export const generateCompendiousAbilities = async <
  T extends InvestigativeAbilityTemplate | GeneralAbilityTemplate
>(
  abilityData: BaseAbilityDump<T>,
  template: T,
) => {
  const pack = game.packs.find(
    (p: any) => p.collection === `${system.name}.trailOfCthulhuAbilities`,
  );
  // const invFolder;

  Object.keys(abilityData).forEach(
    async (category: keyof typeof abilityData) => {
      // const folder = await Folder.create({ name: category, type: "Item" }, { temporary: true });
      const abilityDatas = abilityData[category].map((data: any) => {
        const { name, type, ...rest } = data;
        return {
          type: template.type,
          name,
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
    await generateCompendiousAbilities(trailData.investigativeAbilities, trailData.investigativeTemplate);
    await generateCompendiousAbilities(trailData.generalAbilities, trailData.generalTemplate);
  };
};
