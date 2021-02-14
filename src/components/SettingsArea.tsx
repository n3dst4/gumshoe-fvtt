/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { TrailActor } from "../module/TrailActor";
import { themes } from "../theme";
import { GridField } from "./inputs/GridField";
import { InputGrid } from "./inputs/InputGrid";

type SettingAreaProps = {
  actor: TrailActor,
};

export const SettingArea: React.FC<SettingAreaProps> = ({
  actor,
}) => {
  const onSetTheme = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    const themeName = (value === "default" ? null : value);
    actor.setSheetTheme(themeName);
  }, [actor]);

  return (
    <InputGrid>
        <GridField label="Theme">
          <select onChange={onSetTheme} value={actor.getSheetThemeName() || "default"}>
            {Object.keys(themes).map((themeName) => (
              <option key={themeName} value={themeName}>{themes[themeName].displayName}</option>
            ))}
            <option value="default">Default</option>
          </select>
        </GridField>
        <GridField label="Nuke">
          <button onClick={actor.confirmNuke}>
            Nuke
          </button>
        </GridField>
    </InputGrid>
  );
};
