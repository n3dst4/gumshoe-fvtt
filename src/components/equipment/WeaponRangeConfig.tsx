import React from "react";

import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { GridField } from "../inputs/GridField";
import { Toggle } from "../inputs/Toggle";

type WeaponRangeProps = {
  label: string;
  damage: number;
  enabled: boolean;
  setDamage: (value: number) => void;
  setEnabled: (enabled: boolean) => void;
};

export const WeaponRange: React.FC<WeaponRangeProps> = ({
  label,
  damage,
  enabled,
  setDamage,
  setEnabled,
}) => {
  return (
    <GridField label={label}>
      <div
        css={{
          display: "flex",
          gap: "0.5em",
          flexDirection: "row",
        }}
      >
        <Toggle checked={enabled} onChange={setEnabled} />
        <AsyncNumberInput
          css={{ flex: 1 }}
          disabled={!enabled}
          value={damage}
          onChange={setDamage}
        />
      </div>
    </GridField>
  );
};
