/* eslint-disable @typescript-eslint/no-unused-vars */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useEffect, useState } from "react";
import * as constants from "../constants";
import * as settings from "../module/settingsHelpers";
import { themes, trailTheme } from "../theme";
import { CSSReset } from "./CSSReset";
import { Checkbox } from "./inputs/Checkbox";
import { GridField } from "./inputs/GridField";
import { InputGrid } from "./inputs/InputGrid";
import { ListEdit } from "./inputs/ListEdit";

type GumshoeSettingsProps = {
  foundryApplication: Application;
};

const useSetting = <T extends any = string[]>(
  getter: () => T,
  setter: (value: T) => Promise<any>,
): [T, typeof setter] => {
  const [state, setState] = useState(getter());
  const setBoth = (value: T) => {
    setState(value);
    return setter(value);
  };
  return [state, setBoth];
};

export const GumshoeSettings: React.FC<GumshoeSettingsProps> = ({
  foundryApplication,
}) => {
  // there is also abilityCategories which is legacy and may be lying around for compat purposes
  const systemMigrationVersion = settings.getSystemMigrationVersion();
  const [defaultTheme, setDefaultTheme] = useState(
    settings.getDefaultThemeName(),
  );
  const [
    investigativeAbilityCategories,
    setInvestigativeAbilityCategories,
  ] = useState(settings.getInvestigativeAbilityCategories());
  const [generalAbilityCategories, setGeneralAbilityCategories] = useState(
    settings.getGeneralAbilityCategories(),
  );
  const [combatAbilities, setCombatAbilities] = useState(
    settings.getCombatAbilities(),
  );
  const [shortNotes, setShortNotes] = useState(settings.getShortNotes());
  const [longNotes, setLongNotes] = useState(settings.getLongNotes());
  const [newPCPacks, setNewPCPacks] = useState(settings.getNewPCPacks());
  const [systemPreset, setSystemPreset] = useState(settings.getSystemPreset());

  const theme = themes[defaultTheme] || trailTheme;

  const [showJSON, setShowJSON] = useState(false);

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
      }}
    >
      <div>
        <a
          css={{
            float: "right",
          }}
          onClick={() => {
            setShowJSON(!showJSON);
          }}
        >
          <i className={`fa fa-${showJSON ? "times" : "database"}`} />
        </a>
      </div>
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
            background: theme.colors.medium,
            padding: "0.5em",
          }}
        >
          <GridField label="defaultTheme">
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
                    key={pack.collection}
                    title={pack.collection}
                    css={{
                      display: "block",
                      background: isSelected ? theme.colors.reverseThin : "none",
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
        <button css={{ flex: 1 }} onClick={onClickClose}>
          <i className="fas fa-times" /> Cancel
        </button>
        <button css={{ flex: 1 }} onClick={onClickSave}>
          <i className="fas fa-save" /> Save Changes
        </button>
      </div>
    </CSSReset>
  );
};
