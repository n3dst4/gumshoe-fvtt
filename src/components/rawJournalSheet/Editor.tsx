import MonacoEditor, { Monaco, OnMount } from "@monaco-editor/react";
import htmlParser from "prettier/plugins/html";
import prettier from "prettier/standalone";
import React, { useCallback, useRef } from "react";
import { FaFloppyDisk, FaIndent } from "react-icons/fa6";

import { Toolbar } from "./Toolbar";
import { ToolbarButton } from "./ToolbarButton";

interface EditorProps {
  page: any;
}

type IStandalonCodeEditor = Parameters<OnMount>[0];

export const Editor: React.FC<EditorProps> = ({ page }) => {
  // return <div>{page.text.content}</div>;
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<IStandalonCodeEditor | null>(null);

  function handleEditorWillMount(monaco: Monaco) {
    // monaco.languages.html.htmlDefaults.setOptions({
    //   format: {
    //     ...monaco.languages.html.htmlDefaults.options.format,
    //     tabSize: 2,
    //     insertSpaces: true,
    //     wrapLineLength: 80,
    //     wrapAttributes: "auto",
    //   },
    // });
  }

  const handleEditorDidMount: OnMount = useCallback((editor, monaco) => {
    monacoRef.current = monaco;
    editorRef.current = editor;
    // disable built-in html formatting
    monaco.languages.html.htmlDefaults.setModeConfiguration({
      ...monaco.languages.html.htmlDefaults.modeConfiguration,
      documentFormattingEdits: false,
      documentRangeFormattingEdits: false,
    });
    // use prettier to format html
    monaco.languages.registerDocumentFormattingEditProvider("html", {
      async provideDocumentFormattingEdits(model) {
        const text1 = await prettier.format(model.getValue(), {
          // wrapAttributes: "force",
          parser: "html",
          // plugins: [babel],
          htmlWhitespaceSensitivity: "ignore",
          arrowParens: "always",
          bracketSpacing: true,
          endOfLine: "lf",
          insertPragma: false,
          singleAttributePerLine: false,
          bracketSameLine: false,
          printWidth: 80,
          proseWrap: "preserve",
          quoteProps: "as-needed",
          requirePragma: false,
          semi: true,
          singleQuote: true,
          tabWidth: 2,
          // trailingComma: 'es5',
          useTabs: false,
          vueIndentScriptAndStyle: false,
          plugins: [htmlParser],
        });
        console.log(1);
        return [
          {
            range: model.getFullModelRange(),
            text: text1,
          },
        ];
      },
    });

    // editor.
  }, []);

  const doFormat = useCallback(async () => {
    await editorRef.current?.getAction("editor.action.formatDocument")?.run();
  }, []);

  const handleFormat = useCallback(async () => {
    await doFormat();
  }, [doFormat]);

  const handleSave = useCallback(async () => {
    await doFormat();
    try {
      await page.parent.updateEmbeddedDocuments("JournalEntryPage", [
        {
          _id: page.id,
          text: { content: editorRef.current?.getValue() ?? "" },
        },
      ]);
    } catch (error) {
      ui.notifications?.error((error as Error).message);
    }
  }, [doFormat, page.parent, page.id, editorRef]);

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
        <Toolbar>
          <ToolbarButton onClick={handleFormat} text="Format" icon={FaIndent} />
          <ToolbarButton onClick={handleSave} text="Save" icon={FaFloppyDisk} />
        </Toolbar>
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
            language: "html",
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
