import React, { useMemo } from "react";
import { FaImage } from "react-icons/fa6";

import { runtimeConfig } from "../../runtime";
import { settings } from "../../settings/settings";
import { absoluteCover } from "../absoluteCover";
import { CSSReset } from "../CSSReset";
import { MagicToolbar, MagicToolbarProvider } from "./MagicToolbar";
import { PageEditor } from "./PageEditor";
import { PageNavigation } from "./PageNavigation";
import { flexRow } from "./styles";
import { ToolbarButton } from "./ToolbarButton";

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

  const toolBarContent = useMemo(
    () => (
      <ToolbarButton
        onClick={() => {
          console.log(journal);
          const SotsSheet: JournalSheet = Journal.registeredSheets.find(
            // @ts-expect-error Journal types are effed
            (sheet) => sheet.name === "SwordsOfTheSerpentineJournalSheet",
          ) as unknown as JournalSheet;
          // @ts-expect-error Journal types are effed
          new SotsSheet(journal).render(true);
        }}
        icon={FaImage}
        text="View"
      />
    ),
    [journal],
  );

  return (
    <CSSReset
      theme={theme}
      mode="large"
      css={{
        ...absoluteCover,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MagicToolbarProvider>
        <div>title</div>
        <MagicToolbar>{toolBarContent}</MagicToolbar>
        <div data-testid="flexrow" css={{ ...flexRow, flex: 1 }}>
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
        </div>
      </MagicToolbarProvider>
    </CSSReset>
  );
};

RawJournalSheet.displayName = "RawJournalSheet";
