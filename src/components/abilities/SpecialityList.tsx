/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { TrailItem } from "../../module/TrailItem";
import { SpecListItem } from "./SpecListItem";

type SpecialityListProps = {
  ability: TrailItem;
};

export const SpecialityList: React.FC<SpecialityListProps> = ({ ability }) => {
  const updateSpecialities = useCallback(
    (newVal: string, index: number) => {
      const newSpecs = [...ability.getSpecialities()];
      newSpecs[index] = newVal;
      ability.setSpecialities(newSpecs);
    },
    [ability],
  );

  return (
    <div
      css={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(8em, 1fr))",
        gridAutoColumns: "minMax(6em, 1fr)",
        gridAutoRows: "auto",
        gap: "0.5em",
        flexWrap: "wrap",
      }}
    >
      {ability.getSpecialities().map((spec, i) => (
        <SpecListItem
          key={i}
          value={spec}
          onChange={updateSpecialities}
          index={i}
          disabled={!ability.data.data.hasSpeciality}
        />
      ))}
      {ability.getRating() === 0 &&
        <i>Rating must be at least 1 to add specialities</i>}
    </div>
  );
};
