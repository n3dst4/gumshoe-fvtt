import React, { Fragment } from "react";

import { InvestigatorItem } from "../../module/InvestigatorItem";
import { settings } from "../../settings/settings";
import {
  isGeneralAbilityItem,
  isInvestigativeAbilityItem,
} from "../../v10Types";
import { ModeSelect } from "../ItemSheetFramework/ModeSelect";
import { ItemSheetFramework } from "../ItemSheetFramework/SheetFramework";
import { ItemSheetMode } from "../ItemSheetFramework/types";
import { Translate } from "../Translate";
import { AbilityConfig } from "./AbilityConfig";
import { AbilityMainBits } from "./AbilityMainBits";
import { AbilityMwExtraFields } from "./AbilityMwExtraFields";
import { AbilityTest } from "./AbilityTest";
import { AbilityTestMW } from "./AbilityTestMW";

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
          {ability.actor && <span> ({ability.actor.name})</span>}
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
          ) : isInvestigativeAbilityItem(ability) &&
            ability.system.isQuickShock ? null : (
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
