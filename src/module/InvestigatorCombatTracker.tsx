/** @jsx jsx */
import { jsx } from "@emotion/react";
import { StandardCombatTracker } from "../components/combat/StandardCombatTracker";
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
  <StandardCombatTracker />
);

export const InvestigatorCombatTracker = ReactApplicationMixin(
  InvestigatorCombatTrackerBase,
  render,
  { callReplaceHtml: true },
);
