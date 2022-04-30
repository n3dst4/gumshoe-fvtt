/* eslint-disable @typescript-eslint/no-unused-vars */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { CombatTrackerDisplay } from "../components/combat/CombatTrackerDisplay";
import { reactifiedSidebarTemplatePath, reactTemplatePath } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";

export class InvestigatorCombatTrackerBase extends CombatTracker {
  constructor () {
    console.log("InvestigatorCombatTrackerBase");
    super();
  }

  /** @override */
  static get defaultOptions () {
    return {
      ...super.defaultOptions,
      template: reactifiedSidebarTemplatePath,
      resizable: true,
    };
  }
}

const render = (sheet: InvestigatorCombatTrackerBase) => {
  return (
    <CombatTrackerDisplay
      // item={sheet.document}
      foundryApplication={sheet}
    />
  );
};

export const InvestigatorCombatTracker = ReactApplicationMixin(
  InvestigatorCombatTrackerBase,
  render,
  true,
);

// export const InvestigatorCombatTracker = InvestigatorCombatTrackerBase;
