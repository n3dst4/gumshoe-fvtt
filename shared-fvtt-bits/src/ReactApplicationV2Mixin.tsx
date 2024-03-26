// import React, { StrictMode } from "react";
// import { createRoot, Root } from "react-dom/client";

// import { FoundryApplicationContext } from "./FoundryAppContext";
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

    override async _renderHTML(
      context: any,
      options: foundry.applications.types.ApplicationRenderOptions,
    ) {
      console.log("hello from renderHTML");
      const div = document.createElement("div");
      div.innerHTML = "helloe from renderHTML";
      return div;
    }

    override _replaceHTML(
      result: any,
      content: HTMLElement,
      options: foundry.applications.types.ApplicationRenderOptions,
    ) {
      content.replaceChildren(result);

      // const div = document.createElement("div");
      // div.innerHTML = "helloe from replaceHTML";
      // return div;
      // this.element.replaceChildren(result);
    }
  }

  // see comment on name arg above
  Object.defineProperty(Reactified, "name", {
    value: name,
  });

  return Reactified;
}

// -------------------------------------

export default class DialogV2 extends foundry.applications.api.ApplicationV2 {
  /** @inheritDoc */
  static DEFAULT_OPTIONS = mergeObject(super.DEFAULT_OPTIONS, {
    id: "dialog-{id}",
    classes: ["dialog"],
    tag: "aside",
    window: {
      frame: true,
      positioned: true,
      minimizable: false,
    },
  });

  /** @inheritDoc */
  _initializeApplicationOptions(
    options: foundry.applications.types.ApplicationConfiguration,
  ) {
    options = super._initializeApplicationOptions(options);
    // @ts-expect-error saddfsdfsd
    if (!options.buttons.length)
      throw new Error("You must define at least one entry in options.buttons");
    // @ts-expect-error saddfsdfsd
    for (const button of options.buttons) {
      options.actions[button.action] = async (event, target) => {
        const result = await button.callback?.(event, target);
        // @ts-expect-error saddfsdfsd
        await options.submit?.(result);
        await this.close();
      };
    }
    return options;
  }

  /** @override */
  // @ts-expect-error saddfsdfsd
  async _renderHTML(context, options) {
    const form = document.createElement("form");
    form.className = "dialog-form standard-form";
    form.autocomplete = "off";
    // @ts-expect-error saddfsdfsd
    const buttons = this.options.buttons.map((b) => {
      let buttonContent = b.label;
      if (b.icon) buttonContent = `<i class="${b.icon}"></i>${buttonContent}`;
      return `<button type="button" data-action="${b.action}">${buttonContent}</button>`;
    });
    // @ts-expect-error saddfsdfsd
    form.innerHTML = `<div class="dialog-content">${this.options.content}</div>
      <footer class="form-footer">${buttons.join("")}</footer>`;
    return form;
  }

  /** @override */
  // @ts-expect-error saddfsdfsd
  _replaceHTML(result, content, options) {
    content.replaceChildren(result);
  }

  /**
   * Wrap the Dialog application in an enclosing promise which returns the result upon user input.
   * @param {Partial<ApplicationConfiguration & DialogV2Configuration>} options
   * @returns {Promise<any>}
   */
  // @ts-expect-error saddfsdfsd
  static async prompt(options) {
    return new Promise((resolve) => {
      // @ts-expect-error saddfsdfsd
      const submit = async (result) => resolve(result);
      const dialog = new DialogV2({ ...options, submit });
      dialog.render(true);
    });
  }
}

Hooks.on("ready", async () => {
  // const linkElement = document.createElement("link");
  // linkElement.rel = "stylesheet";
  // linkElement.href = "/css/foundry2.css";
  // document.head.appendChild(linkElement);
  // @ ts-expect-error saddfsdfsd
  // result = await DialogV2.prompt({
  //   window: {
  //     title: "My Dialog Prompt",
  //     icon: "fa-solid fa-question",
  //   },
  //   content: `
  //     <div class="form-group">
  //       <label>Pick a Number</label>
  //       <input name="pick" type="number" min="1" max="10" step="1">
  //       <p class="hint">Pick a number between 1 and 10!</p>
  //     </div>
  //   `,
  //   buttons: [
  //     {
  //       action: "submit",
  //       label: "Submit",
  //       icon: "fa-solid fa-check",
  //       // @ts-expect-error saddfsdfsd
  //       callback: (event, button) => {
  //         return button.closest("form").pick.valueAsNumber;
  //       },
  //     },
  //   ],
  // });
});
