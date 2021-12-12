/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { getCombatAbilities } from "../../settingsHelpers";

type CombatAbilityDropDownProps = {
  value: string,
  onChange: (newValue: string) => void,
};

export const CombatAbilityDropDown: React.FC<CombatAbilityDropDownProps> = ({
  value,
  onChange: onChangeOrig,
}) => {
  const combatAbilities = getCombatAbilities().sort();

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
      css={{ width: "9.5em" }}
    >
      {combatAbilities.map<JSX.Element>((ability) => (
        <option key={ability} value={ability}>{ability}</option>
      ))}
    </select>
  );
};
