/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Stat } from "@lumphammer/investigator-fvtt-types";
import React, { ReactNode } from "react";
import { StatSettingsRow } from "./StatSettingsRow";

interface StatsSettingsEditorProps {
  stats: Record<string, Stat>;
  onChange: (stat: Stat, id: string) => void;
  onChangeId: (oldId: string, newId: string) => void;
}

export const StatsSettingsEditor: React.FC<StatsSettingsEditorProps> = ({
  stats,
  onChange,
  onChangeId,
}: StatsSettingsEditorProps) => {
  return (
    <div>
      {
        Object.keys(stats).map<ReactNode>((key, i) => {
          return (
            <StatSettingsRow
              key={i}
              stat={stats[key]}
              id={key}
              index={i + 2}
              onChange={onChange}
              onChangeId={onChangeId}
            />
          );
        })
      }
    </div>
  );
};
