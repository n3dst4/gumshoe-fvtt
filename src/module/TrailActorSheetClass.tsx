// import ReactDOM from "react-dom";
import React from "react";
import { TrailActorSheet } from "../components/TrailActorSheet";
import { ReactSheet } from "./ReactSheet";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
class TrailActorSheetClassBase extends ActorSheet {
  /** @override */
  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: ["trail-of-cthulhu-unsanctioned", "sheet", "actor"],
      template: "systems/trail-of-cthulhu-unsanctioned/templates/actor/trail-actor-sheet.handlebars",
      width: 660,
      height: 900,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
    });
  }
}

const render = (sheet: TrailActorSheetClassBase) => {
  return <TrailActorSheet
    entity={sheet.entity}
    foundryWindow={sheet}//
  />;
};

export const TrailActorSheetClass = ReactSheet(TrailActorSheetClassBase, render as any);
