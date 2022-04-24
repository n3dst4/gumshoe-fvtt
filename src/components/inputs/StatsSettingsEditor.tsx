/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ReactNode } from "react";
import { settings } from "../../settings";
import { StatSettingsRow } from "./StatSettingsRow";

interface StatsSettingsEditorProps {
  pcOrNpc: "pc"|"npc";
}

export const StatsSettingsEditor: React.FC<StatsSettingsEditorProps> = ({
  pcOrNpc,
}: StatsSettingsEditorProps) => {
  const stats = pcOrNpc === "pc" ? settings.pcStats.get() : settings.npcStats.get();

  return (
    <div
      css={{
        // display: "grid",
        // gridTemplateColumns: "[name] 1fr [defaul] 1fr [min] 1fr [max] 1fr [end]",
        // gridAutoRows: "max-content",
      }}
    >
      {
        Object.keys(stats).map<ReactNode>((key, i) => {
          return (
            <StatSettingsRow key={key} stat={stats[key]} id={key} index={i + 2} />
          );
        })
      }
    </div>
  );
};
