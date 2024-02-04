import React, { useCallback, useMemo } from "react";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { BsIndent, BsTrash, BsUnindent } from "react-icons/bs";

import { confirmADoodleDo } from "../../functions/confirmADoodleDo";
import { systemLogger } from "../../functions/utilities";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { HTMLEditor } from "./HTMLEditor";
import { ImageEditor } from "./ImageEditor";
import { useToolbarContent } from "./MagicToolbar";
import { ToolbarButton } from "./ToolbarButton";

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

  useToolbarContent(
    useMemo(
      () => (
        <>
          <ToolbarButton
            onClick={handleDeletePage}
            text="Delete Page"
            icon={BsTrash}
          />
          <ToolbarButton
            onClick={handleMoveUp}
            text="Move  up"
            icon={AiOutlineArrowUp}
          />
          <ToolbarButton
            onClick={handleMoveDown}
            text="Move down"
            icon={AiOutlineArrowDown}
          />
          <ToolbarButton
            onClick={handleDeletePage}
            text="Indent"
            icon={BsIndent}
          />
          <ToolbarButton
            onClick={handleDeletePage}
            text="Outdent"
            icon={BsUnindent}
          />
        </>
      ),
      [handleDeletePage, handleMoveUp],
    ),
    10,
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
          <div>Unknown Page Type</div>
        )}
      </div>
    </div>
  );
};

PageEditor.displayName = "PageEditor";
