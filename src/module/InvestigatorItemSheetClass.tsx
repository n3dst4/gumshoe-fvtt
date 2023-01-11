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
class EquipmentSheetClassBase extends ItemSheet {
  /** @override */
  static get defaultOptions() {
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

const render = (sheet: EquipmentSheetClassBase) => {
  return (
    <Suspense>
      <InvestigatorItemSheet item={sheet.document} foundryApplication={sheet} />
    </Suspense>
  );
};

export const EquipmentSheetClass = ReactApplicationMixin(
  EquipmentSheetClassBase,
  render,
);

class AbilitySheetClassBase extends ItemSheet {
  /** @override */
  static get defaultOptions() {
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

export const AbilitySheetClass = ReactApplicationMixin(
  AbilitySheetClassBase,
  render,
);

class MwItemSheetClassBase extends ItemSheet {
  /** @override */
  static get defaultOptions() {
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

export const MwItemSheetClass = ReactApplicationMixin(
  MwItemSheetClassBase,
  render,
);
