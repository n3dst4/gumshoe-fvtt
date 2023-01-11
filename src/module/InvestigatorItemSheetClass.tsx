// import ReactDOM from "react-dom";
import React from "react";
import { Suspense } from "../components/Suspense";
import { reactTemplatePath, systemName } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";

// React stuff -----------------------------------------------------------------

const InvestigatorItemSheet = React.lazy(() =>
  import("../components/ItemSheet").then(({ ItemSheet }) => ({
    default: ItemSheet,
  })),
);

const render = (sheet: ItemSheetClassBase) => {
  return (
    <Suspense>
      <InvestigatorItemSheet item={sheet.document} foundryApplication={sheet} />
    </Suspense>
  );
};

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
class ItemSheetClassBase extends ItemSheet {
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

export const ItemSheetClass = ReactApplicationMixin(ItemSheetClassBase, render);
