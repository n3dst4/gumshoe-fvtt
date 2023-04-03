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
      // this seems like a fib, but I can't see what else to type this as
      // XXXV10: this used to be `RecursivePartial<InvestigativeAbilityDataSource> & { _id: string }`
      // and now it's even worse
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
