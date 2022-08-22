// import ReactDOM from "react-dom";
import React from "react";
import { Suspense } from "../components/Suspense";
import { reactTemplatePath, systemName } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";

const InvestigatorItemSheet = React.lazy(() =>
  import("../components/ItemSheet").then(({ ItemSheet }) => ({
    default: ItemSheet,
  })),
);

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
      width: 450,
      height: 600,
      resizable: true,
    };
  }
}

const render = (sheet: InvestigatorEquipmentSheetClassBase) => {
  return (
    <Suspense>
      <InvestigatorItemSheet
        item={sheet.document}
        foundryApplication={sheet}
      />
    </Suspense>
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
      width: 450,
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
      width: 450,
      height: 600,
      resizable: true,
    };
  }
}

export const InvestigatorMwItemSheetClass = ReactApplicationMixin(
  InvestigatorMwItemSheetClassBase,
  render,
);
