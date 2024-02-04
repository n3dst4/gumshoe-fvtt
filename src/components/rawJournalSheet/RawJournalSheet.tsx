import React, { useEffect, useMemo } from "react";
import { MdOutlinePreview } from "react-icons/md";

import { useTheme } from "../../hooks/useTheme";
import { absoluteCover } from "../absoluteCover";
import { CSSReset } from "../CSSReset";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { MagicToolbar } from "./magicToolbar/MagicToolbar";
import { MagicToolbarProvider } from "./magicToolbar/MagicToolbarProvider";
import { ToolbarButton } from "./magicToolbar/ToolbarButton";
import { NoPageSelected } from "./NoPageSelected";
import { PageEditor } from "./PageEditor";
import { PageNavigation } from "./PageNavigation";
import { flexRow } from "./styles";

const KEEPALIVE_INTERVAL_MS = 30_000;

type RawJournalSheetProps = {
  journalEntry: JournalEntry;
  foundryApplication: JournalSheet;
};

export const RawJournalSheet = ({
  journalEntry: journal,
  foundryApplication,
}: RawJournalSheetProps) => {
  // assertNPCActor(actor);

  // keepalive - without this, if this journal entry is inside a compendium,
  // foundry will kill the in-memory references to it so normal UI updates stop
  // coming through. An empty update doesn't send any network traffic but it's
  // enough to keep the journal entry alive. The timeout in foundry is 5 minutes
  // so a 30 second keepalive is plenty.
  useEffect(() => {
    const interval = setInterval(() => {
      journal.update({});
    }, KEEPALIVE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [journal]);

  const theme = useTheme();

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
        icon={MdOutlinePreview}
        text="Preview"
      />
    ),
    [journal],
  );

  const handleTitleChange = React.useCallback(
    (name: string) => {
      journal.update({ name });
    },
    [journal],
  );

  return (
    <MagicToolbarProvider>
      <CSSReset
        theme={theme}
        mode="large"
        css={{
          ...absoluteCover,
          display: "flex",
          gap: "0.5em",
          flexDirection: "column",
        }}
      >
        <MagicToolbar
          categories={[
            "Core",
            "Create page",
            "Move Page",
            "Delete Page",
            "HTML",
          ]}
          childrenCategory="Core"
        >
          {toolBarContent}
        </MagicToolbar>
        <div>
          <AsyncTextInput
            value={journal.name ?? ""}
            onChange={handleTitleChange}
          />
        </div>
        <div css={{ ...flexRow, gap: "0.5em", flex: 1 }}>
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
              position: "relative",
            }}
          >
            {activePageId !== null && journal.pages.has(activePageId) ? (
              <PageEditor page={journal.pages.get(activePageId)} />
            ) : (
              <NoPageSelected />
            )}
          </div>
        </div>
      </CSSReset>
    </MagicToolbarProvider>
  );
};

RawJournalSheet.displayName = "RawJournalSheet";
