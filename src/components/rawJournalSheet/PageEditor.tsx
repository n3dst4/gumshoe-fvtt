import React, { useCallback, useMemo } from "react";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { BsIndent, BsTrash, BsUnindent } from "react-icons/bs";

import { confirmADoodleDo } from "../../functions/confirmADoodleDo";
import { systemLogger } from "../../functions/utilities";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { HTMLEditor } from "./HTMLEditor";
import { ImageEditor } from "./ImageEditor";
import { ToolbarButton, useToolbarContent } from "./magicToolbar";
import { UnknownPageTypeEditor } from "./UnknownPageTypeEditor";

interface PageEditorProps {
  page: any;
}

export const PageEditor: React.FC<PageEditorProps> = ({ page }) => {
  const handleDeletePage = useCallback(async () => {
    const doDelete = await confirmADoodleDo({
      message: "Delete page {PageName}?",
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmIconClass: "fa fa-trash",
      values: {
        PageName: page.name,
      },
      resolveFalseOnCancel: true,
    });
    if (doDelete) {
      await page.parent.deleteEmbeddedDocuments("JournalEntryPage", [page.id]);
    }
  }, [page.id, page.name, page.parent]);

  const handleMoveUp = useCallback(async () => {
    const pages = page.parent.pages.contents.sort((a: any, b: any) => {
      return a.sort - b.sort;
    });
    const thisIndex = pages.findIndex((p: any) => p._id === page._id);
    if (thisIndex < 1) {
      return;
    }
    const prevPage = pages[thisIndex - 1];
    const updates = [
      {
        _id: page.id,
        sort: prevPage.sort,
      },
      {
        _id: prevPage.id,
        sort: page.sort,
      },
    ];
    systemLogger.log("move up", updates);
    await page.parent.updateEmbeddedDocuments("JournalEntryPage", updates);
  }, [page]);

  const handleMoveDown = useCallback(async () => {
    const pages = page.parent.pages.contents.sort((a: any, b: any) => {
      return a.sort - b.sort;
    });
    const thisIndex = pages.findIndex((p: any) => p._id === page._id);
    if (thisIndex >= pages.length - 1) {
      return;
    }
    const nextPage = pages[thisIndex + 1];
    const updates = [
      {
        _id: page.id,
        sort: nextPage.sort,
      },
      {
        _id: nextPage.id,
        sort: page.sort,
      },
    ];
    systemLogger.log("move up", updates);
    await page.parent.updateEmbeddedDocuments("JournalEntryPage", updates);
  }, [page]);

  const handleIndent = useCallback(async () => {
    if (page.title.level >= 10) {
      return;
    }
    await page.parent.updateEmbeddedDocuments("JournalEntryPage", [
      {
        _id: page.id,
        title: {
          ...page.title,
          level: page.title.level + 1,
        },
      },
    ]);
  }, [page.id, page.parent, page.title]);

  const handleOutdent = useCallback(async () => {
    if (page.title.level <= 1) {
      return;
    }
    page.parent.updateEmbeddedDocuments("JournalEntryPage", [
      {
        _id: page.id,
        title: {
          ...page.title,
          level: page.title.level - 1,
        },
      },
    ]);
  }, [page.id, page.parent, page.title]);

  useToolbarContent(
    "Move page",
    useMemo(
      () => (
        <>
          <ToolbarButton
            onClick={handleMoveUp}
            text="Up"
            icon={AiOutlineArrowUp}
          />
          <ToolbarButton
            onClick={handleMoveDown}
            text="Down"
            icon={AiOutlineArrowDown}
          />
          <ToolbarButton onClick={handleIndent} text="Indent" icon={BsIndent} />
          <ToolbarButton
            onClick={handleOutdent}
            text="Outdent"
            icon={BsUnindent}
          />
        </>
      ),
      [handleIndent, handleMoveDown, handleMoveUp, handleOutdent],
    ),
  );

  useToolbarContent(
    "Delete",
    useMemo(
      () => (
        <>
          <ToolbarButton
            onClick={handleDeletePage}
            text="Delete Page"
            icon={BsTrash}
          />
        </>
      ),
      [handleDeletePage],
    ),
  );

  const handleRename = useCallback(
    async (name: string) => {
      await page.parent.updateEmbeddedDocuments("JournalEntryPage", [
        {
          _id: page.id,
          name,
        },
      ]);
    },
    [page.id, page.parent],
  );

  return (
    <div
      data-testid="editor"
      css={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "0.5em",
      }}
    >
      <div data-testid="name">
        <AsyncTextInput value={page.name} onChange={handleRename} />
      </div>
      <div
        data-testid="main-area"
        css={{
          flex: 1,
          position: "relative",
        }}
      >
        {page.type === "image" ? (
          <ImageEditor page={page} />
        ) : page.type === "text" ? (
          <HTMLEditor page={page} />
        ) : (
          <UnknownPageTypeEditor page={page} />
        )}
      </div>
    </div>
  );
};

PageEditor.displayName = "PageEditor";
