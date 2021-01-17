import ReactDOM from "react-dom";

type Constructor<T> = new (...args: any[]) => T;

type ApplicationConstuctor = Constructor<Application>

type Render<T> = (t: T) => JSX.Element;

// This mixin adds a scale property, with getters and setters
// for changing it with an encapsulated private property:

export function ReactSheet<TBase extends ApplicationConstuctor> (Base: TBase, render: Render<TBase>) {
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
        const content = render(this as any);
        ReactDOM.render(
          content,
          el,
        );
      }
    }
  };
}
