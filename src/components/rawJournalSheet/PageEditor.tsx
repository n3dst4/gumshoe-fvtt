import React, { useCallback, useMemo } from "react";
import { FaTrash } from "react-icons/fa6";

import { confirmADoodleDo } from "../../functions/confirmADoodleDo";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { HTMLPage } from "./HTMLPage";
import { ImagePage } from "./ImagePage";
import { useToolbarContent } from "./MagicToolbar";
import { ToolbarButton } from "./ToolbarButton";

interface PageEditorProps {
  page: any;
}

export const PageEditor: React.FC<PageEditorProps> = ({ page }) => {
  const deletePage = useCallback(async () => {
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

  useToolbarContent(
    useMemo(
      () => (
        <ToolbarButton onClick={deletePage} text="Delete Page" icon={FaTrash} />
      ),
      [deletePage],
    ),
    10,
  );

  const handleRename = useCallback(
    async (value: string) => {
      await page.parent.updateEmbeddedDocuments("JournalEntryPage", [
        {
          _id: page.id,
          name: value,
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
        }}
      >
        {page.type === "image" ? (
          <ImagePage page={page} />
        ) : page.type === "text" ? (
          <HTMLPage page={page} />
        ) : (
          <div>Unknown Page Type</div>
        )}
      </div>
    </div>
  );
};

PageEditor.displayName = "PageEditor";
