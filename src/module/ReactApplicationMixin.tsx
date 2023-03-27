import { createRoot, Root } from "react-dom/client";
import { FoundryAppContext } from "../components/FoundryAppContext";
import React from "react";

// type shenanigans to allow us to work backwards from a Class type to the type
// of the objects which it constructs

// a "Constructor of T" is the type of the class T, when used as a value
export type Constructor<T> = new (...args: any[]) => T;

// so Constructor<Application> is any class which is an Application
type ApplicationConstuctor = Constructor<Application>;

// Render<T> T is a Constructor<T2>. It then expects its actual argument to be
// a T2, i.e. the type of the thing the constructor constructs.
type Render<T> = (
  t: T extends Constructor<infer T2> ? T2 : T,
  serial: number,
) => JSX.Element;

export interface ReactApplicationMixinOptions {
  callReplaceHtml?: boolean;
}

const defaults: Required<ReactApplicationMixinOptions> = {
  callReplaceHtml: false,
};

/**
 * Wrap an existing Foundry Application class in this Mixin to override the
 * normal rednering behaviour and and use React instead.
 */
export function ReactApplicationMixin<TBase extends ApplicationConstuctor>(
  /**
   * The base class.
   */
  Base: TBase,
  /** A function which will be given an *instance* of Base and expected to
   * return some JSX.
   * */
  render: Render<TBase>,
  options: ReactApplicationMixinOptions = {},
) {
  const fullOptions = { ...defaults, ...options };

  return class Reactified extends Base {
    /**
     * Override _replaceHTML to stop FVTT's standard template lifecycle coming in
     * and knackering React on every update.
     * @see {@link Application._replaceHTML}
     * @override
     */
    _replaceHTML(element: JQuery, html: JQuery) {
      // this is the only thing we need to do here - react deals with updating
      // the rest of the window.
      if (fullOptions.callReplaceHtml && !this.initialized) {
        super._replaceHTML(element, html);
        this.initialized = true;
      }
      element.find(".window-title").text(this.title);
    }

    initialized = false;

    serial = 0;

    reactRoot: Root | undefined;

    /**
     * We need to pick somewhere to activate and render React. It would have
     * been nice to do this from `render` & friends but they happen before
     * there's a DOM element. `activateListeners` at least happens *after* the
     * DOM has been created.
     * @override
     */
    activateListeners(html: JQuery) {
      // we were previously calling super.activateListeners(html) here
      // leaving this comment in case it help with future debugging.
      const target = $(this.element).find(".react-target");
      const parent = target.closest(".window-content");
      if (this.options.resizable) {
        parent.addClass("resizable");
      } else {
        parent.addClass("non-resizable");
      }
      const el = target.get(0);

      if (el) {
        const content = (
          // <StrictMode>
          <FoundryAppContext.Provider
            value={this}
            key={"FoundryAppContextProvider"}
          >
            {render(
              this as TBase extends Constructor<infer T2> ? T2 : TBase,
              this.serial,
            )}
          </FoundryAppContext.Provider>
          // </StrictMode>
        );
        if (!this.reactRoot) {
          this.reactRoot = createRoot(el);
        }
        this.reactRoot.render(content);
        this.serial += 1;
      }
    }

    async close(options?: Application.CloseOptions) {
      if (this.reactRoot) {
        this.reactRoot.unmount();
        this.reactRoot = undefined;
      }
      return super.close(options);
    }
  };
}

// Module '"react-dom"' has no exported member 'createRoot'.
