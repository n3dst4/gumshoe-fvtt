import React, { useCallback, useEffect } from "react";

import { settingsCloseAttempted, settingsSaved } from "../../constants";
import { confirmADoodleDo } from "../../functions/confirmADoodleDo";
import { assertGame } from "../../functions/utilities";
import { useTheme } from "../../hooks/useTheme";
import { settings } from "../../settings/settings";
import { absoluteCover } from "../absoluteCover";
import { CSSReset } from "../CSSReset";
import { TabContainer } from "../TabContainer";
import { Translate } from "../Translate";
import { AbilitySettings } from "./AbilitySettings";
import { CardsSettings } from "./Cards/CardsSettings";
import { DirtyContext, DispatchContext, StateContext } from "./contexts";
import { CoreSettings } from "./CoreSettings";
import { EquipmentSettings } from "./Equipment/EquipmentSettings";
import { useSettingsState } from "./hooks";
import { MiscSettings } from "./MiscSettings";
import { StatsSettings } from "./Stats/StatsSettings";

type SettingsProps = {
  foundryApplication: Application;
};

export const Settings: React.FC<SettingsProps> = ({ foundryApplication }) => {
  assertGame(game);
  const { tempState, setters, tempStateRef, dispatch, isDirty } =
    useSettingsState();
  const theme = useTheme(tempState.settings.defaultThemeName);

  const handleClose = useCallback(async () => {
    const aye =
      !isDirty() ||
      (await confirmADoodleDo({
        message: "You have unsaved changes. Are you sure you want to close?",
        confirmText: "Yes, discard my changes",
        cancelText: "Whoops, No!",
        confirmIconClass: "fas fa-times",
        resolveFalseOnCancel: true,
      }));
    if (aye) {
      await foundryApplication.close({ approved: true });
    }
  }, [foundryApplication, isDirty]);

  const handleClickClose = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      return handleClose();
    },
    [handleClose],
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
      Hooks.call(settingsSaved);
      await foundryApplication.close({ approved: true });
    },
    [foundryApplication, tempStateRef],
  );

  // if anything attempts to close the window without our approval, we block it
  // in the SettingsClass and fire this event for us to handle here
  useEffect(() => {
    Hooks.on(settingsCloseAttempted, handleClose);
    return () => {
      Hooks.off(settingsCloseAttempted, handleClose);
    };
  }, [handleClose]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={tempState}>
        <DirtyContext.Provider value={isDirty}>
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
                    content: <CoreSettings setters={setters} />,
                  },
                  {
                    id: "abilities",
                    label: "Abilities",
                    content: <AbilitySettings setters={setters} />,
                  },
                  {
                    id: "equipment",
                    label: "Equipment",
                    content: <EquipmentSettings />,
                  },
                  {
                    id: "stats",
                    label: "Stats",
                    content: <StatsSettings />,
                  },
                  {
                    id: "cards",
                    label: "Cards",
                    content: <CardsSettings setters={setters} />,
                  },
                  {
                    id: "misc",
                    label: "Misc",
                    content: <MiscSettings setters={setters} />,
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
                <i className="fas fa-save" />{" "}
                <Translate>Save Changes</Translate>
              </button>
            </div>
          </CSSReset>
        </DirtyContext.Provider>
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};

Settings.displayName = "Settings";
