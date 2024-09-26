import React, { useCallback, useState } from "react";

import { settings } from "../../settings/settings";
import { Translate } from "../Translate";
import { AsyncTextInput } from "./AsyncTextInput";

const customAbilityToken = "CUSTOM_ABILITY_TOKEN";

type CombatAbilityDropDownProps = {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
};

export const CombatAbilityDropDown = ({
  value,
  onChange: onChangeOrig,
  className,
}: CombatAbilityDropDownProps) => {
  const combatAbilities = settings.combatAbilities.get().toSorted();

  const [showCustomAbility, setShowCustomAbility] = useState(
    !combatAbilities.includes(value),
  );

  const effectiveValue = showCustomAbility ? customAbilityToken : value;

  const handleChangeInitiativeAbility = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.currentTarget.value === customAbilityToken) {
        setShowCustomAbility(true);
      } else {
        setShowCustomAbility(false);
        onChangeOrig(e.currentTarget.value);
      }
    },
    [onChangeOrig],
  );

  return (
    <div css={{ display: "flex", flexDirection: "column", gap: "0.3em" }}>
      <select
        value={effectiveValue}
        onChange={handleChangeInitiativeAbility}
        css={{ width: "8.5em" }}
        className={className}
      >
        {combatAbilities.map<JSX.Element>((ability) => (
          <option key={ability} value={ability}>
            {ability}
          </option>
        ))}
        <option value={customAbilityToken}>
          <Translate>Other</Translate>
        </option>
      </select>
      {showCustomAbility && (
        <AsyncTextInput
          value={value}
          onChange={onChangeOrig}
          css={{ width: "8.5em" }}
        />
      )}
    </div>
  );
};
