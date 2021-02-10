// import ReactDOM from "react-dom";
import React from "react";
import { TrailItemSheet } from "../components/TrailItemSheet";
import { reactTemplatePath, systemName } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
class TrailItemSheetClassBase extends ItemSheet {
  /** @override */
  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: [systemName, "sheet", "item"],
      template: reactTemplatePath,
      width: 400,
      height: "auto",
      resizable: false,
    });
  }
}

const render = (sheet: TrailItemSheetClassBase) => {
  return (
    <TrailItemSheet
      item={sheet.entity}
      foundryApplication={sheet}
    />
  );
};

export const TrailItemSheetClass = ReactApplicationMixin(
  TrailItemSheetClassBase,
  render,
);
