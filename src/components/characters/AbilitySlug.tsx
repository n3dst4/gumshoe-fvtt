import React, { useCallback, useContext } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { FoundryAppContext } from "../FoundryAppContext";
import {
  assertAbilityDataSource,
  isGeneralAbilityDataSource,
} from "../../typeAssertions";
import { settings } from "../../settings";

type AbilitySlugProps = {
  ability: InvestigatorItem;
};

export const AbilitySlug: React.FC<AbilitySlugProps> = ({ ability }) => {
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
  const boost = settings.useBoost.get() && ability.getBoost();

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
        {ability.system.occupational && (
          <i
            css={{ fontSize: "0.8em", marginRight: "0.5em" }}
            className="fa fa-star-of-life"
            title="This is an occupational ability"
          />
        )}
        {ability.name} ({ability.system.pool}/{ability.system.rating})
        {isGeneralAbilityItem(ability) && ability.system.canBeInvestigative && (
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
      {ability.system.hasSpecialities && (
        <div css={{ paddingLeft: "1em" }}>
          {(ability.system.specialities || []).map<JSX.Element>(
            (x: string, i: number) => (
              <div key={i}>{x.trim()}</div>
            ),
          )}
        </div>
      )}
    </a>
  );
};
