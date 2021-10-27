/** @jsx jsx */
import {
  jsx,
} from "@emotion/react";
import ReactDOM from "react-dom";
import {
  assertGame,
} from "../../functions";
import * as constants from "../../constants";
import { isAbilityCardMode } from "./types";
import { AbilityTestCard } from "./AbilityTestCard";

export const installAbilityCardChatWrangler = () => {
  Hooks.on("renderChatMessage", (chatMessage, html, options) => {
    assertGame(game);
    const el: HTMLElement|undefined = html.find(`.${constants.abilityChatMessageClassName}`).get(0);
    if (el === undefined) {
      return;
    }
    // this seems clunky but I can't see a way to pass arbitrary data through
    // rolls or chat messages. at least this way to filth is confined to this
    // handler - we grab the actor and ability here and pass them on to the
    // component, which can just think in terms of the data.
    const abilityId = el.getAttribute(constants.htmlDataItemId);
    const actorId = el.getAttribute(constants.htmlDataActorId);
    const mode = el.getAttribute(constants.htmlDataMode);
    const weaponId = el.getAttribute(constants.htmlDataWeaponId);
    const rangeName = el.getAttribute(constants.htmlDataRange);
    if (abilityId === null) {
      logger.error(
        `Ability test chat message found with no '${constants.htmlDataItemId}' attribute.`,
        el,
      );
      return;
    }
    if (actorId === null) {
      logger.error(
        `Ability test chat message found with no '${constants.htmlDataActorId}' attribute.`,
        el,
      );
      return;
    }
    if (mode === null || !isAbilityCardMode(mode)) {
      logger.error(
        `Ability test chat message found withou a valid '${constants.htmlDataMode}' attribute. (Valid values are "test", "spend", "combat"`,
        el,
      );
      return;
    }
    const actor = game.actors?.get(actorId);
    const ability = actor?.items.get(abilityId);
    const weapon = weaponId ? actor?.items.get(weaponId) : undefined;
    if (el && abilityId && ability) {
      ReactDOM.render(
        <AbilityTestCard
          msg={chatMessage}
          ability={ability}
          mode={mode}
          weapon={weapon}
          rangeName={rangeName ?? undefined}
        />,
        el,
      );
    }
  });
};
