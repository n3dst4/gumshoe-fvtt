// import ReactDOM from "react-dom";
import React from "react";
import { GumshoeNPCSheet } from "../components/characters/GumshoeNPCSheet";
import { reactTemplatePath, systemName } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
class GumshoeNPCSheetClassBase extends ActorSheet {
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

const render = (sheet: GumshoeNPCSheetClassBase) => {
  return (
    <GumshoeNPCSheet
      actor={sheet.document}
      foundryApplication={sheet}
    />
  );
};

export const GumshoeNPCSheetClass = ReactApplicationMixin(
  GumshoeNPCSheetClassBase,
  render,
);
