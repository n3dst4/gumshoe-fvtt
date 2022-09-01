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
  tempSettingsRef: React.MutableRefObject<SettingsDict>,
}> = ({ tempSettings, setters, tempSettingsRef }) => {
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

  const onDeletePCStat = useCallback((id: string) => {
    const result = {
      ...tempSettingsRef.current.pcStats,
    };
    delete result[id];
    setters.pcStats(result);
  }, [setters, tempSettingsRef]);

  const onDeleteNPCStat = useCallback((id: string) => {
    const result = {
      ...tempSettingsRef.current.npcStats,
    };
    delete result[id];
    setters.npcStats(result);
  }, [setters, tempSettingsRef]);

  const onAddPCStat = useCallback(() => {
    setters.pcStats({
      ...tempSettingsRef.current.pcStats,
      [`stat${Object.keys(tempSettingsRef.current.pcStats).length}`]: {
        name: "",
        default: 0,
      },
    });
  }, [setters, tempSettingsRef]);

  const onAddNPCStat = useCallback(() => {
    setters.npcStats({
      ...tempSettingsRef.current.npcStats,
      [`stat${Object.keys(tempSettingsRef.current.npcStats).length}`]: {
        name: "",
        default: 0,
      },
    });
  }, [setters, tempSettingsRef]);

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
            onDelete={onDeletePCStat}
            onAdd={onAddPCStat}
          />
        </SettingsGridField>
        <SettingsGridField label="NPC Stats" index={idx++}>
          <StatsSettingsEditor
            stats={tempSettings.npcStats}
            onChange={onChangeNPCStat}
            onChangeId={onChangeNPCStatId}
            onDelete={onDeleteNPCStat}
            onAdd={onAddNPCStat}
          />
        </SettingsGridField>
      </InputGrid>
    </div>
  );
};

CustomStats.displayName = "CustomStats";
