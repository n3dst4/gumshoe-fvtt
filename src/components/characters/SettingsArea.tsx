/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { systemName } from "../../constants";
import { assertGame } from "../../functions";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { themes } from "../../themes/themes";
import { GridField } from "../inputs/GridField";
// import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { InputGrid } from "../inputs/InputGrid";
import { Translate } from "../Translate";

type SettingAreaProps = {
  actor: InvestigatorActor,
};

export const SettingArea: React.FC<SettingAreaProps> = ({
  actor,
}) => {
  assertGame(game);
  const onSetTheme = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    const themeName = (value === "default" ? null : value);
    actor.setSheetTheme(themeName);
  }, [actor]);

  return (
    <InputGrid>
        <GridField label="Theme">
          <select onChange={onSetTheme} value={actor.getSheetThemeName() || "default"}>
            {Object.keys(themes).map<JSX.Element>((themeName) => (
              <option key={themeName} value={themeName}>{themes[themeName].displayName}</option>
            ))}
            <option value="default">
              {game.i18n.localize(`${systemName}.UseSystemDefault`)}
            </option>
          </select>
        </GridField>
        <GridField label="Nuke">
          <button onClick={actor.confirmNuke}>
            <Translate>Nuke</Translate>
          </button>
        </GridField>
    </InputGrid>
  );
};
