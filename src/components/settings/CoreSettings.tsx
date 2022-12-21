import React, { useCallback, useContext } from "react";
import * as constants from "../../constants";
import { assertGame } from "../../functions";
import { InputGrid } from "../inputs/InputGrid";
import { Setters } from "./types";
import { SettingsGridField } from "./SettingsGridField";
import { runtimeConfig } from "../../runtime";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { ListEdit } from "../inputs/ListEdit";
import { DispatchContext, StateContext } from "./contexts";
import { slice } from "./reducer";

interface CoreSettingsProps {
  setters: Setters;
}

export const CoreSettings: React.FC<CoreSettingsProps> = ({
  setters,
}) => {
  const presets = runtimeConfig.presets;
  const { settings } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

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
      dispatch(slice.creators.applyPreset({ preset, presetId }));
    },
    [dispatch, presets, setters],
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
        <select value={settings.systemPreset} onChange={onSelectPreset}>
          {Object.keys(presets).map<JSX.Element>((presetId: string) => (
            <option key={presetId} value={presetId}>
              {presets[presetId].displayName}
            </option>
          ))}
          {settings.systemPreset === constants.customSystem && (
            <option value={constants.customSystem}>Custom</option>
          )}
        </select>
      </SettingsGridField>
      <SettingsGridField label="Visual Theme" index={idx++}>
        <select
          value={settings.defaultThemeName}
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
          value={settings.occupationLabel}
          onChange={setters.occupationLabel}
        />
      </SettingsGridField>
      <SettingsGridField label="Short Notes Fields" index={idx++}>
        <ListEdit
          value={settings.shortNotes}
          onChange={setters.shortNotes}
        />
      </SettingsGridField>
      <SettingsGridField label="Long Notes Fields" index={idx++}>
        <ListEdit value={settings.longNotes} onChange={setters.longNotes} />
      </SettingsGridField>

      <SettingsGridField label="Generic Occupation" index={idx++}>
        <AsyncTextInput
          onChange={setters.genericOccupation}
          value={settings.genericOccupation}
        />
      </SettingsGridField>

    </InputGrid>
  );
};

CoreSettings.displayName = "CoreSettings";
