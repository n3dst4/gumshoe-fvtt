import React from "react";

// import X from "react-icons/fa6/faFile";
// import { useTheme } from "../../hooks/useTheme";

interface PageNavigationProps {
  journal: JournalEntry;
  onNavigate: (pageId: string) => void;
}

export const PageNavigation: React.FC<PageNavigationProps> = ({
  journal,
  onNavigate,
}) => {
  const pages = Array.from(journal.pages.values());
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
      <div>
        <button
          css={{
            padding: "1em",
            display: "inline",
            width: "4em",
          }}
          onClick={handlePageClick}
        ></button>
      </div>
    </div>
  );
};

PageNavigation.displayName = "PageNavigation";
