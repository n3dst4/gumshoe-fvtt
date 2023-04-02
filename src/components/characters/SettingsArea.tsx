import React, { Fragment, useCallback, useContext } from "react";
import { assertGame, getDevMode, getTranslated } from "../../functions";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { runtimeConfig } from "../../runtime";
import { settings } from "../../settings";
import { ThemeContext } from "../../themes/ThemeContext";
import { NoteFormat } from "../../types";
import { assertPCDataSource } from "../../typeAssertions";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { Translate } from "../Translate";

type SettingAreaProps = {
  actor: InvestigatorActor;
};

export const SettingArea: React.FC<SettingAreaProps> = ({ actor }) => {
  assertGame(game);
  assertPCActor(actor);
  const onSetTheme = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.currentTarget.value;
      const themeName = value === "default" ? null : value;
      actor.setSheetTheme(themeName);
    },
    [actor],
  );
  const theme = useContext(ThemeContext);
  const isDevMode = getDevMode();

  return (
    <Fragment>
      <InputGrid>
        <GridField label="Theme">
          <select
            onChange={onSetTheme}
            value={actor.getSheetThemeName() || "default"}
          >
            {Object.keys(runtimeConfig.themes).map<JSX.Element>((themeName) => (
              <option key={themeName} value={themeName}>
                {runtimeConfig.themes[themeName].displayName}
              </option>
            ))}
            <option value="default">{getTranslated("UseSystemDefault")}</option>
          </select>
        </GridField>

        <GridField label="Notes Format">
          <select
            value={actor.system.longNotesFormat}
            onChange={(e) => {
              actor.setLongNotesFormat(e.currentTarget.value as NoteFormat);
            }}
          >
            <option value={NoteFormat.plain}>{getTranslated("Plain")}</option>
            <option value={NoteFormat.markdown}>
              {getTranslated("Markdown")}
            </option>
            <option value={NoteFormat.richText}>
              {getTranslated("RichText")}
            </option>
          </select>
        </GridField>

        {settings.useTurnPassingInitiative.get() && (
          <GridField label="Number of turns">
            <AsyncNumberInput
              value={actor.system.initiativePassingTurns}
              onChange={actor.setPassingTurns}
            />
          </GridField>
        )}

        {isDevMode && (
          <GridField label="Nuke">
            <button onClick={actor.confirmNuke}>
              <Translate>Nuke</Translate>
            </button>
          </GridField>
        )}
      </InputGrid>

      <p
        css={{
          textTransform: "initial",
          border: "1px dashed currentColor",
          padding: "1em",
          margin: "2em 1em 1em 1em",
          backgroundColor: theme.colors.backgroundSecondary,
        }}
      >
        <a target="_new" href="https://github.com/n3dst4/investigator-fvtt">
          GUMSHOE for FoundryVTT (aka INVESTIGATOR)
        </a>{" "}
        is made by me, Neil de Carteret. Find all my non-work links and ways to
        contact me at my{" "}
        <a target="_new" href="https://lumphammer.net">
          Lumphammer Projects
        </a>{" "}
        site.
      </p>
    </Fragment>
  );
};
