import { assertGame } from "../functions/functionsThatDontUseSettings";
import { SettingsClass } from "../module/SettingsClass";
import * as constants from "../constants";

export const registerSettingsMenu = function () {
  assertGame(game);

  // Define a settings submenu which handles advanced configuration needs
  game.settings.registerMenu(constants.systemName, "investigatorSettingsMenu", {
    name: "INVESTIGATOR Settings",
    label: "Open INVESTIGATOR System Settings", // The text label used in the button
    // hint: "A description of what will occur in the submenu dialog.",
    icon: "fas fa-search", // A Font Awesome icon used in the submenu button
    type: SettingsClass, // A FormApplication subclass which should be created
    restricted: true, // Restrict this submenu to gamemaster only?
  });
};
