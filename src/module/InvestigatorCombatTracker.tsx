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

  createPopout() {
    if ( this._popout ) return this._popout;
    const pop = new InvestigatorCombatTrackerBase({
      popOut: true,
      height: null,
      resizable: true,
    }) as this;
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
