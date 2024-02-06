export class InvestigatorJournalSheet extends JournalSheet {
  /** @override */
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.classes.push("investigator");
    return options;
  }

  // render() {
  //   super.render();
  // }

  protected _replaceHTML(
    element: JQuery<HTMLElement>,
    html: JQuery<HTMLElement>,
  ): void {
    super._replaceHTML(element, html);
    // this.
    // html.find(".rollable").click(this._onRoll.bind(this));
  }

  /** @override */
  activateListeners(html: JQuery) {
    super.activateListeners(html);
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
