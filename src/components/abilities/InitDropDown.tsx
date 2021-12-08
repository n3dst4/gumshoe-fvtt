/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
// import { InvestigatorItem } from "../../module/InvestigatorItem";
// import { SpecListItem } from "./SpecListItem";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { getCombatAbilities } from "../../settingsHelpers";
import { assertActiveCharacterDataSource } from "../../types";

type InitDropDownProps = {
  actor: InvestigatorActor,
};

export const InitDropDown: React.FC<InitDropDownProps> = ({
  actor,
}) => {
  assertActiveCharacterDataSource(actor.data);
  const onSelectInitiativeAbility = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedAbility = e.currentTarget.value;
      actor.update({
        data: {
          initiativeAbility: selectedAbility,
        },
      });
    },
    [actor],
  );

  return (
    <select
      value={actor.data.data.initiativeAbility}
      onChange={onSelectInitiativeAbility}
      css={{ width: "9.5em" }}
    >
      {getCombatAbilities().map<JSX.Element>((ability) => (
        <option key={ability} value={ability}>{ability}</option>
      ))}
    </select>
  );
};
