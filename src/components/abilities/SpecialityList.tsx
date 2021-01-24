/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { TrailItem } from "../../module/TrailItem";
import { SpecListItem } from "./SpecListItem";

type SpecialityListProps = {
  ability: TrailItem,
};

export const SpecialityList: React.FC<SpecialityListProps> = ({
  ability,
}) => {
  const updateSpecialities = useCallback((newVal: string, index: number) => {
    const newSpecs = [...ability.getSpecialities()];
    newSpecs[index] = newVal;
    ability.setSpecialities(newSpecs);
  }, [ability]);

  return (
    <div
      css={{
        display: "flex",
        flexDirection: "row",
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
      ))

      }
    </div>
  );
};
