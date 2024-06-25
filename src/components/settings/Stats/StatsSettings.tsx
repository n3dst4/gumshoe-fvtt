import React from "react";

import { absoluteCover } from "../../absoluteCover";
import { InputGrid } from "../../inputs/InputGrid";
import { TabContainer } from "../../TabContainer";
import { StatsSettingsEditor } from "./StatsSettingsEditor";

export const StatsSettings: React.FC = () => {
  const idx = 0;

  return (
    <div
      css={{
        ...absoluteCover,
        margin: "1em",
        // backgroundColor: "rgba(0, 0, 0, 0.5)",
        col,
      }}
    >
      <TabContainer
        defaultTab="pcStats"
        tabs={[
          {
            id: "pcStats",
            label: "PC Stats",
            content: <StatsSettingsEditor which="npcStats" />,
          },
          {
            id: "npcStats",
            label: "NPC Stats",
            content: <StatsSettingsEditor which="pcStats" />,
          },
        ]}
      />
    </div>
  );
};

StatsSettings.displayName = "StatsSettings";
