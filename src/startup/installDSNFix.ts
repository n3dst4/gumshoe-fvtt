import { assertGame } from "../functions";

export const installDSNFix = () => {
  assertGame(game);
  // turn off simultaneous rolls for DSN
  // simone's version from the docs:
  try {
    game.settings.set(
      "dice-so-nice",
      "enabledSimultaneousRollForMessage",
      false,
    );
  } catch {
    // do nothing
  }
  // the one that actually exists:
  try {
    game.settings.set("dice-so-nice", "enabledSimultaneousRolls", false);
  } catch {
    // do nothing
  }
};
