/** @jsx jsx */
import { jsx } from "@emotion/react";
import { CombatTrackerDisplayInvestigator } from "../components/combat/CombatTrackerDisplayInvestigator";
import { reactifiedSidebarTemplatePath } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";

export class InvestigatorCombatTrackerBase extends CombatTracker {
  /** @override */
  static get defaultOptions () {
    return {
      ...super.defaultOptions,
      template: reactifiedSidebarTemplatePath,
      resizable: true,
    };
  }
}

const render = (sheet: InvestigatorCombatTrackerBase) => (
  <CombatTrackerDisplayInvestigator
    app={sheet}
  />
);

export const InvestigatorCombatTracker = ReactApplicationMixin(
  InvestigatorCombatTrackerBase,
  render,
  { callReplaceHtml: true },
);
