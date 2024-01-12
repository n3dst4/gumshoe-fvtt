import React from "react";

import { runtimeConfig } from "../../runtime";
import { settings } from "../../settings/settings";
import { CSSReset } from "../CSSReset";
import { Editor } from "./Editor";
import { PageNavigation } from "./PageNavigation";

type RawJournalSheetProps = {
  journal: JournalEntry;
  foundryApplication: JournalSheet;
};

export const RawJournalSheet = ({
  journal,
  foundryApplication,
}: RawJournalSheetProps) => {
  // assertNPCActor(actor);
  const theme =
    runtimeConfig.themes[settings.defaultThemeName.get()] ||
    runtimeConfig.themes.tealTheme;

  const [activePageId, setActivePageId] = React.useState<string | null>(null);
  const handlePageClick = React.useCallback(
    (pageId: string) => {
      setActivePageId(pageId);
    },
    [setActivePageId],
  );

  return (
    <CSSReset
      theme={theme}
      mode="large"
      css={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: "flex",
        // alignItems: "stretch",
        // alignContent: "flex-start",
        // flexWrap: "wrap",
        // flexDirection: "row",
        // justifyContent: "flex-start",
      }}
    >
      <div
        css={{
          width: "20em",
          position: "relative",
        }}
      >
        <PageNavigation journal={journal} onNavigate={handlePageClick} />
      </div>
      <div
        css={{
          flex: 1,
        }}
      >
        {activePageId !== null && journal.pages.has(activePageId) ? (
          <Editor page={journal.pages.get(activePageId)} />
        ) : (
          "Select a page to view its content"
        )}
      </div>
    </CSSReset>
  );
};

RawJournalSheet.displayName = "RawJournalSheet";
