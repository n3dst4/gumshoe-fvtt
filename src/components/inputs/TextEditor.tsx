/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ReactNode } from "react";
import { assertGame } from "../../functions";
import { NoteFormat } from "../../types";
import { absoluteCover } from "../absoluteCover";
import { AsyncTextArea } from "./AsyncTextArea";

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
  let editor: ReactNode;
  if (format === NoteFormat.plain) {
    editor = (
      <AsyncTextArea
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
            }}
          >
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
