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
      ? (this.element as JQuery<HTMLElement>).find("form").get(0)
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

  /** @override */
  _replaceHTML (element, html, options) {
    // if (!element.length) return;

    // if (this.popOut) {
    //   // For pop-out windows update the inner content and the window title
    //   element.find(".window-content").html(html);
    //   element.find(".window-title").text(this.title);
    // } else {
    //   // For regular applications, replace the whole thing
    //   element.replaceWith(html);
    //   this._element = html;
    // }
  }
}
