/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { TrailItem } from "../../module/TrailItem";
import { OnlyProps, WeaponData } from "../../types";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { Checkbox } from "../inputs/Checkbox";
import { GridField } from "../inputs/GridField";

type WeaponNumbers = OnlyProps<WeaponData, number>;
type WeaponBools = OnlyProps<WeaponData, boolean>;

type WeaponRangeProps = {
  label: string;
  weapon: TrailItem;
  valueField: keyof WeaponNumbers;
  enabledField: keyof WeaponBools;
};

export const WeaponRange: React.FC<WeaponRangeProps> = ({
  label,
  weapon,
  valueField,
  enabledField,
}) => {
  return (
    <GridField label={label}>
      <div
        css={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Checkbox
          checked={weapon.getter(enabledField)()}
          onChange={weapon.setter(enabledField)}
        />
        <AsyncNumberInput
          css={{ flex: 1 }}
          disabled={!weapon.getter(enabledField)()}
          value={weapon.getter(valueField)()}
          onChange={weapon.setter(valueField)}
        />
      </div>
    </GridField>
  );
};
