import { Tracker as ReactCombatTracker } from "../components/combat/Tracker";
import { reactifiedCombatSidebarTemplatePath } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";
import React from "react";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { systemLogger } from "../functions";

export class InvestigatorCombatTrackerBase extends CombatTracker {

  constructor(...args: any[]) {
    systemLogger.log("InvestigatorCombatTrackerBase constructor");
    super(...args);
  }

  /** @override */
  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      template: reactifiedCombatSidebarTemplatePath,
      // resizable: true,
      // height: null,
    };
  }

  // we do love a hack. there is a weird behaviour in FVTT where when you pop
  // out the combat tracker, it gets auto-size some some proportion of the
  // screen height. This makes it less usable than the normla version. it comes
  // down to Application#createPopout which doesn't make the popout resizable.
  // So this override does everything from CombatTracker.createPopout and
  // Application#createPopout, but adds the `resizable` option.
  createPopout() {
    if ( this._popout ) return this._popout;
    // I can't see a good way to avoid this circularity, but it's fine.
    // I SAID IT'S FINE.
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const pop = new InvestigatorCombatTracker({
      popOut: true,
      height: window.innerHeight - 200,
      // ta-da
      resizable: true,

    }) as unknown as this; // the typing is a mess
    this._popout = pop;
    pop._original = this;
    pop.initialize({combat: this.viewed, render: true});
    return pop;
  }
}

const render = () => {
  return (
    <ErrorBoundary>
      <ReactCombatTracker />
    </ErrorBoundary>
  );
};

export const InvestigatorCombatTracker = ReactApplicationMixin(
  InvestigatorCombatTrackerBase,
  render,
);
