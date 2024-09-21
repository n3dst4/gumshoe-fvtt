import { FoundryAppContext } from "@lumphammer/shared-fvtt-bits/src/FoundryAppContext";
import React, { Fragment, useCallback, useContext, useState } from "react";

import { InvestigatorItem } from "../../module/InvestigatorItem";
import { assertAbilityItem, isGeneralAbilityItem } from "../../v10Types";
import { Button } from "../inputs/Button";

type AbilitySlugPlayMwProps = {
  ability: InvestigatorItem;
};

export const AbilitySlugPlayMw: React.FC<AbilitySlugPlayMwProps> = ({
  ability,
}) => {
  assertAbilityItem(ability);
  const app = useContext(FoundryAppContext);
  const onDragStart = useCallback(
    (e: React.DragEvent<HTMLAnchorElement>) => {
      if (app !== null) {
        (app as any)._onDragStart(e);
      }
    },
    [app],
  );

  const [boonLevy, setBoonlevy] = useState(0);

  const onTest = useCallback(() => {
    void ability.mwTestAbility(0, boonLevy);
    setBoonlevy(0);
  }, [ability, boonLevy]);

  const onClickInc = useCallback(() => {
    setBoonlevy((s) => s + 1);
  }, []);

  const onClickDec = useCallback(() => {
    setBoonlevy((s) => s - 1);
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
          textAlign: "end",
        }}
      >
        {ability.name}
      </a>
      <div css={{ gridColumn: "rating", justifySelf: "right" }}>
        {ability.system.pool}/{ability.system.rating}
      </div>
      <div
        css={{
          gridColumn: "set",
          display: "grid",
          gridTemplateColumns: "1.6em 1.6em",
        }}
      >
        <Button
          css={{ gridColumn: "1" }}
          onClick={onClickDec}
          disabled={boonLevy <= -2}
        >
          <i css={{ fontSize: "x-small" }} className="fa fa-minus" />
        </Button>
        <Button
          css={{ gridColumn: "2" }}
          onClick={onClickInc}
          disabled={boonLevy >= 2}
        >
          <i css={{ fontSize: "x-small" }} className="fa fa-plus" />
        </Button>
      </div>
      <div css={{ gridColumn: "spend" }}>
        {isGeneralAbilityItem(ability) && (
          <Button css={{ width: "4.1em" }} onClick={onTest}>
            <i className="fa fa-dice" title="Test" />+{boonLevy}
          </Button>
        )}
      </div>
      {ability.system.hasSpecialities && (
        <div css={{ paddingLeft: "1em", gridColumn: "ability", width: "2em" }}>
          {(ability.system.specialities || []).map<JSX.Element>(
            (x: string, i: number) => (
              <div key={i}>{x.trim()}</div>
            ),
          )}
        </div>
      )}
    </Fragment>
  );
};
