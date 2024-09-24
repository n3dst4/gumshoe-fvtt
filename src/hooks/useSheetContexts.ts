import { FoundryAppContext } from "@lumphammer/shared-fvtt-bits/src/FoundryAppContext";
import { useContext } from "react";

import { ItemSheetClass } from "../module/InvestigatorItemSheetClass";

export const useItemSheetContext = () => {
  const app = useContext(FoundryAppContext);
  if (app === null) {
    throw new Error(
      "useItemSheetContext must be used within a FoundryAppContext",
    );
  }
  if (!(app instanceof ItemSheetClass)) {
    throw new Error("useItemSheetContext must be used within an ItemSheet");
  }
  const item = app.document;

  return { app, item };
};

export const useActorSheetContext = () => {
  const app = useContext(FoundryAppContext);
  if (app === null) {
    throw new Error(
      "useActorSheetContext must be used within a FoundryAppContext",
    );
  }
  if (!(app instanceof ActorSheet)) {
    throw new Error("useActorSheetContext must be used within an ActorSheet");
  }
  const actor = app.document;

  return { app, actor };
};

export const useJournalSheetContext = () => {
  const app = useContext(FoundryAppContext);
  if (app === null) {
    throw new Error(
      "useJournalSheetContext must be used within a FoundryAppContext",
    );
  }
  if (!(app instanceof JournalSheet)) {
    throw new Error(
      "useJournalSheetContext must be used within a JournalSheet",
    );
  }
  const journalEntry = app.document as JournalEntry;

  return { app, journalEntry };
};

export const useDocumentSheetContext = () => {
  const app = useContext(FoundryAppContext);
  if (app === null) {
    throw new Error(
      "useDocumentSheetContext must be used within a FoundryAppContext",
    );
  }
  if (!(app instanceof ActorSheet || app instanceof ItemSheetClass)) {
    throw new Error(
      "useDocumentSheetContext must be used within an ActorSheet or ItemSheet",
    );
  }
  const doc = app.document;

  return { app, doc };
};
