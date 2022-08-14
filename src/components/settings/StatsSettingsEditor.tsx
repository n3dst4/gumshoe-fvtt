import { Stat } from "@lumphammer/investigator-fvtt-types";
import React, { ReactNode, useCallback } from "react";
import { Translate } from "../Translate";
import { StatSettingsRow } from "./StatSettingsRow";

interface StatsSettingsEditorProps {
  stats: Record<string, Stat>;
  onChange: (stat: Stat, id: string) => void;
  onChangeId: (oldId: string, newId: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const StatsSettingsEditor: React.FC<StatsSettingsEditorProps> = ({
  stats,
  onChange,
  onChangeId,
  onDelete,
  onAdd,
}: StatsSettingsEditorProps) => {
  const onAddHandler = useCallback((ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    onAdd();
  }, [onAdd]);

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
              onDelete={onDelete}
            />
          );
        })
      }
      <button
        onClick={onAddHandler}
      >
        <i className="fas fa-plus" />
        <Translate>Add Stat</Translate>
      </button>

    </div>
  );
};
