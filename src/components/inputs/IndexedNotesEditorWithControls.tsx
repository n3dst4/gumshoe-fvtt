import React, { useCallback } from "react";

import { NoteWithFormat } from "../../types";
import {
  NotesEditorWithControls,
  NotesEditorWithControlsProps,
} from "./NotesEditorWithControls";

type IndexedNotesEditorWithControlsProps = Omit<
  NotesEditorWithControlsProps,
  "onSave"
> & {
  index: number;
  onSave: (note: NoteWithFormat, index: number) => void;
};

export const IndexedNotesEditorWithControls: React.FC<
  IndexedNotesEditorWithControlsProps
> = ({ index, onSave, ...rest }) => {
  const handleSave = useCallback(
    (note: NoteWithFormat) => {
      onSave(note, index);
    },
    [index, onSave],
  );
  return <NotesEditorWithControls onSave={handleSave} {...rest} />;
};

IndexedNotesEditorWithControls.displayName = "IndexedNotesEditorWithControls";
