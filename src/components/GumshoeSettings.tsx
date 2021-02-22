/* eslint-disable @typescript-eslint/no-unused-vars */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useEffect, useState } from "react";
import * as constants from "../constants";
import { getCombatAbilities, getDefaultThemeName, getGeneralAbilityCategories, getInvestigativeAbilityCategories, getLongNotes, getShortNotes, getSystemMigrationVersion } from "../module/settingsHelpers";
import { themes, trailTheme } from "../theme";
import { CSSReset } from "./CSSReset";
import { GridField } from "./inputs/GridField";
import { InputGrid } from "./inputs/InputGrid";

type GumshoeSettingsProps = {
  foundryApplication: Application;
};

export const GumshoeSettings: React.FC<GumshoeSettingsProps> = ({
  foundryApplication,
}) => {
  // there is also abilityCategories which is legacy and may be lying around for compat purposes
  const systemMigrationVersion = getSystemMigrationVersion();
  const defaultTheme = getDefaultThemeName();
  const investigativeAbilityCategories = getInvestigativeAbilityCategories();
  const generalAbilityCategories = getGeneralAbilityCategories();
  const combatAbilities = getCombatAbilities();
  const shortNotes = getShortNotes();
  const longNotes = getLongNotes();

  const theme = themes[getDefaultThemeName()] || trailTheme;

  const [showJSON, setShowJSON] = useState(false);

  return (
    <CSSReset theme={theme}>
      <h1>
        GUMSHOE Settings
        <a
          css={{
            float: "right",
          }}
          onClick={() => {
            setShowJSON(!showJSON);
          }}
        >
          <i className={`fa fa-${showJSON ? "times" : "database"}`}/>
        </a>
      </h1>
      {
        showJSON &&
          <InputGrid>
            <GridField label="systemMigrationVersion">
              <pre>
                {JSON.stringify(systemMigrationVersion, null, 2)}
              </pre>
            </GridField>
            <GridField label="defaultTheme">
              <pre>
                {JSON.stringify(defaultTheme, null, 2)}
              </pre>
            </GridField>
            <GridField label="investigativeAbilityCategories">
              <pre>
                {JSON.stringify(investigativeAbilityCategories, null, 2)}
              </pre>
            </GridField>
            <GridField label="generalAbilityCategories">
              <pre>
                {JSON.stringify(generalAbilityCategories, null, 2)}
              </pre>
            </GridField>
            <GridField label="combatAbilities">
              <pre>
                {JSON.stringify(combatAbilities, null, 2)}
              </pre>
            </GridField>
            <GridField label="shortNotes">
              <pre>
                {JSON.stringify(shortNotes, null, 2)}
              </pre>
            </GridField>
            <GridField label="longNotes">
              <pre>
                {JSON.stringify(longNotes, null, 2)}
              </pre>
            </GridField>
          </InputGrid>
      }
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
