/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { DiceTerms } from "./DiceTerms";
import { Translate } from "../Translate";
import { MWDifficulty } from "../../types";

interface AbilityTestMwCardProps {
  msg: ChatMessage;
  ability: InvestigatorItem;
  difficulty: MWDifficulty;
}

type SuccessOrFailure ="success" | "failure";

interface MWResult {
  successorFailure: SuccessOrFailure;
  text: string;
  color: string;
}

export const mainColors: {[x in SuccessOrFailure]: string} = {
  success: "#a7d5a7",
  failure: "#d59292",
};

const results: {[value: number]: MWResult} = {
  1: {
    color: "red",
    successorFailure: "failure",
    text: "Dismal",
  },
  2: {
    color: mainColors.failure,
    successorFailure: "failure",
    text: "Quotidian",
  },
  3: {
    color: "#ffff81",
    successorFailure: "failure",
    text: "Exasperating",
  },
  4: {
    color: "#ffff81",
    successorFailure: "success",
    text: "Hair’s-Breadth",
  },
  5: {
    color: mainColors.success,
    successorFailure: "success",
    text: "Prosaic",
  },
  6: {
    color: "#0f0",
    successorFailure: "success",
    text: "Illustrious",
  },
};

export const AbilityTestMwCard: React.FC<AbilityTestMwCardProps> = React.memo(({
  msg,
  ability,
  difficulty,
}) => {
  const onClickAbilityName = useCallback(() => {
    ability.sheet?.render(true);
  }, [ability.sheet]);

  // const [showTerms, setShowTerms] = useState(true);

  // const onClickResult = useCallback(() => {
  //   setShowTerms(s => !s);
  // }, []);

  const cappedResult = Math.max(Math.min(msg.roll?.total ?? 1, 6), 1);
  const effectiveResult = difficulty === "easy" && cappedResult === 3 ? 4 : cappedResult;
  const deets = results[effectiveResult];

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
        {" "}
        <DiceTerms terms={msg.roll?.terms} />
        {difficulty === "easy" && <span>(<Translate>Easy</Translate>)</span>}
      </div>
      {/* TERMS */}
      {/* <CSSTransition
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
          <Fragment>
            <Translate>AbilityTest</Translate>
            {": "}
            <DiceTerms terms={msg.roll?.terms} />
            {" ="}
          </Fragment>
        </div>
      </CSSTransition> */}
      {/* RESULT */}
      <div
        css={{
          background: mainColors[deets.successorFailure],
          textAlign: "center",
          padding: "0.5em",
          border: "1px solid #777",
          borderRadius: "0.5em",
          gridArea: "body",
        }}
        >
          <Translate>
            {deets.successorFailure === "failure" ? "FailureExclamation" : "SuccessExclamation"}
          </Translate>
          <div
            css={{
              marginTop: "0.5em",
              // padding: "1em",
              background: deets.color,
              border: "1px solid #777",
              borderRadius: "0.5em",
            }}
          >
            {deets.text}
          </div>
      </div>
    </div>
  );
});
