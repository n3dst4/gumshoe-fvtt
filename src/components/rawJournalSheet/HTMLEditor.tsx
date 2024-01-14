import MonacoEditor, { Monaco, OnMount } from "@monaco-editor/react";
import htmlParser from "prettier/plugins/html";
import prettier from "prettier/standalone";
import React, { useCallback, useMemo, useRef } from "react";
import { FaIndent } from "react-icons/fa6";

import { throttle } from "../../functions/utilities";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { Toolbar } from "./Toolbar";
import { ToolbarButton } from "./ToolbarButton";

interface HTMLEditorProps {
  page: any;
}

type IStandalonCodeEditor = Parameters<OnMount>[0];

export const HTMLEditor: React.FC<HTMLEditorProps> = ({ page }) => {
  // return <div>{page.text.content}</div>;
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<IStandalonCodeEditor | null>(null);

  function handleEditorWillMount(monaco: Monaco) {}

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

  const doSave = useCallback(async () => {
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
  }, [page.parent, page.id, editorRef]);

  const handleChange = useMemo(() => throttle(doSave, 500), [doSave]);

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
      <div
        data-testid="toolbar"
        css={
          {
            // flexBasis: "4em",
          }
        }
      >
        <AsyncTextInput
          value={page.name}
          onChange={async (value) => {
            await page.parent.updateEmbeddedDocuments("JournalEntryPage", [
              {
                _id: page.id,
                name: value,
              },
            ]);
          }}
        />
      </div>
      <div
        data-testid="toolbar"
        css={{
          flexBasis: "4em",
        }}
      >
        <Toolbar>
          <ToolbarButton onClick={handleFormat} text="Format" icon={FaIndent} />
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
          onChange={handleChange}
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

HTMLEditor.displayName = "Editor";
