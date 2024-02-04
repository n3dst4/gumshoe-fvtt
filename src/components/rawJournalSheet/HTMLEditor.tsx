import MonacoEditor, { Monaco, OnMount } from "@monaco-editor/react";
import htmlParser from "prettier/plugins/html";
import prettier from "prettier/standalone";
import React, { useCallback, useMemo, useRef } from "react";
import { FaIndent } from "react-icons/fa6";

import { throttle } from "../../functions/utilities";
import { useToolbarContent } from "./MagicToolbar";
import { ToolbarButton } from "./ToolbarButton";

interface HTMLEditorProps {
  page: any;
}
type IStandalonCodeEditor = Parameters<OnMount>[0];

export const HTMLEditor: React.FC<HTMLEditorProps> = ({ page }) => {
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<IStandalonCodeEditor | null>(null);

  function handleEditorWillMount(monaco: Monaco) {}

  const doFormat = useCallback(async () => {
    await editorRef.current?.getAction("editor.action.formatDocument")?.run();
  }, []);

  const doSave = useCallback(async () => {
    await page.parent.updateEmbeddedDocuments("JournalEntryPage", [
      {
        _id: page.id,
        text: { content: editorRef.current?.getValue() ?? "" },
      },
    ]);
  }, [page.parent, page.id, editorRef]);

  const handleChange = useMemo(() => throttle(doSave, 500), [doSave]);

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

  const handleFormat = useCallback(async () => {
    await doFormat();
  }, [doFormat]);

  useToolbarContent(
    useMemo(
      () => (
        <ToolbarButton onClick={handleFormat} text="Format" icon={FaIndent} />
      ),
      [handleFormat],
    ),
    10,
  );

  return (
    <div
      data-testid="html-editor"
      css={{
        position: "relative",
        width: "100%",
        height: "100%",
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
  );
};

HTMLEditor.displayName = "MonacoWrapper";
