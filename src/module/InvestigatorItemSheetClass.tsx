// import ReactDOM from "react-dom";
import React from "react";
import { InvestigatorItemSheet } from "../components/InvestigatorItemSheet";
import { reactTemplatePath, systemName } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
class InvestigatorEquipmentSheetClassBase extends ItemSheet {
  /** @override */
  static get defaultOptions () {
    return {
      ...super.defaultOptions,
      classes: [systemName, "sheet", "item"],
      template: reactTemplatePath,
      width: 400,
      height: "auto" as const,
      resizable: false,
    };
  }
}

const render = (sheet: InvestigatorEquipmentSheetClassBase) => {
  return (
    <InvestigatorItemSheet
      item={sheet.document}
      foundryApplication={sheet}
    />
  );
};

export const InvestigatorEquipmentSheetClass = ReactApplicationMixin(
  InvestigatorEquipmentSheetClassBase,
  render,
);

class InvestigatorAbilitySheetClassBase extends ItemSheet {
  /** @override */
  static get defaultOptions () {
    return {
      ...super.defaultOptions,
      classes: [systemName, "sheet", "item"],
      template: reactTemplatePath,
      width: 400,
      height: 600,
      resizable: true,
    };
  }
}

export const InvestigatorAbilitySheetClass = ReactApplicationMixin(
  InvestigatorAbilitySheetClassBase,
  render,
);

class InvestigatorMwItemSheetClassBase extends ItemSheet {
  /** @override */
  static get defaultOptions () {
    return {
      ...super.defaultOptions,
      classes: [systemName, "sheet", "item"],
      template: reactTemplatePath,
      width: 400,
      height: 600,
      resizable: true,
    };
  }
}

export const InvestigatorMwItemSheetClass = ReactApplicationMixin(
  InvestigatorMwItemSheetClassBase,
  render,
);
