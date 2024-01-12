import MonacoEditor from "@monaco-editor/react";
import React from "react";

interface EditorProps {
  page: any;
}

export const Editor: React.FC<EditorProps> = ({ page }) => {
  // return <div>{page.text.content}</div>;
  return (
    <MonacoEditor
      height="100%"
      width="100%"
      defaultLanguage="html"
      defaultValue={page.text.content}
    />
  );
};

Editor.displayName = "Editor";
