import React, { Fragment } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { AbilityTest } from "./AbilityTest";
import { AbilityMainBits } from "./AbilityMainBits";
import { AbilityConfig } from "./AbilityConfig";
import { Translate } from "../Translate";
import { AbilityTestMW } from "./AbilityTestMW";
import { AbilityMwExtraFields } from "./AbilityMwExtraFields";
import { isGeneralAbilityDataSource } from "../../typeAssertions";
import { settings } from "../../settings";
import { ItemSheetFramework } from "../ItemSheetFramework/SheetFramework";
import { ItemSheetMode } from "../ItemSheetFramework/types";
import { ModeSelect } from "../ItemSheetFramework/ModeSelect";

type AbilitySheetProps = {
  ability: InvestigatorItem;
  application: ItemSheet;
};

export const AbilitySheet: React.FC<AbilitySheetProps> = ({
  ability,
  application,
}) => {
  const isGeneral = isGeneralAbilityItem(ability);

  const useMwStyleAbilities = settings.useMwStyleAbilities.get();

  return (
    <ItemSheetFramework
      supertitle={
        <>
          <Translate>
            {isGeneral ? "General ability" : "Investigative ability"}
          </Translate>
          {ability.actor && <span> ({ability.actor.data.name})</span>}
        </>
      }
      item={ability}
      application={application}
    >
      <ModeSelect mode={ItemSheetMode.Config}>
        <AbilityConfig ability={ability} />
      </ModeSelect>
      <ModeSelect mode={ItemSheetMode.Main}>
        <Fragment>
          {/* Spending/testing area */}
          {ability.isOwned && useMwStyleAbilities ? (
            <AbilityTestMW ability={ability} />
          ) : (
            <AbilityTest ability={ability} />
          )}
          <AbilityMainBits ability={ability} />
          {settings.useMwStyleAbilities.get() && (
            <AbilityMwExtraFields ability={ability} />
          )}
        </Fragment>
      </ModeSelect>
    </ItemSheetFramework>
  );
};
