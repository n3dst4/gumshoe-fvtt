import React from "react";
import { Suspense } from "../components/Suspense";
import { reactTemplatePath, systemName } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";

const NPCSheet = React.lazy(() =>
  import("../components/characters/NPCSheet").then(({ NPCSheet }) => ({
    default: NPCSheet,
  })),
);

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
class InvestigatorNPCSheetClassBase extends ActorSheet {
  /** @override */
  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: [systemName, "sheet", "actor"],
      template: reactTemplatePath,
      width: 700,
      height: 660,
    });
  }
}

const render = (sheet: InvestigatorNPCSheetClassBase) => {
  return (
    <Suspense>
      <NPCSheet actor={sheet.document} foundryApplication={sheet} />
    </Suspense>
  );
};

export const InvestigatorNPCSheetClass = ReactApplicationMixin(
  InvestigatorNPCSheetClassBase,
  render,
);
