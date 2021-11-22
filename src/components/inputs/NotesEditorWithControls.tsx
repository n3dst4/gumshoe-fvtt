/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useState } from "react";
import { assertGame } from "../../functions";
import { NoteFormat } from "../../types";
import { Translate } from "../Translate";
import { NotesEditor } from "./NotesEditor";
interface TextEditorWithControlsProps {
  source: string;
  html: string;
  format: NoteFormat;
  setSource: (source: string) => Promise<void>;
  setFormat?: (format: NoteFormat) => Promise<void>;
  className?: string;
}

export const NotesEditorWithControls: React.FC<TextEditorWithControlsProps> = ({
  source,
  html,
  format,
  setSource,
  setFormat,
  className,
}: TextEditorWithControlsProps) => {
  assertGame(game);
  const [editMode, setEditMode] = useState(false);
  return (
    <div
      css={{
        gridColumn: "label / end",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div css={{ display: "flex", flexDirection: "row" }}>
        <label>
          <Translate>Notes</Translate>
        </label>
        <span css={{ flex: 1 }}/>
        <div>
          <a onClick={() => setEditMode((e) => !e)}>
            <i className="fas fa-edit"/>
          </a>
          {
            (setFormat) && (
              <select value={format} onChange={(e) => setFormat(e.currentTarget.value as NoteFormat)}>
                <option value={NoteFormat.plain}>{game.i18n.localize("investigator.Plain")}</option>
                <option value={NoteFormat.markdown}>{game.i18n.localize("investigator.Markdown")}</option>
                <option value={NoteFormat.richText}>{game.i18n.localize("investigator.Richtext")}</option>
              </select>
            )
          }
        </div>
      </div>
      <div
        css={{
          flex: 1,
          position: "relative",
        }}
      >
        <NotesEditor
          source={source}
          html={html}
          format={format}
          setSource={setSource}
          className={className}
          editMode={editMode}
        />
      </div>
    </div>
  );
};
