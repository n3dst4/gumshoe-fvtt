import { extraCssClasses, systemId } from "../constants";
import { systemLogger } from "../functions/utilities";

export class InvestigatorJournalSheet extends JournalSheet {
  /** @override */
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.classes.push("investigator");
    return options;
  }

  render(...args: any[]) {
    systemLogger.log("RENDER", args);
    super.render(...args);

    return this;
  }

  protected _replaceHTML(
    element: JQuery<HTMLElement>,
    html: JQuery<HTMLElement>,
  ): void {
    systemLogger.log("REPLACE HTML", html);
    super._replaceHTML(element, html);
    // this.
    // html.find(".rollable").click(this._onRoll.bind(this));
  }

  /** @override */
  activateListeners(html: JQuery) {
    systemLogger.log("ACTIVATE LISTENERS", html);
    super.activateListeners(html);
    const contentElement = this.element.find(".journal-entry-content");
    // @ts-expect-error sigh
    const page = this.document.pages.contents[this._getCurrentPage()];
    const classes = page.flags[systemId]?.[extraCssClasses] ?? "";
    contentElement.addClass(classes);

    // html.find(".rollable").click(this._onRoll.bind(this));
  }

  // _onRoll(event) {
  //   event.preventDefault();
  //   const element = event.currentTarget;
  //   const formula = event.currentTarget.dataset.roll;
  //   if (formula) {
  //     const roll = new Roll(formula);
  //     roll.toMessage();
  //   }
  // }
}
