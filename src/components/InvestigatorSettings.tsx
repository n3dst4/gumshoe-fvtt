/** @jsx jsx */
import { jsx } from "@emotion/react";
import { nanoid } from "nanoid";
import React, { useCallback, useEffect, useState } from "react";
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
import * as constants from "../constants";
import { settings } from "../startup/registerSettings";

type InvestigatorSettingsProps = {
  foundryApplication: Application,
};

const useStateWithPreset = <T, >(initial: T, also: () => void) => {
  const [state, setState] = useState(initial);
  const setter = useCallback(
    (value: T) => {
      setState(value);
      also();
    },
    [also],
  );
  const retVal: [T, (value: T) => void] = [state, setter];
  return retVal;
};

export const InvestigatorSettings: React.FC<InvestigatorSettingsProps> = ({
  foundryApplication,
}) => {
  assertGame(game);
  const presets = runtimeConfig.presets;
  // there is also abilityCategories which is legacy and may be lying around for compat purposes
  const systemMigrationVersion = settings.systemMigrationVersion.get();
  const [systemPreset, setSystemPreset] = useState(settings.systemPreset.get());

  const resetPreset = useCallback(() => {
    console.log("resetting the presetting");
    setSystemPreset(customSystem);
  }, []);

  const [defaultTheme, setDefaultTheme] = useStateWithPreset(
    settings.defaultThemeName.get(),
    resetPreset,
  );
  const [investigativeAbilityCategories, setInvestigativeAbilityCategories] =
    useStateWithPreset(
      settings.investigativeAbilityCategories.get(),
      resetPreset,
    );
  const [generalAbilityCategories, setGeneralAbilityCategories] =
    useStateWithPreset(settings.generalAbilityCategories.get(), resetPreset);
  const [combatAbilities, setCombatAbilities] = useStateWithPreset(
    settings.combatAbilities.get(),
    resetPreset,
  );
  const [occupationLabel, setOccupationLabel] = useStateWithPreset(
    settings.occupationLabel.get(),
    resetPreset,
  );
  const [shortNotes, setShortNotes] = useStateWithPreset(
    settings.shortNotes.get(),
    resetPreset,
  );
  const [longNotes, setLongNotes] = useStateWithPreset(
    settings.longNotes.get(),
    resetPreset,
  );
  const [newPCPacks, setNewPCPacks] = useStateWithPreset(
    settings.newPCPacks.get(),
    resetPreset,
  );
  const [newNPCPacks, setNewNPCPacks] = useStateWithPreset(
    settings.newNPCPacks.get(),
    resetPreset,
  );
  const [useBoost, setUseBoost] = useStateWithPreset(
    settings.useBoost.get(),
    resetPreset,
  );
  const [debugTranslations, setDebugTranslations] = useStateWithPreset(
    settings.debugTranslations.get(),
    resetPreset,
  );
  const [customThemePath, setCustomThemePath] = useStateWithPreset(
    settings.customThemePath.get(),
    resetPreset,
  );
  const [genericOccupation, setGenericOccupation] = useStateWithPreset(
    settings.genericOccupation.get(),
    resetPreset,
  );
  const [showEmptyInvestigativeCategories, setShowEmptyInvestigativeCategories] = useStateWithPreset(
    settings.showEmptyInvestigativeCategories.get(),
    resetPreset,
  );

  const [useMwStyleAbilities, setUseMwStyleAbilities] = useStateWithPreset(
    settings.useMwStyleAbilities.get(),
    resetPreset,
  );
  const [mwHiddenShortNotes, setMwHiddenShortNotes] = useStateWithPreset(
    settings.mwHiddenShortNotes.get(),
    resetPreset,
  );
  const [mwUseAlternativeItemTypes, setMwUseAlternativeItemTypes] = useStateWithPreset(
    settings.mwUseAlternativeItemTypes.get(),
    resetPreset,
  );

  const [useMwInjuryStatus, setUseMwInjuryStatus] = useStateWithPreset(
    settings.useMwInjuryStatus.get(),
    resetPreset,
  );

  const onSelectPreset = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      assertGame(game);
      const presetId = e.currentTarget.value;
      if (presetId === customSystem) {
        setSystemPreset(presetId);
        return;
      }
      const preset = presets[presetId];
      if (!preset) {
        throw new Error(
          "Somehow ended up picking a preset which doesnae exist",
        );
      }
      setDefaultTheme(preset.defaultTheme);
      setInvestigativeAbilityCategories(preset.investigativeAbilityCategories);
      setGeneralAbilityCategories(preset.generalAbilityCategories);
      setCombatAbilities(preset.combatAbilities);
      setOccupationLabel(preset.occupationLabel);
      setShortNotes(preset.shortNotes);
      setLongNotes(preset.longNotes);
      setNewPCPacks(preset.newPCPacks);
      setNewNPCPacks(preset.newNPCPacks);
      setUseBoost(preset.useBoost);
      setUseMwStyleAbilities(preset.useMwStyleAbilities);
      setMwHiddenShortNotes(preset.mwHiddenShortNotes ?? []);
      setMwUseAlternativeItemTypes(preset.mwUseAlternativeItemTypes);
      setSystemPreset(presetId);
      setGenericOccupation(preset.genericOccupation ?? constants.genericOccupationDefault);
      setShowEmptyInvestigativeCategories(preset.showEmptyInvestigativeCategories ?? constants.showEmptyInvestigativeCategoriesDefault);
    },
    [
      presets,
      setDefaultTheme,
      setInvestigativeAbilityCategories,
      setGeneralAbilityCategories,
      setCombatAbilities,
      setOccupationLabel,
      setShortNotes,
      setLongNotes,
      setNewPCPacks,
      setNewNPCPacks,
      setUseBoost,
      setUseMwStyleAbilities,
      setMwHiddenShortNotes,
      setMwUseAlternativeItemTypes,
      setShowEmptyInvestigativeCategories,
      setGenericOccupation,
    ],
  );

  const theme = runtimeConfig.themes[defaultTheme] || tealTheme;

  const [showJSON, setShowJSON] = useState(false);

  useEffect(() => {
    (window as any).debugInvestigatorSettings = setShowJSON;
    return () => {
      delete (window as any).debugInvestigatorSettings;
    };
  }, []);

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

      await Promise.all<unknown>([
        settings.defaultThemeName.set(defaultTheme),
        settings.investigativeAbilityCategories.set(
          investigativeAbilityCategories,
        ),
        settings.generalAbilityCategories.set(generalAbilityCategories),
        settings.combatAbilities.set(combatAbilities),
        settings.occupationLabel.set(occupationLabel),
        settings.shortNotes.set(shortNotes),
        settings.longNotes.set(longNotes),
        settings.newPCPacks.set(newPCPacks),
        settings.newNPCPacks.set(newNPCPacks),
        settings.useBoost.set(useBoost),
        settings.systemPreset.set(systemPreset),
        settings.debugTranslations.set(debugTranslations),
        settings.customThemePath.set(customThemePath),
        settings.genericOccupation.set(genericOccupation),
        settings.showEmptyInvestigativeCategories.set(showEmptyInvestigativeCategories),
        settings.useMwStyleAbilities.set(useMwStyleAbilities),
        settings.mwHiddenShortNotes.set(mwHiddenShortNotes),
        settings.mwUseAlternativeItemTypes.set(mwUseAlternativeItemTypes),
        settings.useMwInjuryStatus.set(useMwInjuryStatus),
      ]);
      foundryApplication.close();
      Hooks.call(settingsSaved);
    },
    [
      defaultTheme,
      investigativeAbilityCategories,
      generalAbilityCategories,
      combatAbilities,
      occupationLabel,
      shortNotes,
      longNotes,
      newPCPacks,
      newNPCPacks,
      useBoost,
      systemPreset,
      debugTranslations,
      customThemePath,
      useMwStyleAbilities,
      mwHiddenShortNotes,
      mwUseAlternativeItemTypes,
      foundryApplication,
      useMwInjuryStatus,
      genericOccupation,
      showEmptyInvestigativeCategories,
    ],
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
        // overflow: "auto",
        display: "flex",
        flexDirection: "column",
        padding: 0,
      }}
    >
      <InputGrid
        css={{
          // background: `linear-gradient(to right, ${theme.colors.bgTransPrimary}, ${theme.colors.bgTransPrimary}), ${theme.wallpaperUrl}`,
          padding: "0.5em",
        }}
      >
        <GridField label="System Preset">
          <select value={systemPreset} onChange={onSelectPreset}>
            {Object.keys(presets).map<JSX.Element>((presetId: string) => (
              <option key={presetId} value={presetId}>
                {
                  presets[presetId]
                    .displayName
                }
              </option>
            ))}
            {systemPreset === customSystem && (
              <option value={customSystem}>Custom</option>
            )}
          </select>
        </GridField>
      </InputGrid>

      {showJSON && (
        <InputGrid css={{ flex: 1, overflow: "auto" }}>
          <SettingsGridField label="systemMigrationVersion" index={idx++}>
            <pre>{JSON.stringify(systemMigrationVersion, null, 2)}</pre>
          </SettingsGridField>
          <SettingsGridField label="defaultTheme" index={idx++}>
            <pre>{JSON.stringify(defaultTheme, null, 2)}</pre>
          </SettingsGridField>
          <SettingsGridField label="investigativeAbilityCategories" index={idx}>
            <pre>{JSON.stringify(investigativeAbilityCategories, null, 2)}</pre>
          </SettingsGridField>
          <SettingsGridField label="generalAbilityCategories" index={idx++}>
            <pre>{JSON.stringify(generalAbilityCategories, null, 2)}</pre>
          </SettingsGridField>
          <SettingsGridField label="combatAbilities" index={idx++}>
            <pre>{JSON.stringify(combatAbilities, null, 2)}</pre>
          </SettingsGridField>
          <SettingsGridField label="occupationLabel" index={idx++}>
            <pre>{JSON.stringify(occupationLabel, null, 2)}</pre>
          </SettingsGridField>
          <SettingsGridField label="shortNotes" index={idx++}>
            <pre>{JSON.stringify(shortNotes, null, 2)}</pre>
          </SettingsGridField>
          <SettingsGridField label="longNotes" index={idx++}>
            <pre>{JSON.stringify(longNotes, null, 2)}</pre>
          </SettingsGridField>
          <SettingsGridField label="systemPreset" index={idx++}>
            <pre>{JSON.stringify(systemPreset, null, 2)}</pre>
          </SettingsGridField>
          <SettingsGridField label="newPCPacks" index={idx++}>
            <pre>{JSON.stringify(newPCPacks, null, 2)}</pre>
          </SettingsGridField>
          <SettingsGridField label="newNPCPacks" index={idx++}>
            <pre>{JSON.stringify(newNPCPacks, null, 2)}</pre>
          </SettingsGridField>
        </InputGrid>
      )}
      {showJSON || (
        <InputGrid
          css={{
            flex: 1,
            overflow: "auto",
          }}
        >
          <SettingsGridField label="Visual Theme" index={idx++}>
            <select
              value={defaultTheme}
              onChange={(e) => {
                setDefaultTheme(e.currentTarget.value);
              }}
            >
              {Object.keys(runtimeConfig.themes).map<JSX.Element>((themeName: string) => (
                <option key={themeName} value={themeName}>
                  {runtimeConfig.themes[themeName].displayName}
                </option>
              ))}
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
                  const pcSelected = newPCPacks.includes(pack.collection);
                  const npcSelected = newNPCPacks.includes(pack.collection);
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
                            setNewPCPacks([...newPCPacks, pack.collection]);
                          } else {
                            setNewPCPacks(
                              newPCPacks.filter((x) => x !== pack.collection),
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
                            setNewNPCPacks([...newNPCPacks, pack.collection]);
                          } else {
                            setNewNPCPacks(
                              newNPCPacks.filter((x) => x !== pack.collection),
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
              value={investigativeAbilityCategories}
              onChange={setInvestigativeAbilityCategories}
            />
          </SettingsGridField>
          <SettingsGridField label="General Ability Categories" index={idx++}>
            <ListEdit
              value={generalAbilityCategories}
              onChange={setGeneralAbilityCategories}
            />
          </SettingsGridField>
          <SettingsGridField label="Combat Abilities" index={idx++}>
            <ListEdit value={combatAbilities} onChange={setCombatAbilities} />
          </SettingsGridField>
          <SettingsGridField label="Occupation Label" index={idx++}>
            <AsyncTextInput
              value={occupationLabel}
              onChange={setOccupationLabel}
            />
          </SettingsGridField>
          <SettingsGridField label="Short Notes Fields" index={idx++}>
            <ListEdit value={shortNotes} onChange={setShortNotes} />
          </SettingsGridField>
          <SettingsGridField label="Long Notes Fields" index={idx++}>
            <ListEdit value={longNotes} onChange={setLongNotes} />
          </SettingsGridField>
          <SettingsGridField label="Can Abilities be Boosted?" index={idx++}>
            <Checkbox checked={useBoost} onChange={setUseBoost} />
          </SettingsGridField>
          <SettingsGridField label="Custom themes path" index={idx++}>
            <AsyncTextInput
              onChange={setCustomThemePath}
              value={customThemePath}
            />
          </SettingsGridField>
          <SettingsGridField label="Generic Occupation" index={idx++}>
            <AsyncTextInput
              onChange={setGenericOccupation}
              value={genericOccupation}
            />
          </SettingsGridField>
          <SettingsGridField label="Show empty Investigative categories?" index={idx++}>
            <Checkbox checked={showEmptyInvestigativeCategories} onChange={setShowEmptyInvestigativeCategories} />
          </SettingsGridField>

          {
            isDevMode &&
              <SettingsGridField label="Debug translations?" index={idx++}>
                <Checkbox
                  checked={debugTranslations}
                  onChange={setDebugTranslations}
                />
              </SettingsGridField>
          }
          <hr css={{ gridColumn: "label / end" }}/>
          <h2
            css={{ gridColumn: "label / end" }}
          >
            <Translate>Settings for Moribund World users</Translate>
          </h2>
          <SettingsGridField label="Use Moribund World-style abilities" index={idx++}>
            <Checkbox
              checked={useMwStyleAbilities}
              onChange={setUseMwStyleAbilities}
            />
          </SettingsGridField>
          <SettingsGridField label="Use alternative item types" index={idx++}>
            <Checkbox
              checked={mwUseAlternativeItemTypes}
              onChange={setMwUseAlternativeItemTypes}
            />
          </SettingsGridField>
          <SettingsGridField label="Hidden Short Notes Fields" index={idx++}>
            <ListEdit value={mwHiddenShortNotes} onChange={setMwHiddenShortNotes} />
          </SettingsGridField>
          <SettingsGridField label="Use injury status" index={idx++}>
            <Checkbox
              checked={useMwInjuryStatus}
              onChange={setUseMwInjuryStatus}
            />
          </SettingsGridField>

        </InputGrid>
      )}
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
