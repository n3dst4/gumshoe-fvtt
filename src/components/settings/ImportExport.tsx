import React, { useContext } from "react";

import { confirmADoodleDo } from "../../functions/confirmADoodleDo";
import { saveJson } from "../../functions/saveFile";
import { getUserFile } from "../../functions/utilities";
import { TextInput } from "../inputs/TextInput";
import { Translate } from "../Translate";
import { DirtyContext, DispatchContext, StateContext } from "./contexts";
import { getExportableSettingsDict } from "./getExportableSettingsDict";
import { SettingsGridField } from "./SettingsGridField";
import { store } from "./store";

export const ImportExport: React.FC = () => {
  let idx = 0;
  const dispatch = useContext(DispatchContext);
  const { settings } = useContext(StateContext);
  const isDirty = useContext(DirtyContext);

  const [filename, setFilename] = React.useState<string>("settings");

  const handleExport = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const exportableSettings = getExportableSettingsDict(settings);
    saveJson(exportableSettings, filename);
    ui.notifications?.info("Settings exported to file");
  };

  const handleImport = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    const jsonText = await getUserFile("json");
    const newSettings = JSON.parse(jsonText);
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
    if (aye) {
      dispatch(store.creators.setSome({ newSettings }));
    }
  };

  return (
    <>
      <hr css={{ gridColumn: "label / end" }} />
      <h2 css={{ gridColumn: "label / end" }}>
        <Translate>Import/Export</Translate>
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
