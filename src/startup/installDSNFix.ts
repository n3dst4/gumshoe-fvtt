import { assertGame } from "../functions/utilities";

export const installDSNFix = () => {
  assertGame(game);
  // turn off simultaneous rolls for DSN

  // simone's version from the docs:
  if (
    game.settings.settings.has("dice-so-nice.enabledSimultaneousRollForMessage")
  ) {
    game.settings.set(
      "dice-so-nice",
      "enabledSimultaneousRollForMessage",
      false,
    );
  }

  // the one that actually exists:
  if (game.settings.settings.has("dice-so-nice.enabledSimultaneousRolls")) {
    game.settings.set("dice-so-nice", "enabledSimultaneousRolls", false);
  }
};
