/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { settings } from "../../startup/registerSettings";

type CombatAbilityDropDownProps = {
  value: string,
  onChange: (newValue: string) => void,
};

export const CombatAbilityDropDown: React.FC<CombatAbilityDropDownProps> = ({
  value,
  onChange: onChangeOrig,
}) => {
  const combatAbilities = settings.combatAbilities.get().sort();

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
    >
      {combatAbilities.map<JSX.Element>((ability) => (
        <option key={ability} value={ability}>{ability}</option>
      ))}
    </select>
  );
};
