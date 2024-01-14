import React from "react";
import { FaFileImage, FaFileLines } from "react-icons/fa6";

import { Toolbar } from "./Toolbar";
// import { useTheme } from "../../hooks/useTheme";
import { ToolbarButton } from "./ToolbarButton";

interface PageNavigationProps {
  journal: JournalEntry;
  onNavigate: (pageId: string) => void;
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
    console.log(journal);
    const sort =
      // @ts-expect-error the journal types are so fucked
      Math.max(...journal.pages.contents.map((p) => p.sort)) +
      CONST.SORT_INTEGER_DENSITY;

    await journal.createEmbeddedDocuments(
      "JournalEntryPage",
      [
        {
          type: "base",
          name: "New page",
          sort,
        },
      ],
      {
        renderSheet: false,
      },
    );
  }, [journal]);
  const handleAddNewImagePage = React.useCallback(() => {
    console.log(journal);
    // debugger;
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
