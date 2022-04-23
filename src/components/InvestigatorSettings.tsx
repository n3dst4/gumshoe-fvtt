/** @jsx jsx */
import { jsx } from "@emotion/react";
import { nanoid } from "nanoid";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { customSystem, settingsSaved } from "../constants";
import { assertGame, getDevMode } from "../functions";
import { tealTheme } from "../themes/tealTheme";
import { CSSReset, CSSResetMode } from "./CSSReset";
import { IdContext } from "./IdContext";
import { AsyncTextInput } from "./inputs/AsyncTextInput";
import { Checkbox } from "./inputs/Checkbox";
import { GridField } from "./inputs/GridField";
import { InputGrid } from "./inputs/InputGrid";
import { ListEdit } from "./inputs/ListEdit";
import { SettingsGridField } from "./inputs/SettingsGridField";
import { Translate } from "./Translate";
import { runtimeConfig } from "../runtime";
import { settings, getSettingsDict, SettingsDict } from "../settings";
import { pathOfCthulhuPreset } from "../presets";
import { StatsSettingsEditor } from "./inputs/StatsSettingsEditor";

type InvestigatorSettingsProps = {
  foundryApplication: Application,
};

type Setters = { [k in keyof SettingsDict]: ((newVal: SettingsDict[k]) => void)};

const useTempSettings = () => {
  const initial = useMemo(getSettingsDict, []);
  const [tempSettings, setTempSettings] = useState(initial);
  const tempSettingsRef = useRef(tempSettings);
  useEffect(() => {
    tempSettingsRef.current = tempSettings;
  }, [tempSettings]);
  const setters = useMemo(() => {
    const setters: Record<string, any> = {};
    for (const k of Object.keys(initial)) {
      setters[k] = (newVal: any) => {
        setTempSettings({
          ...tempSettingsRef.current,
          [k]: newVal,
          systemPreset: customSystem,
        });
      };
    }
    return setters as Setters;
  }, [initial, tempSettingsRef]);
  return { tempSettings, setters, setTempSettings, tempSettingsRef };
};

