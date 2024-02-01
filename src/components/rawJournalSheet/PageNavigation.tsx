import React from "react";
import { FaBarsStaggered, FaImage } from "react-icons/fa6";

import { useTheme } from "../../hooks/useTheme";
import { MagicToolbarContent } from "./MagicToolbar";
import { Toolbar } from "./Toolbar";
// import { useTheme } from "../../hooks/useTheme";
import { ToolbarButton } from "./ToolbarButton";

interface PageNavigationProps {
  journal: JournalEntry;
  onNavigate: (pageId: string) => void;
  activePageId: string | null;
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
  activePageId,
}) => {
  const theme = useTheme(null);

  const pages = Array.from(journal.pages.values()).sort((a, b) => {
    return a.sort - b.sort;
  });
  // const theme = useTheme();

  const handlePageClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
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
        padding: "0.5em",
        // backgroundColor: theme.colors.backgroundPrimary,
      }}
    >
      <MagicToolbarContent>
        <ToolbarButton
          onClick={handleAddNewTextPage}
          icon={FaBarsStaggered}
          text="Text"
        />
        <ToolbarButton
          onClick={handleAddNewImagePage}
          icon={FaImage}
          text="Image"
        />
      </MagicToolbarContent>
      <div
        css={{
          padding: "1px",
          overflowY: "auto",
          flex: 1,
          backgroundColor: theme.colors.backgroundPrimary,
          border: `1px solid ${theme.colors.accent}`,
          // borderBottom: `1px solid ${theme.colors.accent}`,
        }}
      >
        {pages.map((page) => {
          return (
            <a
              data-pageid={page.id}
              key={page.id}
              onClick={handlePageClick}
              css={{
                textAlign: "left",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "block",
                padding: "0.5em",
                cursor: "pointer",
                textDecoration: "none",
                color: "inherit",
                backgroundColor:
                  page.id === activePageId
                    ? theme.colors.backgroundButton
                    : "transparent",
                border: "1px solid transparent",
                "&:hover": {
                  // backgroundColor: theme.colors.backgroundButton,
                  border: `1px solid ${theme.colors.accent}`,
                },
                // border: `1px solid ${
                //   page.id === activePageId ? theme.colors.accent : "transparent"
                // }`,
              }}
            >
              <span
                css={{
                  display: "inline-block",
                  width: "2em",
                  verticalAlign: "baseline",
                }}
              >
                {page.type === "text" ? <FaBarsStaggered /> : <FaImage />}
              </span>
              {page.name}
            </a>
          );
        })}
      </div>
    </div>
  );
};

PageNavigation.displayName = "PageNavigation";
