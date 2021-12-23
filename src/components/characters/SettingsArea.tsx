/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { assertGame, getDevMode, getTranslated } from "../../functions";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { themes } from "../../themes/themes";
import { assertPCDataSource, NoteFormat } from "../../types";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { Translate } from "../Translate";

type SettingAreaProps = {
  actor: InvestigatorActor,
};

export const SettingArea: React.FC<SettingAreaProps> = ({
  actor,
}) => {
  assertGame(game);
  assertPCDataSource(actor.data);
  const onSetTheme = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    const themeName = (value === "default" ? null : value);
    actor.setSheetTheme(themeName);
  }, [actor]);

  const isDevMode = getDevMode();

  return (
    <InputGrid>
        <GridField label="Theme">
          <select onChange={onSetTheme} value={actor.getSheetThemeName() || "default"}>
            {Object.keys(themes).map<JSX.Element>((themeName) => (
              <option key={themeName} value={themeName}>{themes[themeName].displayName}</option>
            ))}
            <option value="default">
              {getTranslated("UseSystemDefault")}
            </option>
          </select>
        </GridField>

        <GridField label="Notes Format">
          <select
            value={actor.data.data.longNotesFormat}
            onChange={(e) => {
              actor.setLongNotesFormat(e.currentTarget.value as NoteFormat);
            }}
          >
            <option value={NoteFormat.plain}>{getTranslated("Plain")}</option>
            <option value={NoteFormat.markdown}>{getTranslated("Markdown")}</option>
            <option value={NoteFormat.richText}>{getTranslated("RichText")}</option>
          </select>
        </GridField>

        {isDevMode &&
          <GridField label="Nuke">
            <button onClick={actor.confirmNuke}>
              <Translate>Nuke</Translate>
            </button>
          </GridField>
        }
    </InputGrid>
  );
};
