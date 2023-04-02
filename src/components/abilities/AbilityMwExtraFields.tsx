import React from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { assertGeneralAbilityItem } from "../../v10Types";

type AbilityMwExtraFieldsProps = {
  ability: InvestigatorItem;
};

export const AbilityMwExtraFields: React.FC<AbilityMwExtraFieldsProps> = ({
  ability,
}) => {
  assertGeneralAbilityItem(ability);

  return (
    <InputGrid
      css={{
        paddingTop: "0.5em",
      }}
    >
      <GridField label="Trumps">
        <AsyncTextInput
          value={ability.system.mwTrumps}
          onChange={ability.setMwTrumps}
        />
      </GridField>
      <GridField label="Trumped by">
        <AsyncTextInput
          value={ability.system.mwTrumpedBy}
          onChange={ability.setMwTrumpedBy}
        />
      </GridField>
    </InputGrid>
  );
};
