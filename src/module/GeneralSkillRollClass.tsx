import React from "react";
import { GeneralSkillRoll } from "../components/GeneralSkillRoll";
import { reactTemplatePath, systemName } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";
import { TrailItem } from "./TrailItem";

class GeneralSkillRollClassBase extends BaseEntitySheet<TrailItem> {
  /** @override */
  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: [systemName, "sheet", "actor"],
      template: reactTemplatePath,
      width: 660,
      height: 900,
    });
  }
}

const render = (sheet: GeneralSkillRollClassBase) => {
  return (
    <GeneralSkillRoll
      entity={sheet.entity}
      foundryWindow={sheet}
    />
  );
};

export const GeneralSkillRollClass = ReactApplicationMixin(
  GeneralSkillRollClassBase,
  render,
);
