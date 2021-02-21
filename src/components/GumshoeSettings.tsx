/* eslint-disable @typescript-eslint/no-unused-vars */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useEffect, useState } from "react";
import * as constants from "../constants";

type GumshoeSettingsProps = {
  foundryApplication: Application;
};

const getWorldSettings = () => {
  const worldSettings = game.settings.storage.get("world") as Map<any, any>;
  return {
    investigativeAbilityCategories: worldSettings.get(
      "trail-of-cthulhu-unsanctioned.investigativeAbilityCategories",
    ),
    defaultTheme: worldSettings.get(
      "trail-of-cthulhu-unsanctioned.defaultTheme",
    ),
    combatAbilities: worldSettings.get(
      "trail-of-cthulhu-unsanctioned.combatAbilities",
    ),
    systemMigrationVersion: worldSettings.get(
      "trail-of-cthulhu-unsanctioned.systemMigrationVersion",
    ),
    abilityCategories: worldSettings.get(
      "trail-of-cthulhu-unsanctioned.abilityCategories",
    ),
    shortNotes: worldSettings.get("trail-of-cthulhu-unsanctioned.shortNotes"),
  };
};

const useSetting = <T extends any = string>(id: string) => {
  const [value, setState] = useState(game.settings.get(constants.systemName, id));
  const setter = useCallback((newValue: T) => {
    setState(newValue);
    game.settings.set(constants.systemName, id, newValue);
  }, [id]);
  return [value, setter];
};

const useListSetting = (id: string) => {
  const [value, setState] = useState(JSON.parse(game.settings.get(constants.systemName, id)));
  const setter = useCallback((newValue: string[]) => {
    setState(newValue);
    game.settings.set(constants.systemName, id, JSON.stringify(newValue));
  }, [id]);
  return [value, setter];
};

export const GumshoeSettings: React.FC<GumshoeSettingsProps> = ({
  foundryApplication,
}) => {
  // there is also abilityCategories which is legacy and may be lying around for compat purposes
  const [systemMigrationVersion, setSystemMigrationVersion] = useSetting(constants.systemMigrationVersion);
  const [defaultTheme, setDefaultTheme] = useSetting<string[]>(constants.defaultTheme);
  const [investigativeAbilityCategories, setInvestigativeAbilityCategories] = useListSetting(constants.investigativeAbilityCategories);
  const [generalAbilityCategories, setGeneralAbilityCategories] = useListSetting(constants.generalAbilityCategories);
  const [combatAbilities, setCombatAbilities] = useListSetting(constants.combatAbilities);
  const [shortNotes, setShortNotes] = useListSetting(constants.shortNotes);
  const [longNotes, setLongNotes] = useListSetting(constants.longNotes);

  return <div>Gumshoe settings go here</div>;
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
