import { generalAbility } from "../constants";
import { assertGame } from "../functions";
import { assertAbilityItem } from "../v10Types";

export function installResourceUpdateHookHandler() {
  /**
   * Keep "special" general abilities in sync with their corresponding resources
   */
  Hooks.on(
    "updateItem",
    (
      item: Item,
      diff: any,
      options: Record<string, unknown>,
      userId: string,
    ) => {
      assertGame(game);
      assertAbilityItem(item);
      if (game.userId !== userId || item.actor === undefined) {
        return;
      }

      if (item.data.type === generalAbility) {
        if (
          ["Sanity", "Stability", "Health", "Magic"].includes(item.data.name)
        ) {
          if (
            diff.data?.pool !== undefined ||
            diff.data?.rating !== undefined
          ) {
            item.actor?.update({
              data: {
                resources: {
                  [item.data.name.toLowerCase()]: {
                    value: item.system.pool,
                    max: item.system.rating,
                  },
                },
              },
            });
          }
        }
      }
    },
  );
}
