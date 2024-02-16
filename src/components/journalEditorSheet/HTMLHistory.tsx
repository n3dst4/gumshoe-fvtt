import { DiffEditor } from "@monaco-editor/react";
import React, { useMemo } from "react";

import { settings } from "../../settings/settings";
import { createDocumentMemory } from "./documentMemory/createDocumentMemory";
import { getAccessibleEdits } from "./documentMemory/getAccessibleEdits";
import { rehydrate } from "./documentMemory/rehydrate";
import { restoreVersion } from "./documentMemory/restoreVersion";

interface HTMLHistoryProps {
  page: any;
  onDone: () => void;
}

export const HTMLHistory: React.FC<HTMLHistoryProps> = ({ page }) => {
  const memory = useMemo(() => {
    const storedBarememory = settings.journalMemories.get()?.[page.id];
    if (storedBarememory) {
      return rehydrate(storedBarememory);
    } else {
      return createDocumentMemory(30);
    }
  }, [page.id]);
  const revisions = useMemo(
    () => getAccessibleEdits(memory).toReversed(),
    [memory],
  );

  const [activeDiffIndex, setActiveDiffIndex] = React.useState<number>(0);

  const [originalState, modifiedState] = useMemo(() => {
    if (revisions.length === 0) {
      return ["", ""];
    }
    const originalState =
      activeDiffIndex === revisions.length - 1
        ? ""
        : restoreVersion(memory, revisions[activeDiffIndex + 1].serial);
    const modifiedState = restoreVersion(
      memory,
      revisions[activeDiffIndex].serial,
    );
    return [originalState, modifiedState];
  }, [activeDiffIndex, memory, revisions]); //

  return (
    <div
      css={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div
        css={{
          width: "15em",
        }}
      >
        <h3>Revisions</h3>
        {revisions.map((edit, i) => (
          <div
            key={edit.serial}
            css={{
              textDecoration: activeDiffIndex === i ? "underline" : "none",
            }}
          >
            <a onClick={() => setActiveDiffIndex(i)}>
              {edit.serial}: {new Date(edit.timestamp * 1000).toLocaleString()}
            </a>
          </div>
        ))}
      </div>
      <div
        css={{
          flex: 1,
        }}
      >
        <DiffEditor
          key={page.id}
          height="100%"
          width="100%"
          // defaultLanguage="html"
          original={originalState}
          modified={modifiedState}
          theme="vs-dark"
          // beforeMount={handleEditorWillMount}
          // onMount={handleEditorDidMount}
          // onChange={handleChange}
          language="html"
          options={{
            automaticLayout: true,
            scrollbar: {
              horizontal: "visible",
            },
            wordWrap: "off",
            rulers: [80],
            unicodeHighlight: {
              ambiguousCharacters: false,
            },
            renderSideBySide: false,
          }}
        />
      </div>
    </div>
  );
};

HTMLHistory.displayName = "HTMLHistory";
