import { equipmentIcon, generalAbilityIcon, investigativeAbilityIcon, weaponIcon } from "../constants";
import { assertGame, isNullOrEmptyString } from "../functions";
import { isWeaponDataSource, isGeneralAbilityDataSource, isEquipmentDataSource } from "../typeAssertions";

export const installItemImageHookHandler = () => {
  Hooks.on(
    "preCreateItem",
    (
      item: Item,
      createData: { name: string, type: string, data?: any, img?: string },
      options: any,
      userId: string,
    ) => {
      assertGame(game);
      if (game.userId !== userId) return;

      // set image
      if (
        isNullOrEmptyString(item.data.img) ||
        item.data.img === "icons/svg/item-bag.svg"
      ) {
        item.data.update({
          img: isWeaponDataSource(item.data)
            ? weaponIcon
            : isEquipmentDataSource(item.data)
              ? equipmentIcon
              : isGeneralAbilityDataSource(item.data)
                ? generalAbilityIcon
                : investigativeAbilityIcon,
        });
      }
    },
  );
};
