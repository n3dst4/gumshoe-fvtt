import React, { useContext } from "react";

import { getDevMode } from "../../functions";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { Checkbox } from "../inputs/Checkbox";
import { InputGrid } from "../inputs/InputGrid";
import { ListEdit } from "../inputs/ListEdit";
import { Translate } from "../Translate";
import { StateContext } from "./contexts";
import { SettingsGridField } from "./SettingsGridField";
import { Setters } from "./types";

export const MiscSettings: React.FC<{
  setters: Setters;
}> = ({ setters }) => {
  const isDevMode = getDevMode();

  let idx = 0;

  const { settings } = useContext(StateContext);

  return (
    <InputGrid
      css={{
        flex: 1,
        overflow: "auto",
      }}
    >
      <SettingsGridField label="Custom themes path" index={idx++}>
        <AsyncTextInput
          onChange={setters.customThemePath}
          value={settings.customThemePath}
        />
      </SettingsGridField>
      <SettingsGridField label="Use turn-passing initiative?" index={idx++}>
        <Checkbox
          checked={settings.useTurnPassingInitiative}
          onChange={setters.useTurnPassingInitiative}
        />
      </SettingsGridField>

      {isDevMode && (
        <SettingsGridField label="Debug translations?" index={idx++}>
          <Checkbox
            checked={settings.debugTranslations}
            onChange={setters.debugTranslations}
          />
        </SettingsGridField>
      )}
      {/* ####################################################################
          MORIBUND WORLD STUFF BELOW HERE
        #################################################################### */}

      <hr css={{ gridColumn: "label / end" }} />
      <h2 css={{ gridColumn: "label / end" }}>
        <Translate>Settings for Moribund World users</Translate>
      </h2>
      <SettingsGridField
        label="Use Moribund World-style abilities"
        index={idx++}
      >
        <Checkbox
          checked={settings.useMwStyleAbilities}
          onChange={setters.useMwStyleAbilities}
        />
      </SettingsGridField>
      <SettingsGridField label="Use alternative item types" index={idx++}>
        <Checkbox
          checked={settings.mwUseAlternativeItemTypes}
          onChange={setters.mwUseAlternativeItemTypes}
        />
      </SettingsGridField>
      <SettingsGridField label="Hidden Short Notes Fields" index={idx++}>
        <ListEdit
          value={settings.mwHiddenShortNotes}
          onChange={setters.mwHiddenShortNotes}
        />
      </SettingsGridField>
      <SettingsGridField label="Use injury status" index={idx++}>
        <Checkbox
          checked={settings.useMwInjuryStatus}
          onChange={setters.useMwInjuryStatus}
        />
      </SettingsGridField>
    </InputGrid>
  );
};

MiscSettings.displayName = "MiscSettings";
