import ReactDOM from "react-dom";

export type Constructor<T> = new (...args: any[]) => T;

type ApplicationConstuctor = Constructor<Application>;

type Render<T> = (t: T extends Constructor<infer T2> ? T2 : T) => JSX.Element;

// This mixin adds a scale property, with getters and setters
// for changing it with an encapsulated private property:

export function ReactApplicationMixin<TBase extends ApplicationConstuctor> (
  Base: TBase,
  render: Render<TBase>,
) {
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
     * We need to pick somewhere to activate and render React. It would have
     * been nice to do this from `render` & friends but they happen before
     * there's a DOM element. `activateListeners` at least happens *after* the
     * DOM has been created.
     * @override
     */
    activateListeners (html) {
      console.log("activateListeners");
      super.activateListeners(html);

      const el: HTMLElement = (this.element as any).jquery
        ? (this.element as JQuery<HTMLElement>).find(".react-target").get(0)
        : (this.element as HTMLElement);

      if (el) {
        const content = render(
          this as TBase extends Constructor<infer T2> ? T2 : TBase,
        );
        ReactDOM.render(content, el);
      }
    }
  };
}
