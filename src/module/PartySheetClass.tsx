import React from "react";
import { Suspense } from "../components/Suspense";
import { reactTemplatePath, systemName } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";

const PartySheet = React.lazy(async () => {
  const { PartySheet } = await import("../components/party/PartySheet");
  return {
    default: PartySheet,
  };
});

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
class PartySheetClassBase extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: [systemName, "sheet", "actor"],
      template: reactTemplatePath,
      width: 660,
      height: 900,
    });
  }
}

const render = (sheet: PartySheetClassBase) => {
  return (
    <Suspense>
      <PartySheet party={sheet.document} foundryApplication={sheet} />
    </Suspense>
  );
};

export const PartySheetClass = ReactApplicationMixin(
  PartySheetClassBase,
  render,
);
