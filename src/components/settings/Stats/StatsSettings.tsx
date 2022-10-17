import React from "react";
import { InputGrid } from "../../inputs/InputGrid";
import { SettingsGridField } from "../SettingsGridField";
import { StatsSettingsEditor } from "./StatsSettingsEditor";

export const StatsSettings: React.FC = () => {
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
          <StatsSettingsEditor which="pcStats" />
        </SettingsGridField>
        <SettingsGridField label="NPC Stats" index={idx++}>
          <StatsSettingsEditor which="npcStats" />
        </SettingsGridField>
      </InputGrid>
    </div>
  );
};

StatsSettings.displayName = "CustomStats";
