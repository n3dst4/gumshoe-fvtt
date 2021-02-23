/* eslint-disable @typescript-eslint/no-unused-vars */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useEffect, useState } from "react";
import { customSystem } from "../constants";
import * as settings from "../settingsHelpers";
import { systemPresets } from "../systemPresets";
import { themes, trailTheme } from "../theme";
import { CSSReset } from "./CSSReset";
import { Checkbox } from "./inputs/Checkbox";
import { GridField } from "./inputs/GridField";
import { GridFieldStacked } from "./inputs/GridFieldStacked";
import { InputGrid } from "./inputs/InputGrid";
import { ListEdit } from "./inputs/ListEdit";

type GumshoeSettingsProps = {
  foundryApplication: Application;
};

const useStateWithPreset = <T extends any>(initial: T, also: () => void) => {
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

export const GumshoeSettings: React.FC<GumshoeSettingsProps> = ({
  foundryApplication,
}) => {
  // there is also abilityCategories which is legacy and may be lying around for compat purposes
  const systemMigrationVersion = settings.getSystemMigrationVersion();
  const [systemPreset, setSystemPreset] = useState(settings.getSystemPreset());

  const resetPreset = useCallback(() => {
    setSystemPreset(customSystem);
  }, []);

  const [defaultTheme, setDefaultTheme] = useStateWithPreset(
    settings.getDefaultThemeName(),
    resetPreset,
  );
  const [
    investigativeAbilityCategories,
    setInvestigativeAbilityCategories,
  ] = useStateWithPreset(
    settings.getInvestigativeAbilityCategories(),
    resetPreset,
  );
  const [
    generalAbilityCategories,
    setGeneralAbilityCategories,
  ] = useStateWithPreset(settings.getGeneralAbilityCategories(), resetPreset);
  const [combatAbilities, setCombatAbilities] = useStateWithPreset(
    settings.getCombatAbilities(),
    resetPreset,
  );
  const [shortNotes, setShortNotes] = useStateWithPreset(
    settings.getShortNotes(),
    resetPreset,
  );
  const [longNotes, setLongNotes] = useStateWithPreset(
    settings.getLongNotes(),
    resetPreset,
  );
  const [newPCPacks, setNewPCPacks] = useStateWithPreset(
    settings.getNewPCPacks(),
    resetPreset,
  );

  const onSelectPreset = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const presetId = e.currentTarget.value as (keyof typeof systemPresets)|typeof customSystem;
      if (presetId === customSystem) {
        setSystemPreset(presetId);
        return;
      }
      const preset = systemPresets[presetId];
      if (!preset) {
        throw new Error(
          "Somehow ended up picking a preset which doesnae exist",
        );
      }
      setDefaultTheme(preset.defaultTheme);
      setInvestigativeAbilityCategories(preset.investigativeAbilityCategories);
      setGeneralAbilityCategories(preset.generalAbilityCategories);
      setCombatAbilities(preset.combatAbilities);
      setShortNotes(preset.shortNotes);
      setLongNotes(preset.longNotes);
      setNewPCPacks(preset.newPCPacks);
      setSystemPreset(presetId);
    },
    [
      setCombatAbilities,
      setDefaultTheme,
      setGeneralAbilityCategories,
      setInvestigativeAbilityCategories,
      setLongNotes,
      setNewPCPacks,
      setShortNotes,
    ],
  );

  const theme = themes[defaultTheme] || trailTheme;

  const [showJSON, setShowJSON] = useState(false);

  useEffect(() => {
    (window as any).debugGumshoeSettings = setShowJSON;
    return () => {
      delete (window as any).debugGumshoeSettings;
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
      await Promise.all([
        settings.setDefaultThemeName(defaultTheme),
        settings.setInvestigativeAbilityCategories(
          investigativeAbilityCategories,
        ),
        settings.setGeneralAbilityCategories(generalAbilityCategories),
        settings.setCombatAbilities(combatAbilities),
        settings.setShortNotes(shortNotes),
        settings.setLongNotes(longNotes),
        settings.setNewPCPacks(newPCPacks),
        settings.setSystemPreset(systemPreset),
      ]);
      foundryApplication.close();
    },
    [
      combatAbilities,
      defaultTheme,
      foundryApplication,
      generalAbilityCategories,
      investigativeAbilityCategories,
      longNotes,
      newPCPacks,
      shortNotes,
      systemPreset,
    ],
  );

  return (
    <CSSReset
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
      {showJSON && (
        <InputGrid css={{ flex: 1, overflow: "auto" }}>
          <GridField label="systemMigrationVersion">
            <pre>{JSON.stringify(systemMigrationVersion, null, 2)}</pre>
          </GridField>
          <GridField label="defaultTheme">
            <pre>{JSON.stringify(defaultTheme, null, 2)}</pre>
          </GridField>
          <GridField label="investigativeAbilityCategories">
            <pre>{JSON.stringify(investigativeAbilityCategories, null, 2)}</pre>
          </GridField>
          <GridField label="generalAbilityCategories">
            <pre>{JSON.stringify(generalAbilityCategories, null, 2)}</pre>
          </GridField>
          <GridField label="combatAbilities">
            <pre>{JSON.stringify(combatAbilities, null, 2)}</pre>
          </GridField>
          <GridField label="shortNotes">
            <pre>{JSON.stringify(shortNotes, null, 2)}</pre>
          </GridField>
          <GridField label="longNotes">
            <pre>{JSON.stringify(longNotes, null, 2)}</pre>
          </GridField>
          <GridField label="systemPreset">
            <pre>{JSON.stringify(systemPreset, null, 2)}</pre>
          </GridField>
          <GridField label="newPCPacks">
            <pre>{JSON.stringify(newPCPacks, null, 2)}</pre>
          </GridField>
        </InputGrid>
      )}
      {showJSON || (
        <InputGrid
          css={{
            flex: 1,
            overflow: "auto",
            background: theme.colors.thin,
            padding: "0.5em",
          }}
        >
          <GridField label="System Preset">
            <select value={systemPreset} onChange={onSelectPreset}>
              {Object.keys(systemPresets).map((presetId: string) => (
                <option key={presetId} value={presetId}>
                  {
                    systemPresets[presetId as keyof typeof systemPresets]
                      .displayName
                  }
                </option>
              ))}
              <option value={customSystem}>Custom</option>
            </select>
          </GridField>

          <GridFieldStacked>
            <hr />
          </GridFieldStacked>

          <GridField label="Visual Theme">
            <select
              value={defaultTheme}
              onChange={(e) => {
                setDefaultTheme(e.currentTarget.value);
              }}
            >
              {Object.keys(themes).map((themeName: string) => (
                <option key={themeName} value={themeName}>
                  {themes[themeName].displayName}
                </option>
              ))}
            </select>
          </GridField>
          <GridField label="Compendium packs for new PCs">
            {game.packs
              .filter((pack: Compendium) => pack.metadata.entity === "Item")
              .map((pack: Compendium) => {
                const isSelected = newPCPacks.includes(pack.collection);
                return (
                  <label
                    className="parp"
                    key={pack.collection}
                    title={pack.collection}
                    css={{
                      display: "block",
                      background: isSelected
                        ? theme.colors.reverseThin
                        : "none",
                      marginBottom: "0.3em",
                      ":hover": {
                        textShadow: theme.colors.reverseThin,
                      },
                    }}
                  >
                    <Checkbox
                      checked={isSelected}
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
                    {pack.metadata.label}
                  </label>
                );
              })}
          </GridField>
          <GridField label="Investigative Ability Categories">
            <ListEdit
              value={investigativeAbilityCategories}
              onChange={setInvestigativeAbilityCategories}
            />
          </GridField>
          <GridField label="General Ability Categories">
            <ListEdit
              value={generalAbilityCategories}
              onChange={setGeneralAbilityCategories}
            />
          </GridField>
          <GridField label="Combat Abilities">
            <ListEdit value={combatAbilities} onChange={setCombatAbilities} />
          </GridField>
          <GridField label="Short Notes Fields">
            <ListEdit value={shortNotes} onChange={setShortNotes} />
          </GridField>
          <GridField label="Long Notes Fields">
            <ListEdit value={longNotes} onChange={setLongNotes} />
          </GridField>
        </InputGrid>
      )}
      <div
        css={{
          display: "flex",
          flexDirection: "row",
          padding: "0.5em",
          background: theme.colors.thin,
        }}
      >
        <button css={{ flex: 1, paddingTop: "0.5em", paddingBottom: "0.5em" }} onClick={onClickClose}>
          <i className="fas fa-times" /> Cancel
        </button>
        <button css={{ flex: 1, paddingTop: "0.5em", paddingBottom: "0.5em" }} onClick={onClickSave}>
          <i className="fas fa-save" /> Save Changes
        </button>
      </div>
    </CSSReset>
  );
};
