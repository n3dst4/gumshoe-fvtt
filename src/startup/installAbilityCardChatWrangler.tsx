import { createRoot } from "react-dom/client";
import { assertGame } from "../functions";
import * as constants from "../constants";
import { isAbilityCardMode } from "../components/messageCards/types";
import { AbilityTestCard } from "../components/messageCards/AbilityTestCard";
import { AttackCard } from "../components/messageCards/AttackCard";
import { AbilityTestMwCard } from "../components/messageCards/AbilityTestMwCard";
import { MWDifficulty } from "../types";
import { AbilityNegateOrWallopMwCard } from "../components/messageCards/AbilityNegateOrWallopMwCard";
import React, { StrictMode } from "react";

export const installAbilityCardChatWrangler = () => {
  Hooks.on("renderChatMessage", (chatMessage, html, options) => {
    assertGame(game);
    const el: HTMLElement | undefined = html
      .find(`.${constants.abilityChatMessageClassName}`)
      .get(0);
    if (el === undefined) {
      return;
    }
    // this seems clunky but I can't see a way to pass arbitrary data through
    // rolls or chat messages. at least this way the filth is confined to this
    // handler - we grab the actor and ability here and pass it on to the
    // component, which can just think in terms of the data.
    const abilityId = el.getAttribute(constants.htmlDataItemId);
    const actorId = el.getAttribute(constants.htmlDataActorId);
    const tokenId = el.getAttribute(constants.htmlDataTokenId);
    const mode = el.getAttribute(constants.htmlDataMode);
    const weaponId = el.getAttribute(constants.htmlDataWeaponId);
    const rangeName = el.getAttribute(constants.htmlDataRange);
    const name = el.getAttribute(constants.htmlDataName);
    const imageUrl = el.getAttribute(constants.htmlDataImageUrl);

    if (actorId === null) {
      logger.error(
        `Missing or invalid '${constants.htmlDataItemId}' attribute.`,
        el,
      );
      return;
    }
    if (mode === null || !isAbilityCardMode(mode)) {
      logger.error(
        `Ability test chat message found without a valid '${constants.htmlDataMode}' attribute. (Valid values are "test", "spend", "combat"`,
        el,
      );
      return;
    }

    // foundry doesn't seem to have a canonical way to just grab an item
    // regardless of where it is (world, actor, token, compendium etc.)
    const actor = tokenId
      ? canvas?.tokens?.get(tokenId)?.actor
      : game.actors?.get(actorId);
    const ability = abilityId ? actor?.items.get(abilityId) : undefined;
    let content: JSX.Element;
    if (mode === constants.htmlDataModeAttack) {
      const weapon = weaponId ? actor?.items.get(weaponId) : undefined;
      content = (
        <AttackCard
          msg={chatMessage}
          weapon={weapon}
          rangeName={rangeName}
          imageUrl={imageUrl}
          name={name}
        />
      );
    } else if (mode === constants.htmlDataModeMwTest) {
      // MW TEST
      const difficultyAttr = el.getAttribute(constants.htmlDataMwDifficulty);
      const difficulty: MWDifficulty =
        difficultyAttr === "easy" ? "easy" : Number(difficultyAttr ?? 0);
      const boonLevy = Number(
        el.getAttribute(constants.htmlDataMwBoonLevy) ?? 0,
      );
      const reRoll = el.getAttribute(constants.htmlDataMwReRoll);
      const pool = Number(el.getAttribute(constants.htmlDataMwPool));
      content = (
        <AbilityTestMwCard
          msg={chatMessage}
          ability={ability}
          difficulty={difficulty}
          boonLevy={boonLevy}
          reRoll={reRoll ? Number(reRoll) : undefined}
          pool={pool}
          name={name}
        />
      );
    } else if (
      mode === constants.htmlDataModeMwWallop ||
      mode === constants.htmlDataModeMwNegate
    ) {
      // MW NEGATE OR WALLOP
      const pool = Number(el.getAttribute(constants.htmlDataMwPool));
      content = (
        <AbilityNegateOrWallopMwCard
          msg={chatMessage}
          ability={ability}
          pool={pool}
          mode={mode}
          name={name}
        />
      );
    } else {
      // REGULAR TEST /SPEND
      content = (
        <StrictMode>
          <AbilityTestCard
            msg={chatMessage}
            ability={ability}
            mode={mode}
            imageUrl={imageUrl}
            name={name}
          />
        </StrictMode>
      );
    }
    createRoot(el).render(content);
  });
};
