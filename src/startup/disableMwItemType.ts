import { settingsSaved } from "../constants";
import { assertGame } from "../functions";
import { getMwUseAlternativeItemTypes } from "../settingsHelpers";

let oldMwItemTypelabel: string|null = null;
let oldMwItemIndex: number|null = null;

/**
 * Remove or add the moribund-world-specific item type
 */
function mwItemOnOrOff () {
  assertGame(game);
  if (getMwUseAlternativeItemTypes()) {
    if (oldMwItemTypelabel !== null && oldMwItemIndex !== null) {
      CONFIG.Item.typeLabels.mwItem = oldMwItemTypelabel;
      game.system.documentTypes.Item.splice(oldMwItemIndex, 0, "mwItem");
      oldMwItemTypelabel = null;
      oldMwItemIndex = null;
    }
  } else {
    oldMwItemTypelabel = CONFIG.Item.typeLabels.mwItem;
    delete CONFIG.Item.typeLabels.mwItem;
    oldMwItemIndex = game.system.documentTypes.Item.indexOf("mwItem");
    game.system.documentTypes.Item.splice(oldMwItemIndex, 1);
  }
}

export const handleMwItemType = () => {
  // see https://gitlab.com/foundrynet/foundryvtt/-/issues/6977
  // hook handlers registered with `.once` and `.on` exhibit the "once"
  // behaviour for the "on" registration. This can be fixed by wrapping the
  // handler in an anon function. technically you'd only need to do this to one
  // or the other.
  Hooks.once("ready", () => { mwItemOnOrOff(); });
  Hooks.on(settingsSaved, () => { mwItemOnOrOff(); });
};
