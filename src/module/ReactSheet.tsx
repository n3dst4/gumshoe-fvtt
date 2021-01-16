// To get started, we need a type which we'll use to extend
// other classes from. The main responsibility is to declare
// that the type being passed in is a class.

import React from "react";
import ReactDOM from "react-dom";
import { TrailActorSheet } from "../components/TrailActorSheet";

type GConstructor<T> = new (...args: any[]) => T;

// This mixin adds a scale property, with getters and setters
// for changing it with an encapsulated private property:

type SheetLike = GConstructor<{
  activateListeners (html: any): void,
  element: any,
  entity: any,
}>

export function ReactSheet<TBase extends SheetLike> (Base: TBase) {
  return class Reactified extends Base {
  /**
   * Override _replaceHTML to stop FVTT's standard template lifecycle coming in
   * and knackering React on every update.
   * @see {@link Application._replaceHTML}
   * @override
   */
    _replaceHTML (element, html, options) {
    // we are deliberately doing nothing here.
    }

    /**
   * We need to pick somewhere to activate and render React. It would have nice
   * to do this from `render` & friends but they happen before there's a DOM
   * element. `activateListeners` at least happens *after* the DOM has been
   * created.
   * @override
   */
    activateListeners (html) {
      console.log("activateListeners");
      super.activateListeners(html);

      const el: HTMLElement = (this.element as any).jquery
        ? (this.element as JQuery<HTMLElement>).find("form").get(0)
        : this.element as HTMLElement;

      if (el) {
        ReactDOM.render(
          <TrailActorSheet
            entity={this.entity}
            foundryWindow={this}
          />,
          el,
        );
      }
    }
  };
}
