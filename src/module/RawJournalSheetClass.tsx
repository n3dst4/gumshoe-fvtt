import React from "react";

import { Suspense } from "../components/Suspense";
import { reactTemplatePath } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";

const RawJournalSheet = React.lazy(() =>
  import("../components/rawJournalSheet/RawJournalSheet").then(
    ({ RawJournalSheet }) => ({
      default: RawJournalSheet,
    }),
  ),
);

export class RawJournalSheetClassBase extends JournalSheet {
  /** @override */
  static get defaultOptions() {
    const options = {
      ...super.defaultOptions,
      template: reactTemplatePath,
      resizable: true,
    };
    return options;
  }
}

const render = (sheet: RawJournalSheetClassBase) => {
  return (
    <Suspense>
      <RawJournalSheet journal={sheet.document} foundryApplication={sheet} />
    </Suspense>
  );
};

export const RawJournalSheetClass = ReactApplicationMixin(
  "RawJournalSheetClass",
  RawJournalSheetClassBase,
  render,
);
