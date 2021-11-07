/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { assertGeneralAbilityDataSource } from "../../types";
import { AsyncTextInput } from "../inputs/AsyncTextInput";

type AbilityMwExtraFieldsProps = {
  ability: InvestigatorItem,
};

export const AbilityMwExtraFields: React.FC<AbilityMwExtraFieldsProps> = ({
  ability,
}) => {
  assertGeneralAbilityDataSource(ability.data);

  return (
    <InputGrid>
      <GridField label="Trumps or Counters">
          <AsyncTextInput
            value={ability.data.data.mwTrumps}
            onChange={ability.setMwTrumps}
          />
      </GridField>
    </InputGrid>
  );
};
