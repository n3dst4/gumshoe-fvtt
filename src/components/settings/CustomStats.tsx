import React, { useCallback } from "react";
import { renameProperty } from "../../functions";
import { SettingsDict } from "../../settings";
import { InputGrid } from "../inputs/InputGrid";
import { Setters } from "./Settings";
import { SettingsGridField } from "./SettingsGridField";
import { StatsSettingsEditor } from "./StatsSettingsEditor";
import { Stat } from "@lumphammer/investigator-fvtt-types";

export const CustomStats: React.FC<{
  tempSettings: SettingsDict,
  setters: Setters,
  setTempSettings: (settings: SettingsDict) => void,
  tempSettingsRef: React.MutableRefObject<SettingsDict>,
}> = ({ tempSettings, setters, setTempSettings, tempSettingsRef }) => {
  const onChangePCStat = useCallback(
    (stat: Stat, id: string) => {
      setters.pcStats({
        ...tempSettingsRef.current.pcStats,
        [id]: stat,
      });
    },
    [setters, tempSettingsRef],
  );
  const onChangeNPCStat = useCallback(
    (stat: Stat, id: string) => {
      setters.npcStats({
        ...tempSettingsRef.current.npcStats,
        [id]: stat,
      });
    },
    [setters, tempSettingsRef],
  );
  const onChangePCStatId = useCallback(
    (oldId: string, newId: string) => {
      const result = renameProperty(
        oldId,
        newId,
        tempSettingsRef.current.pcStats,
      );
      setters.pcStats(result);
    },
    [setters, tempSettingsRef],
  );
  const onChangeNPCStatId = useCallback(
    (oldId: string, newId: string) => {
      const result = renameProperty(
        oldId,
        newId,
        tempSettingsRef.current.npcStats,
      );
      setters.npcStats(result);
    },
    [setters, tempSettingsRef],
  );

  let idx = 0;

  return (
    <div>
      <InputGrid
        css={{
          flex: 1,
          overflow: "auto",
        }}
      >
        <SettingsGridField label="PC Stats" index={idx++}>
          <StatsSettingsEditor
            stats={tempSettings.pcStats}
            onChange={onChangePCStat}
            onChangeId={onChangePCStatId}
          />
        </SettingsGridField>
        <SettingsGridField label="NPC Stats" index={idx++}>
          <StatsSettingsEditor
            stats={tempSettings.npcStats}
            onChange={onChangeNPCStat}
            onChangeId={onChangeNPCStatId}
          />
        </SettingsGridField>
      </InputGrid>
    </div>
  );
};

CustomStats.displayName = "CustomStats";