export const InvestigatorSettings: React.FC<InvestigatorSettingsProps> = ({
  foundryApplication,
}) => {
  assertGame(game);
  const presets = runtimeConfig.presets;
  const { tempSettings, setters, setTempSettings, tempSettingsRef } = useTempSettings();

  // ###########################################################################
  // other hooks

  const onSelectPreset = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      assertGame(game);
      const presetId = e.currentTarget.value;
      if (presetId === customSystem) {
        setters.systemPreset(presetId);
        return;
      }
      const preset = presets[presetId];
      if (!preset) {
        throw new Error(
          "Somehow ended up picking a preset which doesnae exist",
        );
      }
      setTempSettings({
        // we start with a safe default (this is typed as Required<> so it will
        // always one-of-everything)
        ...pathOfCthulhuPreset,
        // layer on top the current temp settings - this way we keep any values
        // not in the preset
        ...tempSettingsRef.current,
        // now the preset
        ...preset,
        // and finally, set the actual preset id
        systemPreset: presetId,
      });
    },
    [presets, setTempSettings, setters, tempSettingsRef],
  );

  const theme = runtimeConfig.themes[tempSettings.defaultThemeName] || tealTheme;

  const onClickClose = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      foundryApplication.close();
    },
    [foundryApplication],
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

  let idx = 0;
  const isDevMode = getDevMode();

  return (
    <CSSReset
      mode={CSSResetMode.small}
      theme={theme}
      css={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        padding: 0,
      }}
    >
      <InputGrid
        css={{
          padding: "0.5em",
        }}
      >
        <GridField label="System Preset">
          <select value={tempSettings.systemPreset} onChange={onSelectPreset}>
            {Object.keys(presets).map<JSX.Element>((presetId: string) => (
              <option key={presetId} value={presetId}>
                {
                  presets[presetId]
                    .displayName
                }
              </option>
            ))}
            {tempSettings.systemPreset === customSystem && (
              <option value={customSystem}>Custom</option>
            )}
          </select>
        </GridField>
      </InputGrid>

      <InputGrid
        css={{
          flex: 1,
          overflow: "auto",
        }}
      >
        <SettingsGridField label="Visual Theme" index={idx++}>
          <select
            value={tempSettings.defaultThemeName}
            onChange={(e) => {
              setters.defaultThemeName(e.currentTarget.value);
            }}
          >
            {Object.keys(runtimeConfig.themes).map<JSX.Element>(
              (themeName: string) => (
                <option key={themeName} value={themeName}>
                  {runtimeConfig.themes[themeName].displayName}
                </option>
              ),
            )}
          </select>
        </SettingsGridField>
        <SettingsGridField
          label="Compendium packs for new characters"
          index={idx++}
          noLabel
        >
          <div
            css={{
              display: "grid",
              gridTemplateColumns: "max-content 1fr max-content",
              gridAutoRows: "min-content",
              columnGap: "0.5em",
              whiteSpace: "nowrap",
              ".header": {
                fontWeight: "bold",
              },
            }}
          >
            <div css={{ gridColumn: 1, gridRow: 1 }}>
            <label> <Translate>PCs</Translate> </label>
            </div>
            <div css={{ gridColumn: 3, gridRow: 1 }}>
            <label> <Translate>NPCs</Translate> </label>
            </div>
            {game.packs
              .filter((pack: CompendiumCollection<CompendiumCollection.Metadata>) => {
                // v0.8/v9 compatibility hack - in v9 pack.metadata.entity is
                // getter which warns you about deprecation and then returns
                // pack.metadata.type BUT it's throwing "this.metadata is
                // undefined" for me, hence this touchy-feeling approach
                try {
                  const documentType = (pack.metadata as any).type ?? pack.metadata.entity;
                  return documentType === "Item";
                } catch (e) {
                  return false;
                }
              })
              .map<JSX.Element>((pack: CompendiumCollection<CompendiumCollection.Metadata>, i) => {
                const pcSelected = tempSettings.newPCPacks.includes(pack.collection);
                const npcSelected = tempSettings.newNPCPacks.includes(pack.collection);
                const id = nanoid();
                const gridRow = i + 2;
                return (
                  <IdContext.Provider value={id} key={pack.metadata.name}>
                    {
                      gridRow % 2 === 0 &&
                      <div
                        css={{
                          gridRow,
                          gridColumn: "1/4",
                          background: theme.colors.backgroundButton,
                        }}
                      />
                    }
                    <Checkbox
                      checked={pcSelected}
                      css={{
                        gridColumn: 1,
                        gridRow,
                      }}
                      onChange={(checked) => {
                        if (checked) {
                          setters.newPCPacks([...tempSettings.newPCPacks, pack.collection]);
                        } else {
                          setters.newPCPacks(
                            tempSettings.newPCPacks.filter((x) => x !== pack.collection),
                          );
                        }
                      }}
                    />
                    <Checkbox
                      css={{
                        gridColumn: 3,
                        gridRow,
                        top: 0,
                      }}
                      checked={npcSelected}
                      onChange={(checked) => {
                        if (checked) {
                          setters.newNPCPacks([...tempSettings.newNPCPacks, pack.collection]);
                        } else {
                          setters.newNPCPacks(
                            tempSettings.newNPCPacks.filter((x) => x !== pack.collection),
                          );
                        }
                      }}
                    />
                    <label
                      className="parp"
                      key={pack.collection}
                      title={pack.collection}
                      htmlFor={id}
                      css={{
                        display: "block",
                        paddingTop: "0.3em",
                        gridColumn: 2,
                        gridRow,
                        textAlign: "center",
                      }}
                    >
                      {pack.metadata.label}
                    </label>
                  </IdContext.Provider>
                );
              })}
            </div>
        </SettingsGridField>
        <SettingsGridField
          label="Investigative Ability Categories"
          index={idx++}
        >
          <ListEdit
            value={tempSettings.investigativeAbilityCategories}
            onChange={setters.investigativeAbilityCategories}
          />
        </SettingsGridField>
        <SettingsGridField label="General Ability Categories" index={idx++}>
          <ListEdit
            value={tempSettings.generalAbilityCategories}
            onChange={setters.generalAbilityCategories}
          />
        </SettingsGridField>
        <SettingsGridField label="Combat Abilities" index={idx++}>
          <ListEdit value={tempSettings.combatAbilities} onChange={setters.combatAbilities} />
        </SettingsGridField>
        <SettingsGridField label="Occupation Label" index={idx++}>
          <AsyncTextInput
            value={tempSettings.occupationLabel}
            onChange={setters.occupationLabel}
          />
        </SettingsGridField>
        <SettingsGridField label="Short Notes Fields" index={idx++}>
          <ListEdit value={tempSettings.shortNotes} onChange={setters.shortNotes} />
        </SettingsGridField>
        <SettingsGridField label="Long Notes Fields" index={idx++}>
          <ListEdit value={tempSettings.longNotes} onChange={setters.longNotes} />
        </SettingsGridField>
        <SettingsGridField label="PC Stats" index={idx++}>
          <StatsSettingsEditor pcOrNpc="pc" />
        </SettingsGridField>
        <SettingsGridField label="NPC Stats" index={idx++}>
          <StatsSettingsEditor pcOrNpc="npc"/>
        </SettingsGridField>
        <SettingsGridField label="Can Abilities be Boosted?" index={idx++}>
          <Checkbox checked={tempSettings.useBoost} onChange={setters.useBoost} />
        </SettingsGridField>
        <SettingsGridField label="Custom themes path" index={idx++}>
          <AsyncTextInput
            onChange={setters.customThemePath}
            value={tempSettings.customThemePath}
          />
        </SettingsGridField>
        <SettingsGridField label="Generic Occupation" index={idx++}>
          <AsyncTextInput
            onChange={setters.genericOccupation}
            value={tempSettings.genericOccupation}
          />
        </SettingsGridField>
        <SettingsGridField label="Show empty Investigative categories?" index={idx++}>
          <Checkbox checked={tempSettings.showEmptyInvestigativeCategories} onChange={setters.showEmptyInvestigativeCategories} />
        </SettingsGridField>
        {/* <SettingsGridField label="Show hit threshold counter?" index={idx++}>
          <Checkbox checked={tempSettings.useHitThreshold} onChange={setters.useHitThreshold} />
        </SettingsGridField> */}

        {
          isDevMode &&
            <SettingsGridField label="Debug translations?" index={idx++}>
              <Checkbox
                checked={tempSettings.debugTranslations}
                onChange={setters.debugTranslations}
              />
            </SettingsGridField>
        }

        {/* ####################################################################
          MORIBUND WORLD STUFF BELOW HERE
        #################################################################### */}

        <hr css={{ gridColumn: "label / end" }}/>
        <h2
          css={{ gridColumn: "label / end" }}
        >
          <Translate>Settings for Moribund World users</Translate>
        </h2>
        <SettingsGridField label="Use Moribund World-style abilities" index={idx++}>
          <Checkbox
            checked={tempSettings.useMwStyleAbilities}
            onChange={setters.useMwStyleAbilities}
          />
        </SettingsGridField>
        <SettingsGridField label="Use alternative item types" index={idx++}>
          <Checkbox
            checked={tempSettings.mwUseAlternativeItemTypes}
            onChange={setters.mwUseAlternativeItemTypes}
          />
        </SettingsGridField>
        <SettingsGridField label="Hidden Short Notes Fields" index={idx++}>
          <ListEdit value={tempSettings.mwHiddenShortNotes} onChange={setters.mwHiddenShortNotes} />
        </SettingsGridField>
        <SettingsGridField label="Use injury status" index={idx++}>
          <Checkbox
            checked={tempSettings.useMwInjuryStatus}
            onChange={setters.useMwInjuryStatus}
          />
        </SettingsGridField>

      </InputGrid>
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
  );
};
