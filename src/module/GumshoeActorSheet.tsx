import ReactDOM from "../../node_modules/react-dom";
import React from "../../node_modules/react";

// type AppProps = {
//   entity: any;
// }

const App = ({
  entity,
}: any) => {
  return (
    <div>
      React <b>App</b>!
    </div>
  );
};

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class GumshoeActorSheet extends ActorSheet {
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
    super.activateListeners(html);
    console.log("foo");
  }

  render (force = false, options = {}) {
    super.render(force, options);

    const content = <App entity={this.entity}/>;

    const el: HTMLElement = (this.element as any).jquery ? (this.element as JQuery<HTMLElement>).get(0) : this.element as HTMLElement;

    ReactDOM.render([content], el);

    return this;
  }
}
