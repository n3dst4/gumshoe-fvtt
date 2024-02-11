import { extraCssClasses, systemId } from "../constants";
import { systemLogger } from "../functions/utilities";

export class InvestigatorJournalSheet extends JournalSheet {
  /** @override */
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.classes.push("investigator");
    return options;
  }

  /** @override */
  activateListeners(html: JQuery) {
    systemLogger.log("ACTIVATE LISTENERS", html);
    super.activateListeners(html);

    // find the entry content element and add the journal entry's classes onto
    // it
    const journalEntryContentElement = this.element.find(
      ".journal-entry-content",
    );
    const journalEntryClasses =
      // @ts-expect-error sigh
      this.document.flags[systemId]?.[extraCssClasses] ?? "";
    journalEntryContentElement.addClass(journalEntryClasses);

    // find the page element, work out which page is active, and add the page's
    // classes onto it
    const contentElement = this.element.find(".journal-entry-content");
    // @ts-expect-error sigh
    const page = this.document.pages.contents[this._getCurrentPage()];
    const pageClasses = page.flags[systemId]?.[extraCssClasses] ?? "";
    contentElement.addClass(pageClasses);
  }
}
