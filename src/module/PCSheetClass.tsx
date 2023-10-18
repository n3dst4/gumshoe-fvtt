import React from "react";

import { PCSheet } from "../components/characters/PCSheet";
import { reactTemplatePath, systemId } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
class PCSheetClassBase extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: [systemId, "sheet", "actor"],
      template: reactTemplatePath,
      width: 777,
      height: 900,
    });
  }
}

const render = (sheet: PCSheetClassBase) => {
  return <PCSheet actor={sheet.document} foundryApplication={sheet} />;
};

export const PCSheetClass = ReactApplicationMixin(
  "PCSheetClass",
  PCSheetClassBase,
  render,
);
