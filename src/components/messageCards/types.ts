import * as constants from "../../constants";

export type AbilityCardMode =
  | typeof constants.htmlDataModeTest
  | typeof constants.htmlDataModeSpend
  | typeof constants.htmlDataModeAttack
  | typeof constants.htmlDataModeMwTest
  | typeof constants.htmlDataModeMwNegate
  | typeof constants.htmlDataModeMwWallop
  | typeof constants.htmlDataModePush;

export const isAbilityCardMode = (
  candidate: string,
): candidate is AbilityCardMode => {
  return (
    candidate === constants.htmlDataModeTest ||
    candidate === constants.htmlDataModeSpend ||
    candidate === constants.htmlDataModeAttack ||
    candidate === constants.htmlDataModeMwTest ||
    candidate === constants.htmlDataModeMwNegate ||
    candidate === constants.htmlDataModeMwWallop ||
    candidate === constants.htmlDataModePush
  );
};

export interface MWResult {
  text: string;
  color: string;
}
