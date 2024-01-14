import React from "react";
import { FaFileImage, FaFileLines } from "react-icons/fa6";

import { Toolbar } from "./Toolbar";
// import { useTheme } from "../../hooks/useTheme";
import { ToolbarButton } from "./ToolbarButton";

interface PageNavigationProps {
  journal: JournalEntry;
  onNavigate: (pageId: string) => void;
}

function addPage(
  journalEntry: JournalEntry,
  type: "text" | "image",
  name: string,
) {
  const sort =
    // @ts-expect-error the journal types are so fucked
    Math.max(...journalEntry.pages.contents.map((p) => p.sort)) +
    CONST.SORT_INTEGER_DENSITY;
  const nameRegex = new RegExp(`^${name}\\s+(\\d+)$`, "i");
  // @ts-expect-error urrrrrgh
  const pages: any[] = journalEntry.pages.contents;
  const pageNumbers = pages
    .map((p) => nameRegex.exec(p.name)?.[1])
    .filter((n) => n && n.length > 0)
    .map(Number);

  const newPageNumber = pageNumbers.length ? Math.max(...pageNumbers) + 1 : 1;

  journalEntry.createEmbeddedDocuments(
    "JournalEntryPage",
    [
      {
        type,
        name: `${name} ${newPageNumber}`,
        sort,
      },
    ],
    { renderSheet: false },
  );
}

export const PageNavigation: React.FC<PageNavigationProps> = ({
  journal,
  onNavigate,
}) => {
  const pages = Array.from(journal.pages.values()).sort((a, b) => {
    return a.sort - b.sort;
  });
  // const theme = useTheme();

  const handlePageClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      const pageId = event.currentTarget.dataset.pageid;
      if (pageId !== undefined) {
        onNavigate(pageId);
      }
    },
    [onNavigate],
  );

  const handleAddNewTextPage = React.useCallback(async () => {
    addPage(journal, "text", "New page");
  }, [journal]);

  const handleAddNewImagePage = React.useCallback(() => {
    addPage(journal, "image", "New image");
  }, [journal]);

  return (
    <div
      css={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        css={{
          padding: "1em",
          // backgroundColor: theme.colors.,
          // color: "white",s
        }}
      >
        {journal.name}
      </div>

      <div
        css={{
          padding: "1em",
          overflowY: "auto",
          flex: 1,
        }}
      >
        {pages.map((page) => {
          return (
            <button
              data-pageid={page.id}
              key={page.id}
              onClick={handlePageClick}
            >
              {page.name}
            </button>
          );
        })}
      </div>
      <Toolbar header="Add new:">
        <ToolbarButton
          onClick={handleAddNewTextPage}
          icon={FaFileLines}
          text="Text"
        />
        <ToolbarButton
          onClick={handleAddNewImagePage}
          icon={FaFileImage}
          text="Image"
        />
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
          icon={FaFileImage}
          text="View"
        />
      </Toolbar>
    </div>
  );
};

PageNavigation.displayName = "PageNavigation";
