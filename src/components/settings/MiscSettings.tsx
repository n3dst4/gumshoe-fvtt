import React from "react";
import { getDevMode } from "../../functions";
import { SettingsDict } from "../../settings";
import { InputGrid } from "../inputs/InputGrid";
import { Setters } from "./Settings";
import { SettingsGridField } from "./SettingsGridField";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { Checkbox } from "../inputs/Checkbox";
import { Translate } from "../Translate";
import { ListEdit } from "../inputs/ListEdit";

export const MiscSettings: React.FC<{
  tempSettings: SettingsDict,
  setters: Setters,
}> = ({ tempSettings, setters }) => {
  const isDevMode = getDevMode();

  let idx = 0;

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
          value={tempSettings.customThemePath}
        />
      </SettingsGridField>
      <SettingsGridField label="Use turn-passing initiative?" index={idx++}>
        <Checkbox
          checked={tempSettings.useTurnPassingInitiative}
          onChange={setters.useTurnPassingInitiative}
        />
      </SettingsGridField>

      {isDevMode && (
        <SettingsGridField label="Debug translations?" index={idx++}>
          <Checkbox
            checked={tempSettings.debugTranslations}
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
          checked={tempSettings.useMwStyleAbilities}
          onChange={setters.useMwStyleAbilities}
        />
      </SettingsGridField>
      <SettingsGridField label="Use alternative item types" index={idx++}>
        <Checkbox
          checked={tempSettings.mwUseAlternativeItemTypes}
          onChange={setters.mwUseAlternativeItemTypes}
        />
      </SettingsGridField>
      <SettingsGridField label="Hidden Short Notes Fields" index={idx++}>
        <ListEdit
          value={tempSettings.mwHiddenShortNotes}
          onChange={setters.mwHiddenShortNotes}
        />
      </SettingsGridField>
      <SettingsGridField label="Use injury status" index={idx++}>
        <Checkbox
          checked={tempSettings.useMwInjuryStatus}
          onChange={setters.useMwInjuryStatus}
        />
      </SettingsGridField>
    </InputGrid>
  );
};

MiscSettings.displayName = "MiscSettings";
