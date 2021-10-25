/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
import ReactDOM from "react-dom";
import {
  assertGame,
  // isGeneralAbility,
} from "../../functions";
import { InvestigatorItem } from "../../module/InvestigatorItem";
// import { Translate } from "../Translate";

interface AbilityTestCardProps {
  msg: ChatMessage;
  ability: InvestigatorItem;
}

const AbilityTestCard: React.FC<AbilityTestCardProps> = React.memo(({
  msg,
  ability,
}) => {
  // const isGeneral = isGeneralAbility(ability);
  const onClick = useCallback(() => {
    ability.sheet?.render(true);
  }, [ability.sheet]);

  return (
    <div
      className="dice-roll"
      css={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "max-content 1fr",
        gridTemplateRows: "auto auto",
        gridTemplateAreas:
          "\"image headline\" " +
          "\"image body\" ",
        alignItems: "center",
      }}
    >
      {/* IMAGE */}
      <div
        css={{
          height: "4em",
          width: "4em",
          gridArea: "image",
          backgroundImage: `url(${ability.data.img})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          transform: "scale(0.9) rotate(-5deg)",
          boxShadow: "0 0 0.5em black",
          marginRight: "1em",
        }}
      />
      {/* HEADLINE */}
      <div
        css={{
          gridArea: "headline",
          // lineHeight: "3em",
          // verticalAlign: "middle",
        }}
      >
          <b><a onClick={onClick}>{ability.data.name}</a></b>
          {/* {" "}
          ({msg.roll?.formula}) */}
      </div>
      {/* RESULT */}
      <h4
        className="dice-total"
        css={{
          gridArea: "body",
          "&&": {
            marginTop: "0.5em",
          },
          // textAlign: "center",
          // verticalAlign: "middle",
          // fontSize: "3em",
        }}
      >
        {msg.roll?.total}
      </h4>
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
