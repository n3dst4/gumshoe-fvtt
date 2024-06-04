import React from "react";

import { absoluteCover } from "../../absoluteCover";
import { TabContainer } from "../../TabContainer";
import { StatsSettingsEditor } from "./StatsSettingsEditor";

export const StatsSettings: React.FC = () => {
  return (
    <div
      css={{
        ...absoluteCover,
        margin: "1em",
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
