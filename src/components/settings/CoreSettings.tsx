import React, { useCallback } from "react";
import * as constants from "../../constants";
import { assertGame } from "../../functions";
import { SettingsDict } from "../../settings";
import { InputGrid } from "../inputs/InputGrid";
import { Setters } from "./Settings";
import { SettingsGridField } from "./SettingsGridField";
import { pathOfCthulhuPreset } from "../../presets";
import { runtimeConfig } from "../../runtime";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { ListEdit } from "../inputs/ListEdit";

export const CoreSettings: React.FC<{
  tempSettings: SettingsDict,
  setters: Setters,
  setTempSettings: (settings: SettingsDict) => void,
  tempSettingsRef: React.MutableRefObject<SettingsDict>,
}> = ({ tempSettings, setters, setTempSettings, tempSettingsRef }) => {
  const presets = runtimeConfig.presets;

  const onSelectPreset = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      assertGame(game);
      const presetId = e.currentTarget.value;
      if (presetId === constants.customSystem) {
        setters.systemPreset(presetId);
        return;
      }
      const preset = presets[presetId];
      if (!preset) {
        throw new Error(
          "Somehow ended up picking a preset which doesnae exist",
        );
      }
      setTempSettings({
        // we start with a safe default (this is typed as Required<> so it will
        // always contain one-of-everything)
        ...pathOfCthulhuPreset,
        // layer on top the current temp settings - this way we keep any values
        // not in the preset
        ...tempSettingsRef.current,
        // now the preset
        ...preset,
        // and finally, set the actual preset id
        systemPreset: presetId,
      });
    },
    [presets, setTempSettings, setters, tempSettingsRef],
  );

  let idx = 0;

  return (
    <InputGrid
      css={{
        flex: 1,
        overflow: "auto",
      }}
    >
      <SettingsGridField label="System Preset">
        <select value={tempSettings.systemPreset} onChange={onSelectPreset}>
          {Object.keys(presets).map<JSX.Element>((presetId: string) => (
            <option key={presetId} value={presetId}>
              {presets[presetId].displayName}
            </option>
          ))}
          {tempSettings.systemPreset === constants.customSystem && (
            <option value={constants.customSystem}>Custom</option>
          )}
        </select>
      </SettingsGridField>
      <SettingsGridField label="Visual Theme" index={idx++}>
        <select
          value={tempSettings.defaultThemeName}
          onChange={(e) => {
            setters.defaultThemeName(e.currentTarget.value);
          }}
        >
          {Object.keys(runtimeConfig.themes).map<JSX.Element>(
            (themeName: string) => (
              <option key={themeName} value={themeName}>
                {runtimeConfig.themes[themeName].displayName}
              </option>
            ),
          )}
        </select>
      </SettingsGridField>
      <SettingsGridField label="Occupation Label" index={idx++}>
        <AsyncTextInput
          value={tempSettings.occupationLabel}
          onChange={setters.occupationLabel}
        />
      </SettingsGridField>
      <SettingsGridField label="Short Notes Fields" index={idx++}>
        <ListEdit
          value={tempSettings.shortNotes}
          onChange={setters.shortNotes}
        />
      </SettingsGridField>
      <SettingsGridField label="Long Notes Fields" index={idx++}>
        <ListEdit value={tempSettings.longNotes} onChange={setters.longNotes} />
      </SettingsGridField>

      <SettingsGridField label="Generic Occupation" index={idx++}>
        <AsyncTextInput
          onChange={setters.genericOccupation}
          value={tempSettings.genericOccupation}
        />
      </SettingsGridField>

    </InputGrid>
  );
};

CoreSettings.displayName = "CoreSettings";
