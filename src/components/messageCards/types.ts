import * as constants from "../../constants";

type AbilityCardModeTestSpend =
  | typeof constants.htmlDataModeTest
  | typeof constants.htmlDataModeSpend;

export type AbilityCardMode =
  | AbilityCardModeTestSpend
  | typeof constants.htmlDataModeAttack
  | typeof constants.htmlDataModeMwTest;

export const isAbilityCardMode = (
  candidate: string | AbilityCardMode,
): candidate is AbilityCardMode => {
  return (
    candidate === constants.htmlDataModeTest ||
    candidate === constants.htmlDataModeSpend ||
    candidate === constants.htmlDataModeAttack ||
    candidate === constants.htmlDataModeMwTest
  );
};

export interface MWResult {
  text: string;
  color: string;
}
