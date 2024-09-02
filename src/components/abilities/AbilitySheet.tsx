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
import { PushPoolButton } from "./PushPoolButton";

type AbilitySheetProps = {
  ability: InvestigatorItem;
  application: ItemSheet;
};

function getTopAreaContent(ability: InvestigatorItem) {
  if (
    // if we're doing WM, we show the MW test/spend box
    ability.isOwned &&
    settings.useMwStyleAbilities.get()
  ) {
    return <AbilityTestMW ability={ability} />;
  } else if (
    // QS abilities get nothing - they just sit there, existing
    isInvestigativeAbilityItem(ability) &&
    ability.system.isQuickShock
  ) {
    return null;
  } else if (
    // push pools get a PUSH button
    isGeneralAbilityItem(ability) &&
    ability.system.isPushPool
  ) {
    return <PushPoolButton ability={ability} />;
  } else {
    // everything else gets a spend/test box
    return <AbilityTest ability={ability} />;
  }
}

export const AbilitySheet: React.FC<AbilitySheetProps> = ({
  ability,
  application,
}) => {
  const isGeneral = isGeneralAbilityItem(ability);

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
          {getTopAreaContent(ability)}

          {/* Other bits */}
          <AbilityMainBits ability={ability} />
          {settings.useMwStyleAbilities.get() && (
            <AbilityMwExtraFields ability={ability} />
          )}
        </Fragment>
      </ModeSelect>
    </ItemSheetFramework>
  );
};
