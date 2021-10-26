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

interface AbilityTestCardProps {
  msg: ChatMessage;
  ability: InvestigatorItem;
}

// const bounce = keyframes`
//   from, 20%, 53%, 80%, to {
//     transform: translate3d(0,0,0);
//   }

//   40%, 43% {
//     transform: translate3d(0, -30px, 0);
//   }

//   70% {
//     transform: translate3d(0, -15px, 0);
//   }

//   90% {
//     transform: translate3d(0,-4px,0);
//   }
// `;

const maxHeight = "1em";
const duration = 200;
const maxHeightTransition = `max-height ${duration}ms ease-out`;

const termsClasses: CSSTransitionClassNames = {
  enter: css({
    maxHeight: 0,
  }),
  enterActive: css({
    maxHeight,
    transition: maxHeightTransition,
  }),
  enterDone: css({
    maxHeight,
    // transition: "height 300ms",
  }),
  exit: css({
    maxHeight,
  }),
  exitActive: css({
    maxHeight: 0,
    transition: maxHeightTransition,
  }),
  exitDone: css({
    maxHeight: 0,
    // transition: "height 300ms",
  }),
};

const AbilityTestCard: React.FC<AbilityTestCardProps> = React.memo(({
  msg,
  ability,
}) => {
  // const isGeneral = isGeneralAbility(ability);
  const onClickAbilityName = useCallback(() => {
    ability.sheet?.render(true);
  }, [ability.sheet]);

  const [showTerms, setShowTerms] = useState(false);

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
          // appear: "my-appear",
          // appearActive: "my-active-appear",
          // appearDone: "my-done-appear",
          // enter: "my-enter",
          // enterActive: "my-active-enter",
          // enterDone: "my-done-enter",
          // exit: "my-exit",
          // exitActive: "my-active-exit",
          // exitDone: "my-done-exit",
        }}
        unmountOnExit
        // onEnter={() => setShowButton(false)}
        // onExited={() => setShowButton(true)}
      >
        <div
          css={{
            gridArea: "terms",
            overflow: "hidden",
          }}
        >
          terms
        </div>
      </CSSTransition>
      {/* {showTerms &&
        <div
          css={{
            gridArea: "terms",
          }}
        >
          terms
        </div>
      } */}
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
