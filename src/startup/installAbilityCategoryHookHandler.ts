import { assertGame, isNullOrEmptyString } from "../functions";
import {
  getDefaultGeneralAbilityCategory,
  getDefaultInvestigativeAbilityCategory,
} from "../settings";
import {
  isAbilityDataSource,
  isGeneralAbilityDataSource,
} from "../typeAssertions";

export const installAbilityCategoryHookHandler = () => {
  Hooks.on(
    "preCreateItem",
    (
      item: Item,
      createData: { name: string; type: string; data?: any; img?: string },
      options: any,
      userId: string,
    ) => {
      assertGame(game);
      if (game.userId !== userId) return;

      // ABILITIES
      if (isAbilityDataSource(item.data)) {
        const isGeneralAbility = isGeneralAbilityDataSource(item.data);
        // set category
        if (isNullOrEmptyString(item.system.category)) {
          const category = isGeneralAbility
            ? getDefaultGeneralAbilityCategory()
            : getDefaultInvestigativeAbilityCategory();
          console.log(
            `found ability "${createData.name}" with no category, updating to "${category}"`,
          );
          item.data.update({
            data: { category },
          });
        }
      }
    },
  );
};
