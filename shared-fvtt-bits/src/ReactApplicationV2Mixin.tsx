// import React, { StrictMode } from "react";
// import { createRoot, Root } from "react-dom/client";

// import { FoundryApplicationContext } from "./FoundryAppContext";
import { createRoot, Root } from "react-dom/client";

import { Constructor, RecursivePartial, Render } from "./types";

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// WORK IN VERY PROGRESS
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// so Constructor<Application> is any class which is an Application
type ApplicationV2Constuctor =
  Constructor<foundry.applications.api.ApplicationV2>;

/**
 * Wrap an existing Foundry Application class in this Mixin to override the
 * normal rednering behaviour and and use React instead.
 */
export function ReactApplicationV2Mixin<TBase extends ApplicationV2Constuctor>(
  /**
   * Name to be attached to the created class. This is needed because minified
   * classes have weird names which can break foundry when thney get used as
   * HTML ids.
   */
  name: string,
  /**
   * The base class.
   */
  Base: TBase,
  /** A function which will be given an *instance* of Base and expected to
   * return some JSX.
   * */
  render: Render<TBase>,
) {
  class Reactified extends Base {
    static DEFAULT_OPTIONS: RecursivePartial<foundry.applications.types.ApplicationConfiguration> =
      {
        ...foundry.applications.api.ApplicationV2.DEFAULT_OPTIONS,
        classes: ["document-sheet"],

        window: {
          ...foundry.applications.api.ApplicationV2.DEFAULT_OPTIONS.window,
          frame: true,
        },
      };

    // PROPERTIES

    reactRoot: Root | undefined;

    serial = 0;

    // METHODS

    // From Atropos: _renderFrame only occurs once and is the most natural point
    // (given the current API) to bind the content div to your react component.
    async _renderFrame(options: unknown) {
      const element = await super._renderFrame(options);
      const target = this.hasFrame
        ? element.querySelector(".window-content")
        : element;
      if (target) {
        this.reactRoot = createRoot(target);
      }
      return element;
    }

    // _renderHTML is the semantically appropriate place to render updates to the
    // HTML of the app.
    override _renderHTML() {
      this.reactRoot?.render(render(this as any, this.serial));
      this.serial += 1;
      return Promise.resolve();
    }

    // XXX This override will be optional in P3
    override _replaceHTML(result: any, content: HTMLElement, options: any) {}
  }

  // see comment on name arg above
  Object.defineProperty(Reactified, "name", { value: name });

  return Reactified;
}
