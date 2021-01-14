import ReactDOM from "react-dom";
import React from "react";
import { GumshoeActorSheet } from "../components/GumshoeActorSheet";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class GumshoeActorSheetClass extends ActorSheet {
  /** @override */
  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: ["gumshoe", "sheet", "actor"],
      template: "systems/gumshoe/templates/actor/gumshoe-actor-sheet.handlebars",
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
    });
  }

  activateListeners (html) {
    console.log("activateListeners");
    super.activateListeners(html);

    const el: HTMLElement = (this.element as any).jquery
      ? (this.element as JQuery<HTMLElement>).find(".react-target").get(0)
      : this.element as HTMLElement;

    if (el) {
      ReactDOM.render(<GumshoeActorSheet entity={this.entity}/>, el);
    }
  }

  render (force = false, options = {}) {
    super.render(force, options);
    console.log("render");
    return this;
  }
}
