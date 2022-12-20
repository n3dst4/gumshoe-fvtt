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
import { StatsSettings } from "./Stats/StatsSettings";
import { MiscSettings } from "./MiscSettings";
import { EquipmentSettings } from "./Equipment/EquipmentSettings";
import { DispatchContext, StateContext } from "./contexts";
import { useSettingsState } from "./hooks";

type SettingsProps = {
  foundryApplication: Application,
};

export const Settings: React.FC<SettingsProps> = ({ foundryApplication }) => {
  assertGame(game);
  const { tempState, setters, tempStateRef, dispatch, isDirty } =
    useSettingsState();
  const theme =
    runtimeConfig.themes[tempState.settings.defaultThemeName] || tealTheme;

  const handleClickClose = useCallback(
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

  const handleClickSave = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const proms = Object.keys(settings).map(async (k) => {
        // @ts-expect-error Too much work to explain to TS that these guys
        // really do match up
        await settings[k].set(tempStateRef.current.settings[k]);
      });
      await Promise.all(proms);
      foundryApplication.close();
      Hooks.call(settingsSaved);
    },
    [foundryApplication, tempStateRef],
  );

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={tempState}>
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
                    <AbilitySettings setters={setters} />
                  ),
                },
                {
                  id: "equipment",
                  label: "Equipment Categories",
                  content: (<EquipmentSettings />),
                },
                {
                  id: "stats",
                  label: "Stats",
                  content: (
                    <StatsSettings />
                  ),
                },
                {
                  id: "misc",
                  label: "Misc",
                  content: (
                    <MiscSettings
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
              onClick={handleClickClose}
            >
              <i className="fas fa-times" /> <Translate>Cancel</Translate>
            </button>
            <button
              css={{ flex: 1, paddingTop: "0.5em", paddingBottom: "0.5em" }}
              onClick={handleClickSave}
            >
              <i className="fas fa-save" /> <Translate>Save Changes</Translate>
            </button>
          </div>
        </CSSReset>
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
