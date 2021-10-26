/** @jsx jsx */
import {
  jsx,
  // css,
  // keyframes,
} from "@emotion/react";
import { css } from "@emotion/css";
import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import {
  assertGame,
} from "../../functions";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { CSSTransition } from "react-transition-group";
import { CSSTransitionClassNames } from "react-transition-group/CSSTransition";
import { DiceTerms } from "./DiceTerms";
import * as constants from "../../constants";
import { AbilityCardMode, isAbilityCardMode } from "./types";

interface AbilityTestCardProps {
  msg: ChatMessage;
  ability: InvestigatorItem;
  mode: AbilityCardMode;
}

const maxHeight = "3em";
const duration = 200;
const maxHeightTransition = `max-height ${duration}ms ease-out`;

const termsClasses: CSSTransitionClassNames = {
  enter: css({
    maxHeight: 0,
  }),
  enterActive: css({
    maxHeight,
    transition: maxHeightTransition,
    overflow: "hidden",
  }),
  // enterDone: css({
  //   // maxHeight: "none",
  // }),
  exit: css({
    maxHeight,
  }),
  exitActive: css({
    maxHeight: 0,
    transition: maxHeightTransition,
    overflow: "hidden",
  }),
  // exitDone: css({
  //   maxHeight: 0,
  // }),
};

const AbilityTestCard: React.FC<AbilityTestCardProps> = React.memo(({
  msg,
  ability,
}) => {
  // const isGeneral = isGeneralAbility(ability);
  const onClickAbilityName = useCallback(() => {
    ability.sheet?.render(true);
  }, [ability.sheet]);

  const [showTerms, setShowTerms] = useState(true);

  const onClickResult = useCallback(() => {
    setShowTerms(s => !s);
  }, []);

  return (
    <div
      className="dice-roll"
      css={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "max-content 1fr",
        gridTemplateRows: "max-content minmax(0, max-content) max-content",
        gridTemplateAreas:
          "\"image headline\" " +
          "\"image terms\" " +
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
          alignSelf: "start",
        }}
      />
      {/* HEADLINE */}
      <div
        css={{
          gridArea: "headline",
        }}
      >
        <b><a onClick={onClickAbilityName}>{ability.data.name}</a></b>
      </div>
      {/* TERMS */}
      <CSSTransition
        in={showTerms}
        timeout={duration}
        classNames={{
          ...termsClasses,
        }}
        unmountOnExit
      >
        <div
          css={{
            gridArea: "terms",
            // overflow: "hidden",
          }}
        >
          <DiceTerms terms={msg.roll?.terms} />
        </div>
      </CSSTransition>
      {/* RESULT */}
      <a
        onClick={onClickResult}
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
      </a>
    </div>
  );
});

export const installAbilityCardChatWrangler = () => {
  Hooks.on("renderChatMessage", (chatMessage, html, options) => {
    assertGame(game);
    const el = html.find(`.${constants.abilityChatMessageClassName}`).get(0);
    // this seems clunky but I can't see a way to pass arbitrary data through
    // rolls or chat messages. at least this way to filth is confined to this
    // handler - we grab the actor and ability here and pass them on to the
    // component, which can just think in terms of the data.
    const abilityId = el.getAttribute(constants.htmlDataItemId);
    const actorId = el.getAttribute(constants.htmlDataActorId);
    const mode = el.getAttribute(constants.htmlDataMode);
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
    if (el && abilityId && ability) {
      ReactDOM.render(
        <AbilityTestCard msg={chatMessage} ability={ability} mode={mode} />,
        el,
      );
    }
  });
};
