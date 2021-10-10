/** @jsx jsx */
import React, { Fragment, useCallback, useContext } from "react";
import { jsx } from "@emotion/react";
import { GumshoeItem } from "../../module/GumshoeItem";
import { ActorSheetAppContext } from "../FoundryAppContext";
import { assertAbilityDataSource } from "../../types";
import { useUpdate } from "../../hooks/useUpdate";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { Checkbox } from "../inputs/Checkbox";
import { SpecialityList } from "../abilities/SpecialityList";

type AbilitySlugEditProps = {
  ability: GumshoeItem,
};

export const AbilitySlugEdit: React.FC<AbilitySlugEditProps> = ({ ability }) => {
  assertAbilityDataSource(ability.data);
  const app = useContext(ActorSheetAppContext);
  const onDragStart = useCallback((e: React.DragEvent<HTMLAnchorElement>) => {
    if (app !== null) {
      (app as any)._onDragStart(e);
    }
  }, [app]);
  const updateRating = useCallback((rating) => { ability.setRatingRefresh(rating); }, [ability]);
  const updateOccupational = useUpdate(ability, (occupational) => ({ data: { occupational } }));

  return (
    <Fragment
      key={ability.id}
    >
      <div css={{ gridColumn: "isocc", justifySelf: "center" }} >
        <Checkbox
          checked={ability.data.data.occupational}
          onChange={(t) => {
            updateOccupational(t);
          }}
        />
      </div>
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
      <div css={{ gridColumn: "rating", justifySelf: "center" }} >
        <AsyncNumberInput
          min={0}
          value={ability.data.data.rating}
          onChange={updateRating}
          noPlusMinus={true}
          css={{ width: "2em" }}
        />
      </div>
      {ability.getHasSpecialities() && (ability.data.data.rating > 0) && (
        <div css={{ paddingLeft: "1em", gridColumn: "ability", width: "2em" }}>
          <SpecialityList ability={ability} />
        </div>
      )}
    </Fragment>
  );
};
