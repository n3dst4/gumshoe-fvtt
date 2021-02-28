/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { GumshoeActor } from "../../module/GumshoeActor";
import { themes } from "../../theme";
import { GridField } from "../inputs/GridField";
// import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { InputGrid } from "../inputs/InputGrid";

type SettingAreaProps = {
  actor: GumshoeActor,
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
        {/* <GridFieldStacked><hr/></GridFieldStacked>
        <GridFieldStacked label="Support">
          <p>
            If you would like to help me (Neil de Carteret) acquire the e-books
            of some more GUMSHOE games so I can add support for them to Foundry
            VTT, you can throw a small amount of money at me on Ko-Fi:
          </p>
          <p>
            <a href="https://ko-fi.com/n3dst4">Buy me a coffee! (well, a bit of an RPG book)</a>
          </p>
        </GridFieldStacked>
        <GridFieldStacked><hr/></GridFieldStacked> */}
    </InputGrid>
  );
};
