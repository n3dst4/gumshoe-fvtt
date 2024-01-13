import MonacoEditor, { Monaco, OnMount } from "@monaco-editor/react";
import React, { useRef } from "react";

interface EditorProps {
  page: any;
}

type IStandalonCodeEditor = Parameters<OnMount>[0];

export const Editor: React.FC<EditorProps> = ({ page }) => {
  // return <div>{page.text.content}</div>;
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<IStandalonCodeEditor | null>(null);

  function handleEditorWillMount(monaco: Monaco) {
    // here is the monaco instance
    // do something before editor is mounted
    // monaco.languages.html
  }

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // here is another way to get monaco instance
    // you can also store it in `useRef` for further usage
    monacoRef.current = monaco;
    editorRef.current = editor;
  };

  const doFormat = () => {
    editorRef.current?.getAction("editor.action.formatDocument")?.run();
  };

  const handleFormat = async (e: React.MouseEvent) => {
    e.preventDefault();
    await doFormat();
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    await doFormat();
    // page.text.content = editorRef.current?.getValue() ?? "";
    await page.parent.updateEmbeddedDocuments("JournalEntryPage", [
      {
        _id: page.id,
        text: { content: editorRef.current?.getValue() ?? "" },
      },
    ]);
  };

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
          }}
        />
      </div>
    </div>
  );
};

Editor.displayName = "Editor";
