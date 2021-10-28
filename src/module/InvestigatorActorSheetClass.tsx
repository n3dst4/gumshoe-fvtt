// import ReactDOM from "react-dom";
import React from "react";
import { GumshoeActorSheet } from "../components/characters/GumshoeActorSheet";
import { reactTemplatePath, systemName } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
class InvestigatorActorSheetClassBase extends ActorSheet {
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

const render = (sheet: InvestigatorActorSheetClassBase) => {
  return (
    <GumshoeActorSheet
      actor={sheet.document}
      foundryApplication={sheet}
    />
  );
};

export const InvestigatorActorSheetClass = ReactApplicationMixin(
  InvestigatorActorSheetClassBase,
  render,
);
