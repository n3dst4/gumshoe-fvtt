/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useState } from "react";
import { assertGame } from "../../functions";
import { NoteFormat } from "../../types";
import { Translate } from "../Translate";
import { NotesEditor } from "./NotesEditor";
import * as constants from "../../constants";

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
  const [showSource, setShowSource] = useState(false);
  const isDebugging = (game.modules.get("_dev-mode") as any)?.api?.getPackageDebugValue(constants.systemName);
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
          {
            isDebugging &&
              <button
                css={{
                  width: "auto",
                  marginRight: "1em",
                }}
                onClick={() => setShowSource((e) => !e)}
              >
                <i className="fas fa-envelope-open-text"/>
                View source
              </button>
          }

{
            (!editMode) &&
              <button
                css={{
                  width: "auto",
                  marginRight: "1em",
                }}
                onClick={() => setEditMode(true)}
              >
                <i className="fas fa-edit"/>
                <Translate>Edit</Translate>
              </button>
          }

          {
            (editMode) &&
              <button
                css={{
                  width: "auto",
                  marginRight: "1em",
                }}
                onClick={() => setEditMode(false)}
              >
                <i className="fas fa-save"/>
                <Translate>Save</Translate>
              </button>
          }

          {
            setFormat && editMode && (
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
          showSource={showSource}
        />
      </div>
    </div>
  );
};
