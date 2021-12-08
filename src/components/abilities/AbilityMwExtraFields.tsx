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
    <InputGrid
      css={{
        paddingTop: "0.5em",
      }}
    >
      <GridField label="Trumps">
          <AsyncTextInput
            value={ability.data.data.mwTrumps}
            onChange={ability.setMwTrumps}
          />
      </GridField>
      <GridField label="Trumped by">
          <AsyncTextInput
            value={ability.data.data.mwTrumpedBy}
            onChange={ability.setMwTrumpedBy}
          />
      </GridField>
    </InputGrid>
  );
};
