/** @jsx jsx */
import { jsx } from "@emotion/react";
import * as constants from "../../constants";
import React, { Fragment, useCallback, useContext, useState } from "react";
import { GumshoeItem } from "../../module/GumshoeItem";
import { ActorSheetAppContext } from "../FoundryAppContext";
import { assertAbilityDataSource, isGeneralAbilityDataSource } from "../../types";
import { assertGame, getTranslated, isGeneralAbility, isInvestigativeAbility } from "../../functions";
// import { AsyncNumberInput } from "../inputs/AsyncNumberInput";

type AbilitySlugPlayProps = {
  ability: GumshoeItem,
};

export const AbilitySlugPlay: React.FC<AbilitySlugPlayProps> = ({ ability }) => {
  assertAbilityDataSource(ability.data);
  const app = useContext(ActorSheetAppContext);
  const onDragStart = useCallback((e: React.DragEvent<HTMLAnchorElement>) => {
    if (app !== null) {
      (app as any)._onDragStart(e);
    }
  }, [app]);

  const [spend, setSpend] = useState(0);
  const onTest = useCallback(() => {
    assertGame(game);
    assertAbilityDataSource(ability.data);
    if (ability.actor === null) { return; }
    const useBoost = game.settings.get(constants.systemName, constants.useBoost);
    const isBoosted = useBoost && ability.getBoost();
    const boost = isBoosted ? 1 : 0;
    const roll = useBoost
      ? new Roll("1d6 + @spend + @boost", { spend, boost })
      : new Roll("1d6 + @spend", { spend });
    const label = getTranslated("RollingAbilityName", { AbilityName: ability.name ?? "" });
    roll.roll().toMessage({
      speaker: ChatMessage.getSpeaker({ actor: ability.actor }),
      flavor: label,
    });
    ability.update({ data: { pool: ability.data.data.pool - Number(spend) || 0 } });
    setSpend(0);
  }, [ability, spend]);
  const onSpend = useCallback(() => {
    assertAbilityDataSource(ability.data);
    if (ability.actor === null) { return; }
    const roll = new Roll("@spend", { spend });
    const label = getTranslated("AbilityPoolSpendForAbilityName", { AbilityName: ability.name ?? "" });
    roll.roll().toMessage({
      speaker: ChatMessage.getSpeaker({ actor: ability.actor }),
      flavor: label,
    });
    ability.update({ data: { pool: ability.data.data.pool - Number(spend) || 0 } });
    setSpend(0);
  }, [ability, spend]);

  const onClickInc = useCallback(() => {
    setSpend(spend + 1);
  }, [spend]);
  const onClickDec = useCallback(() => {
    setSpend(spend - 1);
  }, [spend]);

  return (
    <Fragment
      key={ability.id}
    >
      <a
        onClick={() => {
          ability.sheet?.render(true);
        }}
        data-item-id={ability.id}
        onDragStart={onDragStart}
        draggable="true"
        css={{ gridColumn: "ability" }}
      >
        {ability.name}
      </a>
      <div css={{ gridColumn: "rating", justifySelf: "right" }} >
        {ability.data.data.pool}/{ability.data.data.rating}
      </div>
      <div
        css={{
          gridColumn: "set",
          display: "grid",
          gridTemplateColumns: "1.6em 1.6em 2em 1fr",
        }}
      >
        <button
          css={{ gridColumn: "1" }}
          onClick={onClickInc}
          disabled={spend >= ability.data.data.pool}
        >
          <i css={{ fontSize: "x-small" }} className="fa fa-plus" />
        </button>
        <button
          css={{ gridColumn: "2" }}
          onClick={onClickDec}
          disabled={spend <= 0}
        >
          <i css={{ fontSize: "x-small" }} className="fa fa-minus" />
        </button>
        <h3 css={{ gridColumn: "3", justifySelf: "center" }} > {spend} </h3>
        <div
          css={{
            gridColumn: "4",
            display: "flex",
          }}
        >
          {isGeneralAbility(ability) && (
            <button css={{ flex: 1 }} onClick={onTest}>
              <i className="fa fa-dice" title="Test" />
            </button>
          )}
          {(isInvestigativeAbility(ability) ||
            (isGeneralAbilityDataSource(ability.data) && ability.data.data.canBeInvestigative)
          ) && (
            <button css={{ flex: 1 }} disabled={spend === 0} onClick={onSpend}>
              <i className="fa fa-search" title="Spend" />
            </button>
          )}
        </div>
      </div>
      {
      }
      {ability.data.data.hasSpecialities && (
        <div css={{ paddingLeft: "1em", gridColumn: "ability", width: "2em" }}>
          {(ability.data.data.specialities || []).map<JSX.Element>((x: string, i: number) => (
            <div key={i}>{x.trim()}</div>
          ))}
        </div>
      )}
    </Fragment>
  );
};
