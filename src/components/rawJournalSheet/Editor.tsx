import MonacoEditor, { Monaco, OnMount } from "@monaco-editor/react";
import React, { useCallback, useRef } from "react";

interface EditorProps {
  page: any;
}

type IStandalonCodeEditor = Parameters<OnMount>[0];

export const Editor: React.FC<EditorProps> = ({ page }) => {
  // return <div>{page.text.content}</div>;
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<IStandalonCodeEditor | null>(null);

  function handleEditorWillMount(monaco: Monaco) {
    monaco.languages.html.htmlDefaults.setOptions({
      format: {
        ...monaco.languages.html.htmlDefaults.options.format,
        tabSize: 2,
        insertSpaces: true,
        wrapLineLength: 80,
        wrapAttributes: "auto",
      },
    });
  }

  const handleEditorDidMount: OnMount = useCallback((editor, monaco) => {
    monacoRef.current = monaco;
    editorRef.current = editor;
  }, []);

  const doFormat = useCallback(() => {
    editorRef.current?.getAction("editor.action.formatDocument")?.run();
  }, []);

  const handleFormat = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      await doFormat();
    },
    [doFormat],
  );

  const handleSave = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      await doFormat();
      await page.parent.updateEmbeddedDocuments("JournalEntryPage", [
        {
          _id: page.id,
          text: { content: editorRef.current?.getValue() ?? "" },
        },
      ]);
    },
    [doFormat, page.parent, page.id, editorRef],
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
      }}
    >
      <div
        data-testid="toolbar"
        css={{
          flexBasis: "4em",
        }}
      >
        <button onClick={handleFormat}>Format</button>
        <button onClick={handleSave}>Save</button>
      </div>
      <div
        data-testid="monaco-wrapper"
        css={{
          flex: 1,
        }}
      >
        <MonacoEditor
          key={page.id}
          height="100%"
          width="100%"
          defaultLanguage="html"
          defaultValue={page.text.content}
          theme="vs-dark"
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
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
          }}
        />
      </div>
    </div>
  );
};

Editor.displayName = "Editor";
