import React, { useCallback } from "react";
import { settingsSaved } from "../../constants";
import { assertGame, confirmADoodleDo } from "../../functions";
import { tealTheme } from "../../themes/tealTheme";
import { CSSReset } from "../CSSReset";
import { Translate } from "../Translate";
import { runtimeConfig } from "../../runtime";
import { settings } from "../../settings";
import { absoluteCover } from "../absoluteCover";
import { TabContainer } from "../TabContainer";
import { CoreSettings } from "./CoreSettings";
import { AbilitySettings } from "./AbilitySettings";
import { StatsSettings } from "./StatsSettings";
import { MiscSettings } from "./MiscSettings";
import { EquipmentSettings } from "./Equipment/EquipmentSettings";
import { DispatchContext, SettingsContext } from "./contexts";
import { useTempSettings } from "./hooks";

type SettingsProps = {
  foundryApplication: Application,
};

export const Settings: React.FC<SettingsProps> = ({ foundryApplication }) => {
  assertGame(game);
  const { tempSettings, setters, tempSettingsRef, dispatch, isDirty } =
    useTempSettings();

  // ###########################################################################
  // other hooks

  const theme =
    runtimeConfig.themes[tempSettings.defaultThemeName] || tealTheme;

  const onClickClose = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const aye = !isDirty() || await confirmADoodleDo({
        message: "You have unsaved changes. Are you sure you want to close?",
        confirmText: "Yes, discard my changes",
        cancelText: "Whoops, No!",
        confirmIconClass: "fas fa-times",
        resolveFalseOnCancel: true,
      });
      if (aye) {
        foundryApplication.close();
      }
    },
    [foundryApplication, isDirty],
  );

  const onClickSave = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const proms = Object.keys(settings).map(async (k) => {
        // @ts-expect-error Too much work to explain to TS that these guys
        // really do match up
        settings[k].set(tempSettingsRef.current[k]);
      });
      await Promise.all(proms);
      foundryApplication.close();
      Hooks.call(settingsSaved);
    },
    [foundryApplication, tempSettingsRef],
  );

  return (
    <DispatchContext.Provider value={dispatch}>
      <SettingsContext.Provider value={tempSettings}>
        <CSSReset
          mode="small"
          theme={theme}
          css={{
            ...absoluteCover,
            display: "flex",
            flexDirection: "column",
            padding: 0,
          }}
        >
          <div css={{ flex: 1, overflow: "auto", position: "relative" }}>
            <TabContainer
              defaultTab="core"
              tabs={[
                {
                  id: "core",
                  label: "Core",
                  content: (
                    <CoreSettings setters={setters} />
                  ),
                },
                {
                  id: "abilities",
                  label: "Abilities",
                  content: (
                    <AbilitySettings
                      tempSettings={tempSettings}
                      setters={setters}
                    />
                  ),
                },
                {
                  id: "equipment",
                  label: "Equipment",
                  content: (<EquipmentSettings />),
                },
                {
                  id: "stats",
                  label: "Stats",
                  content: (
                    <StatsSettings
                      tempSettings={tempSettings}
                      setters={setters}
                      tempSettingsRef={tempSettingsRef}
                    />
                  ),
                },
                {
                  id: "misc",
                  label: "Misc",
                  content: (
                    <MiscSettings
                      tempSettings={tempSettings}
                      setters={setters}
                    />
                  ),
                },
              ]}
            />
          </div>
          <div
            css={{
              display: "flex",
              flexDirection: "row",
              padding: "0.5em",
              background: theme.colors.backgroundSecondary,
            }}
          >
            <button
              css={{ flex: 1, paddingTop: "0.5em", paddingBottom: "0.5em" }}
              onClick={onClickClose}
            >
              <i className="fas fa-times" /> <Translate>Cancel</Translate>
            </button>
            <button
              css={{ flex: 1, paddingTop: "0.5em", paddingBottom: "0.5em" }}
              onClick={onClickSave}
            >
              <i className="fas fa-save" /> <Translate>Save Changes</Translate>
            </button>
          </div>
        </CSSReset>
      </SettingsContext.Provider>
    </DispatchContext.Provider>
  );
};
