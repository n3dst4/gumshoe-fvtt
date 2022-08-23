import React from "react";
import { reactTemplatePath, systemName } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";
import { PCSheet } from "../components/characters/PCSheet";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
class PCSheetClassBase extends ActorSheet {
  /** @override */
  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: [systemName, "sheet", "actor"],
      template: reactTemplatePath,
      width: 777,
      height: 900,
    });
  }
}

const render = (sheet: PCSheetClassBase) => {
  return (
    <PCSheet actor={sheet.document} foundryApplication={sheet} />
  );
};

export const PCSheetClass = ReactApplicationMixin(
  PCSheetClassBase,
  render,
);
