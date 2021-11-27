/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useContext, useState } from "react";
import { ThemeContext } from "../../themes/ThemeContext";
import { NoteFormat, NoteWithFormat } from "../../types";
import { AsyncTextArea } from "../inputs/AsyncTextArea";
import { MarkdownEditor } from "../inputs/MarkdownEditor";
import { RichTextEditor } from "../inputs/RichTextEditor";

interface WeaponRowEditNotesProps {
  className?: string;
  note: NoteWithFormat;
  onSave: (newNote: NoteWithFormat) => Promise<void>;
}

export const WeaponRowEditNotes: React.FC<WeaponRowEditNotesProps> = ({
  className,
  note,
  onSave,
}: WeaponRowEditNotesProps) => {
  const [editMode, setEditMode] = useState(false);
  const [liveSource, setLiveSource] = useState(note.source);
  const goEditMode = useCallback(() => {
    setEditMode(true);
  }, []);
  const theme = useContext(ThemeContext);
  const onSaveRichtext = useCallback((html) => {
    onSave({
      source: html,
      html,
      format: note.format,
    });
  }, [note.format, onSave]);
  return (
    <div
      className={className}
      css={{
        gridColumn: "1 / -1",
        padding: "0.5em 0.5em 0.5em 1em",
        maxHeight: "6em",
        overflow: "auto",
        whiteSpace: "normal",
        margin: "0.5em",
        border: `1px solid ${theme.colors.text}`,
        position: "relative",
      }}
    >
      {!editMode &&
        <div
          onClick={goEditMode}
          dangerouslySetInnerHTML={{ __html: note.html }}
        />
      }
      {editMode && (note.format === NoteFormat.plain) &&
        <AsyncTextArea
          onChange={setLiveSource}
          value={liveSource}
        />
      }
      {editMode && (note.format === NoteFormat.markdown) &&
        <MarkdownEditor
          onChange={setLiveSource}
          value={liveSource}
        />
      }
      {editMode && (note.format === NoteFormat.richText) &&
        <RichTextEditor
          onSave={onSaveRichtext}
          initialValue={liveSource}
        />
      }
    </div>
  );
};
