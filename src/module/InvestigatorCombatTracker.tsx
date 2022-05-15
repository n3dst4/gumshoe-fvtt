/** @jsx jsx */
import { jsx } from "@emotion/react";
import { CombatTrackerSwitch } from "../components/combat/CombatTrackerSwitch";
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

const render = () => (
  <CombatTrackerSwitch />
);

export const InvestigatorCombatTracker = ReactApplicationMixin(
  InvestigatorCombatTrackerBase,
  render,
  { callReplaceHtml: true },
);
