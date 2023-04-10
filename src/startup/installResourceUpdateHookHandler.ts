import { generalAbility } from "../constants";
import { assertGame } from "../functions";
import { InvestigativeAbilityDataSource, RecursivePartial } from "../types";

export function installResourceUpdateHookHandler() {
  /**
   * Keep "special" general abilities in sync with their corresponding resources
   */
  Hooks.on(
    "updateItem",
    (
      item: Item,
      // this seems like a fib, but I can't see what else to type this as
      diff: RecursivePartial<InvestigativeAbilityDataSource> & { _id: string },
      options: Record<string, unknown>,
      userId: string,
    ) => {
      assertGame(game);
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
                    value: item.data.data.pool,
                    max: item.data.data.rating,
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
