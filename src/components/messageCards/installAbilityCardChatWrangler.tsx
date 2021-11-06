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
import { AttackCard } from "./AttackCard";
import { AbilityTestMwCard } from "./AbilityTestMwCard";
import { MWDifficulty } from "../../types";

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
    const actor = actorId && game.actors?.get(actorId);
    if (!actor) {
      logger.error(
        `Missing or invalid '${constants.htmlDataActorId}' attribute.`, el,
      );
      return;
    }
    const ability = abilityId && actor?.items.get(abilityId);
    if (!ability) {
      logger.error(
        `Missing or invalid '${constants.htmlDataItemId}' attribute.`,
        el,
      );
      return;
    }
    if (mode === null || !isAbilityCardMode(mode)) {
      logger.error(
        `Invalid '${constants.htmlDataMode}' attribute. (Valid values are "test", "spend", "combat")`,
        el,
      );
      return;
    }
    let content: JSX.Element;
    if (mode === constants.htmlDataModeAttack) {
      // ATTACK!!!!!!
      const weaponId = el.getAttribute(constants.htmlDataWeaponId);
      const rangeName = el.getAttribute(constants.htmlDataRange);
      if (!rangeName) {
        logger.error(
          `Missing or invalid '${constants.htmlDataRange}' attribute.`, el,
        );
        return;
      }
      const weapon = weaponId ? actor?.items.get(weaponId) : undefined;
      if (!weapon) {
        logger.error(
          `Missing or invalid '${constants.htmlDataWeaponId}' attribute.`, el,
        );
        return;
      }
      content = <AttackCard
        msg={chatMessage}
        ability={ability}
        weapon={weapon}
        rangeName={rangeName}
      />;
    } else if (mode === constants.htmlDataModeMwTest) {
      // MW TEST
      const difficultyAttr = el.getAttribute(constants.htmlDataMwDifficulty);
      const difficulty: MWDifficulty = difficultyAttr === "easy"
        ? "easy"
        : Number(difficultyAttr ?? 0);
      const boonLevy = Number(el.getAttribute(constants.htmlDataMwBoonLevy) ?? 0);
      const isReRoll = el.getAttribute(constants.htmlDataMwIsReRoll) === "true";
      const pool = Number(el.getAttribute(constants.htmlDataMwPool));
      content = <AbilityTestMwCard
        msg={chatMessage}
        ability={ability}
        difficulty={difficulty}
        boonLevy={boonLevy}
        isReRoll={isReRoll}
        pool={pool}
      />;
    } else {
      // REGULAR TEST /SPEND
      content = <AbilityTestCard
        msg={chatMessage}
        ability={ability}
        mode={mode}
      />;
    }
    ReactDOM.render(content, el);
  });
};
