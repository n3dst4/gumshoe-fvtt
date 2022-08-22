import React from "react";
import { Suspense } from "../components/Suspense";
import { reactTemplatePath, systemName } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";

const InvestigatorPartySheet = React.lazy(() =>
  import("../components/party/InvestigatorPartySheet").then(
    ({ InvestigatorPartySheet }) => ({
      default: InvestigatorPartySheet,
    }),
  ),
);

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
class InvestigatorPartySheetClassBase extends ActorSheet {
  /** @override */
  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: [systemName, "sheet", "actor"],
      template: reactTemplatePath,
      width: 660,
      height: 900,
    });
  }
}

const render = (sheet: InvestigatorPartySheetClassBase) => {
  return (
    <Suspense>
      <InvestigatorPartySheet
        party={sheet.document}
        foundryApplication={sheet}
      />
    </Suspense>
  );
};

export const InvestigatorPartySheetClass = ReactApplicationMixin(
  InvestigatorPartySheetClassBase,
  render,
);
