/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback, useContext, useState } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { ActorSheetAppContext } from "../FoundryAppContext";
import { assertAbilityDataSource } from "../../types";
import { isGeneralAbility } from "../../functions";
// import { AsyncNumberInput } from "../inputs/AsyncNumberInput";

type AbilitySlugPlayMwProps = {
  ability: InvestigatorItem,
};

export const AbilitySlugPlayMw: React.FC<AbilitySlugPlayMwProps> = ({ ability }) => {
  assertAbilityDataSource(ability.data);
  const app = useContext(ActorSheetAppContext);
  const onDragStart = useCallback((e: React.DragEvent<HTMLAnchorElement>) => {
    if (app !== null) {
      (app as any)._onDragStart(e);
    }
  }, [app]);

  const [boonLevy, setBoonlevy] = useState(0);

  const onTest = useCallback(() => {
    ability.mwTestAbility(0, boonLevy);
    setBoonlevy(0);
  }, [ability, boonLevy]);

  const onClickInc = useCallback(() => {
    setBoonlevy(s => s + 1);
  }, []);

  const onClickDec = useCallback(() => {
    setBoonlevy(s => s - 1);
  }, []);

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
        css={{
          gridColumn: "ability",
          lineHeight: 0.9,
        }}
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
          gridTemplateColumns: "1.6em 1.6em",
        }}
      >
        <button
          css={{ gridColumn: "1" }}
          onClick={onClickDec}
          disabled={boonLevy <= -2}
        >
          <i css={{ fontSize: "x-small" }} className="fa fa-minus" />
        </button>
        <button
          css={{ gridColumn: "2" }}
          onClick={onClickInc}
          disabled={boonLevy >= 2}
        >
          <i css={{ fontSize: "x-small" }} className="fa fa-plus" />
        </button>
      </div>
      <div css={{ gridColumn: "spend" }}>
        {isGeneralAbility(ability) && (
          <button css={{ width: "4.1em" }} onClick={onTest}>
            <i className="fa fa-dice" title="Test" />+{boonLevy}
          </button>
        )}
      </div>
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
