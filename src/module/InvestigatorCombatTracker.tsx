import { Tracker as ReactCombatTracker } from "../components/combat/Tracker";
import { reactifiedCombatSidebarTemplatePath } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";
import React from "react";

export class InvestigatorCombatTrackerBase extends CombatTracker {
  /** @override */
  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      template: reactifiedCombatSidebarTemplatePath,
      resizable: false,
    };
  }
}

const render = () => <ReactCombatTracker />;

export const InvestigatorCombatTracker = ReactApplicationMixin(
  InvestigatorCombatTrackerBase,
  render,
);
