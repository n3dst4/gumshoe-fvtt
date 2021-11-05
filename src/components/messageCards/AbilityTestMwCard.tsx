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

interface MWResult {
  text: string;
  color: string;
  // css: CSSObject;
}

const basicShadow = "0 0 0.5em 0 #0007";

const results: {[value: number]: MWResult} = {
  1: {
    text: "Dismal Failure",
    color: "#fe083f",
    // css: {
    //   backgroundColor: "black",
    //   color: "white",
    //   textShadow: [
    //     "0 0 0.5em red",
    //     "0 0 0.2em red",
    //     "0 0 1em red",
    //     "0 0 2em red",
    //   ].join(","),
    //   boxShadow: [
    //     "0 0 1em 0 inset red",
    //     basicShadow,
    //   ].join(","),
    // },
  },
  2: {
    text: "Quotidian Failure",
    color: "#fd5a00",
    // css: {
    //   backgroundColor: "darkred",
    //   boxShadow: basicShadow,
    // },
  },
  3: {
    text: "Exasperating Failure",
    color: "#eb8b00",
    // css: {
    //   backgroundColor: "pink",
    //   boxShadow: basicShadow,
    // },
  },
  4: {
    text: "Hair’s-Breadth Success",
    color: "#c9b500",
    // css: {
    //   backgroundColor: "lightgreen",
    //   boxShadow: basicShadow,
    // },
  },
  5: {
    text: "Prosaic Success",
    color: "#94d900",
    // css: {
    //   backgroundColor: "darkgreen",
    //   boxShadow: basicShadow,
    // },
  },
  6: {
    text: "Illustrious Success",
    color: "#0cf850",
    // css: {
    //   backgroundColor: "#333",
    //   color: "white",
    //   textShadow: [
    //     "0 0 0.5em yellow",
    //     "0 0 0.2em yellow",
    //     "0 0 1em yellow",
    //     "0 0 2em yellow",
    //   ].join(","),
    //   boxShadow: [
    //     "0 0 0.5em 0 inset yellow",
    //     basicShadow,
    //   ].join(","),
    // },
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
          textAlign: "center",
          padding: "0.5em",
          gridArea: "body",
          marginTop: "0.5em",
          borderRadius: "2em",
          backgroundImage: [
            `radial-gradient(closest-side, ${deets.color}77 0%, ${deets.color}00 100%)`,
            "linear-gradient(to bottom, #777, #000)",
          ].join(", "),
          boxShadow: basicShadow,
        }}
      >
        <div
          css={{
            color: "#fff",
            borderStyle: "solid",
            borderWidth: "2px",
            borderColor: "#fff",
            borderRadius: "1em",
            textShadow: [
              `0 0 0.5em ${deets.color}`,
              `0 0 0.2em ${deets.color}`,
              `0 0 1em ${deets.color}`,
              `0 0 2em ${deets.color}`,
            ].join(","),
            boxShadow: [
              `0 0 0.5em 0 inset ${deets.color}`,
              `0 0 0.5em 0 ${deets.color}`,
              // basicShadow,
            ].join(","),

          }}
        >
          {deets.text}
        </div>
      </div>
    </div>
  );
});
