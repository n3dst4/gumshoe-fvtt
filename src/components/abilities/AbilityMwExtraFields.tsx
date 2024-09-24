
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { assertGeneralAbilityItem } from "../../v10Types";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";

type AbilityMwExtraFieldsProps = {
  ability: InvestigatorItem;
};

export const AbilityMwExtraFields = ({
  ability,
}: AbilityMwExtraFieldsProps) => {
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
