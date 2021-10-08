/** @jsx jsx */
import React, { Fragment, useCallback, useContext } from "react";
import { jsx } from "@emotion/react";
import { GumshoeItem } from "../../module/GumshoeItem";
import { ActorSheetAppContext } from "../FoundryAppContext";
import { assertAbilityDataSource, isGeneralAbilityDataSource } from "../../types";
import { useUpdate } from "../../hooks/useUpdate";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { Checkbox } from "../inputs/Checkbox";
import { SpecialityList } from "../abilities/SpecialityList";

type AbilityEditSlugProps = {
  ability: GumshoeItem,
};

export const AbilityEditSlug: React.FC<AbilityEditSlugProps> = ({ ability }) => {
  assertAbilityDataSource(ability.data);
  const app = useContext(ActorSheetAppContext);
  const onDragStart = useCallback((e: React.DragEvent<HTMLAnchorElement>) => {
    if (app !== null) {
      (app as any)._onDragStart(e);
    }
  }, [app]);
  const updateRating = useCallback((rating) => { ability.setRating(rating); }, [ability]);
  const updateOccupational = useUpdate(ability, (occupational) => ({ data: { occupational } }));
  const updateCanBeInvestigative = useUpdate(ability, (canBeInvestigative) => ({ data: { canBeInvestigative } }));

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
      <div css={{ gridColumn: "rating" }} >
        <AsyncNumberInput
          min={0}
          value={ability.data.data.rating}
          onChange={updateRating}
          noPlusMinus={true}
          css={{ width: "2em", height: "1em" }}
        />
      </div>
      <div css={{ gridColumn: "isocc" }} >
        <Checkbox
          checked={ability.data.data.occupational}
          onChange={(t) => {
            updateOccupational(t);
          }}
        />
      </div>
      {isGeneralAbilityDataSource(ability.data) && (
        <div css={{ gridColumn: "canbeinv" }}>
          <Checkbox
            checked={ability.data.data.canBeInvestigative}
            onChange={(t) => {
              updateCanBeInvestigative(t);
            }}
          />
        </div>
      )}
      {ability.getHasSpecialities() && (
        <div css={{ paddingLeft: "1em", gridColumn: "ability" }}>
          <SpecialityList ability={ability} />
        </div>
      )}
    </Fragment>
  );
};
