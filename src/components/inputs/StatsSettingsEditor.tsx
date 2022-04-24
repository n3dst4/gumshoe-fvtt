/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Stat } from "@lumphammer/investigator-fvtt-types";
import React, { ReactNode } from "react";
import { StatSettingsRow } from "./StatSettingsRow";

interface StatsSettingsEditorProps {
  stats: Record<string, Stat>;
  onChange: (stat: Stat, id: string) => void;
}

export const StatsSettingsEditor: React.FC<StatsSettingsEditorProps> = ({
  stats,
  onChange,
}: StatsSettingsEditorProps) => {
  return (
    <div>
      {
        Object.keys(stats).map<ReactNode>((key, i) => {
          return (
            <StatSettingsRow
              key={key}
              stat={stats[key]}
              id={key}
              index={i + 2}
              onChange={onChange}
            />
          );
        })
      }
    </div>
  );
};
