/** @jsx jsx */
import {
  jsx,
} from "@emotion/react";
import React, { useCallback, useState } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { CSSTransition } from "react-transition-group";
import { Translate } from "../Translate";
import { DiceTerms } from "./DiceTerms";
import { duration, termsClasses } from "./transitions";
// import * as constants from "../../constants";

interface AttackCardProps {
  msg: ChatMessage;
  weapon: InvestigatorItem|undefined;
  rangeName: string|null;
  name: string|null;
  imageUrl: string|null;
}

export const AttackCard: React.FC<AttackCardProps> = React.memo(({
  msg,
  rangeName,
  weapon,
  name,
  imageUrl,
}) => {
  const onClickWeaponName = useCallback(() => {
    weapon?.sheet?.render(true);
  }, [weapon?.sheet]);

  const [showTerms, setShowTerms] = useState(true);

  const onClickResult = useCallback(() => {
    setShowTerms(s => !s);
  }, []);

  const img = weapon?.data.img ?? imageUrl;

  const poolRolls = (msg.roll?.terms[0] as PoolTerm).rolls;
  const hitRoll = poolRolls[0];
  const damageRoll = poolRolls[1];

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
          "\"image hit-terms\" " +
          "\"image hit-body\" " +
          "\"image damage-terms\" " +
          "\"image damage-body\" ",
        alignItems: "center",
      }}
    >
      {/* IMAGE */}
      <div
        css={{
          height: "4em",
          width: "4em",
          gridArea: "image",
          backgroundImage: `url(${img})`,
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
        <b><a onClick={onClickWeaponName}>{name ?? weapon?.data.name}</a></b>
        {" "}
        (<Translate>{rangeName || ""}</Translate>)
      </div>
      {/* HIT TERMS */}
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
            gridArea: "hit-terms",
          }}
        >
          <Translate>Hit roll</Translate>
          {": "}
          <DiceTerms terms={hitRoll.terms} />
          {" ="}
        </div>
      </CSSTransition>
      {/* HIT RESULT */}
      <a
        onClick={onClickResult}
        className="dice-total"
        css={{
          gridArea: "hit-body",
        }}
      >
        {hitRoll.total}
      </a>

      {/* DAMAGE TERMS */}
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
            gridArea: "damage-terms",
          }}
        >
          <Translate>Damage</Translate>
          {": "}
          <DiceTerms terms={damageRoll.terms} />
          {" ="}
        </div>
      </CSSTransition>
      {/* DAMAGE RESULT */}
      <a
        onClick={onClickResult}
        className="dice-total"
        css={{
          gridArea: "damage-body",
        }}
      >
        {damageRoll.total}
      </a>

    </div>
  );
});
