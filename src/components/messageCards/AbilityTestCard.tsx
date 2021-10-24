/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import ReactDOM from "react-dom";
import { assertGame } from "../../functions";
import { InvestigatorItem } from "../../module/InvestigatorItem";

interface AbilityTestCardProps {
  msg: ChatMessage;
  ability: InvestigatorItem;
}

const AbilityTestCard: React.FC<AbilityTestCardProps> = React.memo(({
  msg,
}) => {
  return (
    <div
      css={{
        position: "relative",
      }}
    >
      <div>
        {/* {msg.data.} */}
      </div>
      <div
        css={{

        }}
      >
        {msg.roll?.formula}
      </div>
      <div>
        {msg.roll?.result}
      </div>
      <div>
        {msg.roll?.total}
      </div>
    </div>
  );
});

export const installAbilityTestCardChatWrangler = () => {
  Hooks.on("renderChatMessage", (chatMessage, html, options) => {
    assertGame(game);
    const el = html.find(".investigator-ability-test").get(0);
    // this seems clunky but I can't see a way to pass arbitrary data through
    // rolls or chat messages. at least this way to filth is confined to this
    // handler - we grab the actor and ability here and pass them on to the
    // component, which can just think in terms of the data.
    const abilityId = el.getAttribute("data-item-id");
    const actorId = el.getAttribute("data-actor-id");
    if (abilityId === null) {
      logger.error("Ability test chat message found with no 'data-item-id' attribute.");
      return;
    }
    if (actorId === null) {
      logger.error("Ability test chat message found with no 'data-actor-id' attribute.");
      return;
    }
    const actor = game.actors?.get(actorId);
    const ability = actor?.items.get(abilityId);
    if (el && abilityId && ability) {
      ReactDOM.render(
        <AbilityTestCard msg={chatMessage} ability={ability} />,
        el,
      );
    }
  });
};
