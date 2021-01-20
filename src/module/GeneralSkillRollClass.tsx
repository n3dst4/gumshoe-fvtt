import React from "react";
import { GeneralSkillRoll } from "../components/skills/GeneralSkillRoll";
import { reactTemplatePath, systemName } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";
import { TrailItem } from "./TrailItem";

class GeneralSkillRollClassBase extends BaseEntitySheet<TrailItem> {
  /** @override */
  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: [systemName, "sheet", "actor"],
      template: reactTemplatePath,
      width: 330,
      height: 200,
      resizable: true,
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
