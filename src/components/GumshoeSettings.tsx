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
        <InputGrid css={{ flex: 1, overflow: "auto" }}>
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
          <GridField label="Compendium packs for new PCs">
            <ul>
              {game.packs
                .filter((pack: Compendium) => pack.metadata.entity === "Item")
                .map((pack: Compendium) => (
                  <li key={pack.collection} title={pack.collection}>
                    <label>
                      <Checkbox
                        checked={newPCPacks.includes(pack.collection)}
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
                  </li>
                ))}
            </ul>
          </GridField>
        </InputGrid>
      )}
      <div
        css={{
          display: "flex",
          flexDirection: "row",
          padding: "0.5em",
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

/*
{
  "trail-of-cthulhu-unsanctioned.investigativeAbilityCategories": "\"Academic,Interpersonal,Technical,Parp\"",
  "trail-of-cthulhu-unsanctioned.defaultTheme": "\"trailTheme\"",
  "trail-of-cthulhu-unsanctioned.shortNotes": "\"Drive,3\""
  "trail-of-cthulhu-unsanctioned.combatAbilities": "\"Scuffling,Weapons,Firearms,Athletics\"",
  "trail-of-cthulhu-unsanctioned.systemMigrationVersion": "\"1.0.0-alpha.5\"",
  "trail-of-cthulhu-unsanctioned.abilityCategories": "\"\"",

  "core.time": "0",
  "core.moduleConfiguration": "{\"atropos-maps\":true,\"better-indents\":true,\"clocks\":false,\"data-toolbox\":false,\"dice-so-nice\":true,\"dice-calculator\":false,\"fogmanager\":false,\"game-icons-net\":false,\"LetterTokens\":false,\"miskasmaps\":true,\"popout\":false,\"Haste\":false,\"Popcorn\":false}",
  "core.combatTrackerConfig": "{\"resource\":\"resources.health.value\",\"skipDefeated\":false}",
  "core.sheetClasses": "{\"Item\":{\"weapon\":\"core.ItemSheet\"}}",
  "core.permissions": "{\"BROADCAST_AUDIO\":[2,3,4],\"BROADCAST_VIDEO\":[2,3,4],\"FILES_BROWSE\":[2,3,4],\"TOKEN_CONFIGURE\":[2,3,4],\"JOURNAL_CREATE\":[2,3,4],\"TEMPLATE_CREATE\":[1,2,3,4],\"ACTOR_CREATE\":[3,4],\"ITEM_CREATE\":[3,4],\"TOKEN_CREATE\":[3,4],\"SHOW_CURSOR\":[],\"SHOW_RULER\":[1,2,3,4],\"SETTINGS_MODIFY\":[3,4],\"WALL_DOORS\":[1,2,3,4],\"FILES_UPLOAD\":[3,4],\"DRAWING_CREATE\":[2,3,4],\"MACRO_SCRIPT\":[1,2,3,4],\"MESSAGE_WHISPER\":[1,2,3,4]}",
  "core.compendiumConfiguration": "{\"trail-of-cthulhu-unsanctioned.generalAbilities\":{\"private\":false,\"locked\":false},\"trail-of-cthulhu-unsanctioned.investigativeAbilities\":{\"private\":false,\"locked\":false},\"trail-of-cthulhu-unsanctioned.trailOfCthulhuAbilities\":{\"private\":false,\"locked\":false},\"world.my-items\":{\"private\":false,\"locked\":false},\"trail-of-cthulhu-unsanctioned.nightsBlackAgentsAbilities\":{\"private\":false,\"locked\":false}}",
}
*/
