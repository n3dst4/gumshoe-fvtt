// import ReactDOM from "react-dom";
import React from "react";
import { GumshoeItemSheet } from "../components/GumshoeItemSheet";
import { reactTemplatePath, systemName } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
class GumshoeItemSheetClassBase extends ItemSheet {
  /** @override */
  static get defaultOptions () {
    return {
      ...super.defaultOptions,
      classes: [systemName, "sheet", "item"],
      template: reactTemplatePath,
      width: 400,
      height: "auto" as const,
      resizable: false,
    };
  }
}

const render = (sheet: GumshoeItemSheetClassBase) => {
  return (
    <GumshoeItemSheet
      item={sheet.document}
      foundryApplication={sheet}
    />
  );
};

export const GumshoeItemSheetClass = ReactApplicationMixin(
  GumshoeItemSheetClassBase,
  render,
);
