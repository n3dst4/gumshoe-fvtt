/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ReactNode, useContext, useState } from "react";
import { assertGame } from "../../functions";
import { ThemeContext } from "../../themes/ThemeContext";
import { NoteFormat } from "../../types";
import { absoluteCover } from "../absoluteCover";
import { AsyncTextArea } from "./AsyncTextArea";
import { MarkdownEditor } from "./MarkdownEditor";

interface TextEditorProps {
  source: string;
  html: string;
  format: NoteFormat;
  setSource: (source: string) => Promise<void>;
  setFormat?: (format: NoteFormat) => Promise<void>;
  className?: string;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  source,
  html,
  format,
  setSource,
  setFormat,
  className,
}: TextEditorProps) => {
  assertGame(game);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editMode, setEditMode] = useState(false);
  const theme = useContext(ThemeContext);
  let editor: ReactNode;
  if (!editMode) {
    editor = <div
      css={{
        ...absoluteCover,
        overflow: "auto",
        background: theme.colors.backgroundPrimary,
        padding: "0.5em",
        border: `1px solid ${theme.colors.text}`,
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />;
  } else if (format === NoteFormat.plain) {
    editor = (
      <AsyncTextArea
        key="plain"
        className={className}
        onChange={setSource}
        value={source}
      />
    );
  } else if (format === NoteFormat.markdown) {
    editor = (
      <MarkdownEditor
        key="markdown"
        className={className}
        onChange={setSource}
        value={source}
      />
    );
  }
  return (
    <div
      css={{
        ...absoluteCover,
      }}
    >
      {
        setFormat &&
          <div
            css={{
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 1,
            }}
          >
            <a onClick={() => setEditMode((e) => !e)}>
              <i className="fas fa-edit"/>
            </a>
            <select value={format} onChange={(e) => setFormat(e.currentTarget.value as NoteFormat)}>
              <option value={NoteFormat.plain}>{game.i18n.localize("investigator.Plain")}</option>
              <option value={NoteFormat.markdown}>{game.i18n.localize("investigator.Markdown")}</option>
              <option value={NoteFormat.richText}>{game.i18n.localize("investigator.Richtext")}</option>
            </select>
          </div>
      }
      {editor}
    </div>
  );
};
