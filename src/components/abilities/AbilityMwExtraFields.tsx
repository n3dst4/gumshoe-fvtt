/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { assertGeneralAbilityDataSource } from "../../types";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { AsyncTextArea } from "../inputs/AsyncTextArea";

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
      <GridField label="Is Trumped or Countered by">
          <AsyncTextInput
            value={ability.data.data.mwTrumpedBy}
            onChange={ability.setMwTrumpedBy}
          />
      </GridField>
      <GridField label="Benefits">
          <AsyncTextArea
            value={ability.data.data.mwBenefits}
            onChange={ability.setMwBenefits}
          />
      </GridField>
      <GridField label="Drawbacks">
          <AsyncTextArea
            value={ability.data.data.mwDrawbacks}
            onChange={ability.setMwDrawbacks}
          />
      </GridField>
      <GridField label="Refreshes">
          <AsyncTextInput
            value={ability.data.data.mwRefreshes}
            onChange={ability.setMwRefreshes}
          />
      </GridField>
      <GridField label="Automatic Success">
          <AsyncTextInput
            value={ability.data.data.mwAutomaticSuccess}
            onChange={ability.setMwAutomaticSuccess}
          />
      </GridField>

    </InputGrid>
  );
};
