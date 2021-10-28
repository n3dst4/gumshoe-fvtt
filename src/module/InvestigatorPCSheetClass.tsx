// import ReactDOM from "react-dom";
import React from "react";
import { InvestigatorPCSheet } from "../components/characters/InvestigatorPCSheet";
import { reactTemplatePath, systemName } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
class InvestigatorPCSheetClassBase extends ActorSheet {
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

const render = (sheet: InvestigatorPCSheetClassBase) => {
  return (
    <InvestigatorPCSheet
      actor={sheet.document}
      foundryApplication={sheet}
    />
  );
};

export const InvestigatorPCSheetClass = ReactApplicationMixin(
  InvestigatorPCSheetClassBase,
  render,
);
