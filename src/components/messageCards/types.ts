import * as constants from "../../constants";

export type AbilityCardMode =
  | typeof constants.htmlDataModeTest
  | typeof constants.htmlDataModeSpend;

export const isAbilityCardMode = (
  candidate: string | AbilityCardMode,
): candidate is AbilityCardMode => {
  return (
    candidate === constants.htmlDataModeTest ||
    candidate === constants.htmlDataModeSpend ||
    candidate === constants.htmlDataModeAttack
  );
};
