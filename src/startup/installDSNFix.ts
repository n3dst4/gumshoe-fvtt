import { assertGame } from "../functions";

export const installDSNFix = () => {
  assertGame(game);
  // turn off simultaneous rolls for DSN
  // simone's version from the docs:
  game.settings.set("dice-so-nice", "enabledSimultaneousRollForMessage", false);
  // the one that actually exists:
  game.settings.set("dice-so-nice", "enabledSimultaneousRolls", false);
};
