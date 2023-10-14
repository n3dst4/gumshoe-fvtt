import React, { useContext } from "react";
import { fromZodError } from "zod-validation-error";

import { confirmADoodleDo } from "../../functions/confirmADoodleDo";
import { saveJson } from "../../functions/saveFile";
import { getUserFile } from "../../functions/utilities";
import { SettingsDict, superValidator } from "../../settings/settings";
import { TextInput } from "../inputs/TextInput";
import { Translate } from "../Translate";
import { DirtyContext, DispatchContext, StateContext } from "./contexts";
import { getExportableSettingsDict } from "./getExportableSettingsDict";
import { SettingsGridField } from "./SettingsGridField";
import { store } from "./store";

export const ImportExport: React.FC = () => {
  let idx = 0;
  const dispatch = useContext(DispatchContext);
  const { settings: settingsState } = useContext(StateContext);
  const isDirty = useContext(DirtyContext);

  const [filename, setFilename] = React.useState<string>("settings");

  const handleExport = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const exportableSettings = getExportableSettingsDict(settingsState);
    saveJson(exportableSettings, filename);
    ui.notifications?.info("Settings exported to file");
  };

  const handleImport = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    const aye =
      !isDirty() ||
      (await confirmADoodleDo({
        message:
          "You have unsaved changes. Are you sure you want to overwrite them?",
        confirmText: "Yes, discard my changes",
        cancelText: "Whoops, No!",
        confirmIconClass: "fas fa-times",
        resolveFalseOnCancel: true,
      }));
    if (!aye) {
      return;
    }

    try {
      const jsonText = await getUserFile("json");
      const candidateSettings = JSON.parse(jsonText);

      try {
        const newSettings: Partial<SettingsDict> =
          superValidator.parse(candidateSettings);
        dispatch(store.creators.setSome({ newSettings }));
        ui.notifications?.info("Successfully imported settings");
      } catch (e) {
        throw fromZodError(e as any);
      }
    } catch (e) {
      ui.notifications?.error(`Error importing settings: ${e}`);
    }
  };

  return (
    <>
      <hr css={{ gridColumn: "label / end" }} />
      <h2 css={{ gridColumn: "label / end" }}>
        <Translate>Import/Export</Translate> (BETA - please report bugs!)
      </h2>
      <SettingsGridField label="Export settings to file" index={idx++}>
        <Translate>ItemName</Translate>
        <TextInput value={filename} onChange={setFilename} />
        <button onClick={handleExport}>
          <Translate>Export</Translate>
        </button>
      </SettingsGridField>
      <SettingsGridField label="Import settings from file" index={idx++}>
        <button onClick={handleImport}>
          <Translate>Import</Translate>
        </button>
      </SettingsGridField>
    </>
  );
};

ImportExport.displayName = "ImportExport";
