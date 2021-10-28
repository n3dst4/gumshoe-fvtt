/** @jsx jsx */
import {
  jsx,
} from "@emotion/react";
import { css } from "@emotion/css";
import React, { Fragment, useCallback, useState } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { CSSTransition } from "react-transition-group";
import { CSSTransitionClassNames } from "react-transition-group/CSSTransition";
import { DiceTerms } from "./DiceTerms";
import { AbilityCardMode } from "./types";
import { Translate } from "../Translate";
import * as constants from "../../constants";

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
  exit: css({
    maxHeight,
  }),
  exitActive: css({
    maxHeight: 0,
    transition: maxHeightTransition,
    overflow: "hidden",
  }),
};

export const AbilityTestCard: React.FC<AbilityTestCardProps> = React.memo(({
  msg,
  ability,
  mode,
}) => {
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
          backgroundPosition: "center",
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
        {!showTerms && (
          <span>
            {" "}
            {mode === constants.htmlDataModeSpend &&
              <Translate>PointSpend</Translate>
            }
            {mode === constants.htmlDataModeTest &&
              <Translate>AbilityTest</Translate>
            }
          </span>
        )}
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
          }}
        >
          {mode === "spend" &&
            <Translate>PointSpend</Translate>
          }
          {mode === "test" &&
            <Fragment>
              <Translate>AbilityTest</Translate>
              {": "}
              <DiceTerms terms={msg.roll?.terms} />
              {" ="}
            </Fragment>
          }
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
        }}
      >
        {msg.roll?.total}
      </a>
    </div>
  );
});
