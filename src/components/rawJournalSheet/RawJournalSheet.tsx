import React from "react";

import { runtimeConfig } from "../../runtime";
import { settings } from "../../settings/settings";
import { CSSReset } from "../CSSReset";
import { PageEditor } from "./PageEditor";
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
        flexDirection: "row",
      }}
    >
      <div
        data-testid="page-navigation"
        css={{
          flexBasis: "20em",
          minWidth: "20em",
          position: "relative",
        }}
      >
        <PageNavigation
          journal={journal}
          onNavigate={handlePageClick}
          activePageId={activePageId}
        />
      </div>
      <div
        data-testid="page-editor"
        css={{
          flex: 1,
          overflow: "hidden",
        }}
      >
        {activePageId !== null && journal.pages.has(activePageId) ? (
          <PageEditor page={journal.pages.get(activePageId)} />
        ) : (
          "Select a page to view its content"
        )}
      </div>
    </CSSReset>
  );
};

RawJournalSheet.displayName = "RawJournalSheet";
