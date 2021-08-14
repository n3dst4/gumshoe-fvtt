/** @jsx jsx */
import React, { useCallback, useContext } from "react";
import { jsx } from "@emotion/react";
import { GumshoeItem } from "../../module/GumshoeItem";
import { ActorSheetAppContext } from "../FoundryAppContext";
import { getUseBoost } from "../../settingsHelpers";
import { assertAbilityDataSource, isGeneralAbilityDataSource } from "../../types";

type AbilitySlugProps = {
  ability: GumshoeItem,
};

export const AbilitySlug: React.FC<AbilitySlugProps> = ({ ability }) => {
  assertAbilityDataSource(ability.data);
  const app = useContext(ActorSheetAppContext);
  const onDragStart = useCallback((e: React.DragEvent<HTMLAnchorElement>) => {
    if (app !== null) {
      (app as any)._onDragStart(e);
    }
  }, [app]);
  const boost = getUseBoost() && ability.getBoost();

  return (
    <a
      tabIndex={0}
      key={ability.id}
      css={{
        display: "block",
        position: "relative",
        // ":hover": {
        //   textShadow: "0 0 0.5em #ec6f12",
        // },
      }}
      onClick={() => {
        ability.sheet?.render(true);
      }}
      data-item-id={ability.id}
      onDragStart={onDragStart}
      draggable="true"
    >
      <div>
        {ability.data.data.occupational && (
          <i
            css={{ fontSize: "0.8em", marginRight: "0.5em" }}
            className="fa fa-star-of-life"
            title="This is an occupational ability"
          />
        )}
        {ability.name} ({ability.data.data.pool}/{ability.data.data.rating})
        {isGeneralAbilityDataSource(ability.data) && ability.data.data.canBeInvestigative && (
          <i
            css={{ fontSize: "0.8em", marginLeft: "0.5em" }}
            className="fa fa-search"
            title="Can be used investigatively"
          />
        )}
        {boost && (
          <i
            css={{ fontSize: "0.8em", marginLeft: "0.5em" }}
            className="fa fa-chart-line"
            title="Boost"
          />
        )}
      </div>
      {ability.data.data.hasSpecialities && (
        <div css={{ paddingLeft: "1em" }}>
          {(ability.data.data.specialities || []).map<JSX.Element>((x: string, i: number) => (
            <div key={i}>{x.trim()}</div>
          ))}
        </div>
      )}
    </a>
  );
};
