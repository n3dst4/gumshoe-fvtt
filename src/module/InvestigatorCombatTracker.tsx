/* eslint-disable @typescript-eslint/no-unused-vars */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { CombatTrackerDisplayClassic } from "../components/combat/CombatTrackerDisplayClassic";
import { reactifiedSidebarTemplatePath, reactTemplatePath } from "../constants";
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
  <CombatTrackerDisplayClassic
    app={sheet}
  />
);

export const InvestigatorCombatTracker = ReactApplicationMixin(
  InvestigatorCombatTrackerBase,
  render,
  { callReplaceHtml: true },
);
