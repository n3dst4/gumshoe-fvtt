import { assertGame, isNullOrEmptyString } from "../functions";
import {
  getDefaultGeneralAbilityCategory,
  getDefaultInvestigativeAbilityCategory,
} from "../settings";
import { isAbilityItem, isGeneralAbilityItem } from "../v10Types";

export const installAbilityCategoryHookHandler = () => {
  Hooks.on(
    "preCreateItem",
    (
      item: Item,
      createData: { name: string; type: string; img?: string },
      options: any,
      userId: string,
    ) => {
      assertGame(game);
      if (game.userId !== userId) return;

      // ABILITIES
      if (isAbilityItem(item)) {
        const isGeneralAbility = isGeneralAbilityItem(item);
        // set category
        if (isNullOrEmptyString(item.system.category)) {
          const category = isGeneralAbility
            ? getDefaultGeneralAbilityCategory()
            : getDefaultInvestigativeAbilityCategory();
          console.log(
            `found ability "${createData.name}" with no category, updating to "${category}"`,
          );
          // @ts-expect-error v10 types
          item.updateSource({
            system: { category },
          });
        }
      }
    },
  );
};
