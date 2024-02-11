import React from "react";

import { Suspense } from "../components/Suspense";
import { reactTemplatePath } from "../constants";
import { ReactApplicationMixin } from "./ReactApplicationMixin";

const JournalEditorSheet = React.lazy(() =>
  import("../components/journalEditorSheet/JournalEditorSheet").then(
    ({ JournalEditorSheet }) => ({
      default: JournalEditorSheet,
    }),
  ),
);

export class JournalEditorSheetClassBase extends JournalSheet {
  /** @override */
  static get defaultOptions() {
    const options = {
      ...super.defaultOptions,
      template: reactTemplatePath,
      resizable: true,
      width: 1230,
    };
    return options;
  }
}

const render = (sheet: JournalEditorSheetClassBase) => {
  return (
    <Suspense>
      <JournalEditorSheet
        journalEntry={sheet.document}
        foundryApplication={sheet}
      />
    </Suspense>
  );
};

export const JournalEditorSheetClass = ReactApplicationMixin(
  "JournalEditorSheetClass",
  JournalEditorSheetClassBase,
  render,
);
