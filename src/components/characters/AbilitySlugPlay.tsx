import React, { Fragment, useCallback, useContext, useState } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { FoundryAppContext } from "../FoundryAppContext";
import {
  assertAbilityDataSource,
  isGeneralAbilityDataSource,
  isInvestigativeAbilityDataSource,
} from "../../typeAssertions";
import { UnlockBadges } from "../abilities/UnlockBadges";

type AbilitySlugPlayProps = {
  ability: InvestigatorItem;
};

export const AbilitySlugPlay: React.FC<AbilitySlugPlayProps> = ({
  ability,
}) => {
  assertAbilityDataSource(ability.data);
  const app = useContext(FoundryAppContext);
  const onDragStart = useCallback(
    (e: React.DragEvent<HTMLAnchorElement>) => {
      if (app !== null) {
        (app as any)._onDragStart(e);
      }
    },
    [app],
  );

  const [spend, setSpend] = useState(0);
  // const unlocks = ability.getActiveUnlocks();

  const onTest = useCallback(() => {
    ability.testAbility(spend);
    setSpend(0);
  }, [ability, spend]);

  const onSpend = useCallback(() => {
    ability.spendAbility(spend);
    setSpend(0);
  }, [ability, spend]);

  const onClickInc = useCallback(() => {
    setSpend((s) => s + 1);
  }, []);

  const onClickDec = useCallback(() => {
    setSpend((s) => s - 1);
  }, []);

  return (
    <Fragment key={ability.id}>
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
      <div css={{ gridColumn: "rating", justifySelf: "right" }}>
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
          disabled={spend <= 0}
        >
          <i css={{ fontSize: "x-small" }} className="fa fa-minus" />
        </button>
        <button
          css={{ gridColumn: "2" }}
          onClick={onClickInc}
          disabled={spend >= ability.data.data.pool}
        >
          <i css={{ fontSize: "x-small" }} className="fa fa-plus" />
        </button>
      </div>
      <div css={{ gridColumn: "spend" }}>
        {isInvestigativeAbilityDataSource(ability.data) && (
          <button disabled={spend === 0} onClick={onSpend}>
            <i className="fa fa-search" title="Spend" />
            {spend}
          </button>
        )}
        {isGeneralAbilityDataSource(ability.data) && (
          <button css={{ width: "4.1em" }} onClick={onTest}>
            <i className="fa fa-dice" title="Test" />+{spend}
          </button>
        )}
        {isGeneralAbilityDataSource(ability.data) &&
          ability.data.data.canBeInvestigative && (
            <button
              css={{ width: "2em" }}
              disabled={spend === 0}
              onClick={onSpend}
            >
              <i className="fa fa-search" title="Spend" />
            </button>
          )}
      </div>
      <UnlockBadges ability={ability} css={{ gridColumn: "1/-1" }} />
      {ability.data.data.hasSpecialities && (
        <div css={{ paddingLeft: "1em", gridColumn: "1/-1" }}>
          {(ability.data.data.specialities || []).map<JSX.Element>(
            (x: string, i: number) => (
              <div key={i}>{x.trim()}</div>
            ),
          )}
        </div>
      )}
    </Fragment>
  );
};
