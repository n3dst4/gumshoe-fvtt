import React, { MouseEventHandler, ReactNode, useCallback, useContext } from "react";
import { Translate } from "../../Translate";
import { DispatchContext, StateContext } from "../contexts";
import { addStat } from "../reducer";
import { StatSettingsRow } from "./StatSettingsRow";
import { PcOrNpc } from "../types";

interface StatsSettingsEditorProps {
  which: PcOrNpc;
}

export const StatsSettingsEditor: React.FC<StatsSettingsEditorProps> = ({
  which,
}: StatsSettingsEditorProps) => {
  const stats = useContext(StateContext).settings[which];
  const dispatch = useContext(DispatchContext);
  const handleAdd: MouseEventHandler = useCallback((e) => {
    e.preventDefault();
    dispatch(addStat.create({ which }));
  }, [dispatch, which]);

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
              which={which}
            />
          );
        })
      }
      <button
        onClick={handleAdd}
      >
        <i className="fas fa-plus" />
        <Translate>Add Stat</Translate>
      </button>

    </div>
  );
};
