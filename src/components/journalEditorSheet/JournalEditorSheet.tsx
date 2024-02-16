import React, { useEffect, useMemo } from "react";
import { MdOutlinePreview } from "react-icons/md";

import { extraCssClasses, systemId } from "../../constants";
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

type JournalEditorSheetProps = {
  journalEntry: JournalEntry;
  foundryApplication: JournalSheet;
};

export const JournalEditorSheet = ({
  journalEntry: journal,
  foundryApplication,
}: JournalEditorSheetProps) => {
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

  const handlePreview = React.useCallback(() => {
    const JournalSheet: JournalSheet = Journal.registeredSheets.find(
      // @ts-expect-error Journal types are effed
      (sheet) => sheet.name === "InvestigatorJournalSheet",
    ) as unknown as JournalSheet;
    // @ts-expect-error Journal types are effed
    new JournalSheet(journal).render(true);
  }, [journal]);

  const toolBarContent = useMemo(
    () => (
      <ToolbarButton
        onClick={handlePreview}
        icon={MdOutlinePreview}
        text="Preview"
      />
    ),
    [handlePreview],
  );

  const handleTitleChange = React.useCallback(
    (name: string) => {
      journal.update({ name });
    },
    [journal],
  );

  // @ts-expect-error - foundry types are bad
  const globalClasses = journal.flags[systemId]?.[extraCssClasses] ?? "";

  const handleGlobalClassesChange = React.useCallback(
    (classes: string) => {
      journal.setFlag(systemId, extraCssClasses, classes);
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
          categories={["Core", "Create new", "Page", "HTML"]}
          childrenCategory="Core"
        >
          {toolBarContent}
        </MagicToolbar>
        <div
          css={{
            display: "flex",
            flexDirection: "row",
            gap: "0.5em",
          }}
        >
          <AsyncTextInput
            value={journal.name ?? ""}
            onChange={handleTitleChange}
          />
          <AsyncTextInput
            placeholder="Journal CSS Classes"
            value={globalClasses}
            onChange={handleGlobalClassesChange}
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

JournalEditorSheet.displayName = "JournalEditorSheet";
