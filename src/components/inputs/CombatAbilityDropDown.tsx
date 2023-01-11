import React, { useCallback } from "react";
import { settings } from "../../settings";

type CombatAbilityDropDownProps = {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
};

export const CombatAbilityDropDown: React.FC<CombatAbilityDropDownProps> = ({
  value,
  onChange: onChangeOrig,
  className,
}) => {
  // spread here because settings are read-only and .sort() mutates the array
  const combatAbilities = [...settings.combatAbilities.get()].sort();

  const onSelectInitiativeAbility = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChangeOrig(e.currentTarget.value);
    },
    [onChangeOrig],
  );

  return (
    <select
      value={value}
      onChange={onSelectInitiativeAbility}
      css={{ width: "8.5em" }}
      className={className}
    >
      {combatAbilities.map<JSX.Element>((ability) => (
        <option key={ability} value={ability}>
          {ability}
        </option>
      ))}
    </select>
  );
};
