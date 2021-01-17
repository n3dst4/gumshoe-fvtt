// import ReactDOM from "react-dom";
import React from "react";
import { TrailActorSheet } from "../components/TrailActorSheet";
import { reactTemplate, systemName } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
class TrailActorSheetClassBase extends ActorSheet {
  /** @override */
  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: [systemName, "sheet", "actor"],
      template: reactTemplate,
      width: 660,
      height: 900,
    });
  }
}

const render = (sheet: TrailActorSheetClassBase) => {
  return (
    <TrailActorSheet
      entity={sheet.entity}
      foundryWindow={sheet}
    />
  );
};

export const TrailActorSheetClass = ReactApplicationMixin(
  TrailActorSheetClassBase,
  render,
);
