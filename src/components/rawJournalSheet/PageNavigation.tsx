import React from "react";

interface PageNavigationProps {
  journal: JournalEntry;
  onNavigate: (pageId: string) => void;
}

export const PageNavigation: React.FC<PageNavigationProps> = ({
  journal,
  onNavigate,
}) => {
  const pages = Array.from(journal.pages.values());

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
        padding: "1em",
        overflowY: "auto",
      }}
    >
      {pages.map((page) => {
        return (
          <button data-pageid={page.id} key={page.id} onClick={handlePageClick}>
            {page.name}
          </button>
        );
      })}
    </div>
  );
};

PageNavigation.displayName = "PageNavigation";
