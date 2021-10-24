/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import ReactDOM from "react-dom";
import { assertGame, isGeneralAbility } from "../../functions";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { Translate } from "../Translate";

interface AbilityTestCardProps {
  msg: ChatMessage;
  ability: InvestigatorItem;
}

const AbilityTestCard: React.FC<AbilityTestCardProps> = React.memo(({
  msg,
  ability,
}) => {
  const isGeneral = isGeneralAbility(ability);

  return (
    <div
      css={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "max-content 1fr",
        gridTemplateRows: "auto auto",
        gridTemplateAreas:
          "\"image headline\" " +
          "\"body  body\" ",
      }}
    >
      {/* IMAGE */}
      <div
        css={{
          height: "3em",
          width: "3em",
          gridArea: "image",
          backgroundImage: `url(${ability.data.img})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          transform: "scale(0.9) rotate(-5deg)",
        }}
      />
      {/* HEADLINE */}
      <div
        css={{
          gridArea: "headline",
        }}
      >
        <div>
          <small>
            <Translate>
              {isGeneral ? "General ability" : "Investigative ability"}
            </Translate>
          </small>
        </div>
        <div>
          {ability.data.name}
        </div>
      </div>
      {/* RESULT */}
      <div
        css={{
          gridArea: "body",
        }}
      >
        {msg.roll?.formula} =
        {msg.roll?.total}
        {/* {msg.roll?.result} */}
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
