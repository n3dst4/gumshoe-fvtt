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
      // height: 350,
      resizable: true,
    });
  }
}

const render = (sheet: TrailItemSheetClassBase) => {
  return (
    <TrailItemSheet
      entity={sheet.entity}
      foundryWindow={sheet}
    />
  );
};

export const TrailItemSheetClass = ReactApplicationMixin(
  TrailItemSheetClassBase,
  render,
);
