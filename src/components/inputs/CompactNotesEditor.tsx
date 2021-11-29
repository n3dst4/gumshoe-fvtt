/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useState } from "react";
import { toHtml } from "../../textFunctions";
import { NoteFormat, NoteWithFormat } from "../../types";
import { AsyncTextArea } from "./AsyncTextArea";
import { MarkdownEditor } from "./MarkdownEditor";
import { RichTextEditor } from "./RichTextEditor";

interface CompactNotesEditorProps {
  className?: string;
  note: NoteWithFormat;
  onChange: (note: NoteWithFormat) => Promise<void>;
}

/**
 * A simple editor designed to work in compact situations. No control to change
 * format. Markdowm/plain are directly editable. Richtext just renders HTML
 * until clicked, then turns into a TinyMCE.
 */
export const CompactNotesEditor: React.FC<CompactNotesEditorProps> = ({
  className,
  note,
  onChange: onSave,
}: CompactNotesEditorProps) => {
  const [liveHtml, setLiveHtml] = useState(note.html);

  const onChange = useCallback(
    async (source: string) => {
      const format = note.format;
      const html = toHtml(note.format, source);
      await onSave({
        format,
        html,
        source,
      });
      setLiveHtml(html);
    },
    [note.format, onSave],
  );

  // we do a little more work to avoid always rendering a TinyMCE for every
  // single item, which probably wouldn't scale very well.

  const [richtextEditMode, setRichtextEditMode] = useState(false);

  const onSaveRichtext = useCallback(
    async (source: string) => {
      await onChange(source);
      setRichtextEditMode(false);
    },
    [onChange],
  );

  const goEditMode = useCallback(() => {
    setRichtextEditMode(true);
  }, []);

  return (
    <div
      className={className}
      css={{
        gridColumn: "1 / -1",
        whiteSpace: "normal",
        margin: "0 0 0.5em 1em",
        position: "relative",
      }}
    >
      {note.format === NoteFormat.plain && (
        <AsyncTextArea onChange={onChange} value={note.source} />
      )}
      {note.format === NoteFormat.markdown && (
        <MarkdownEditor onChange={onChange} value={note.source} />
      )}
      {note.format === NoteFormat.richText &&
        (richtextEditMode
          ? (
            <div
            css={{
              height: "12em",
            }}
            onClick={goEditMode}
          >
            <RichTextEditor
              onSave={onSaveRichtext}
              value={note.source}
            />
          </div>
            )
          : (
          <div
            css={{
              maxHeight: "8em",
              overflow: "auto",
            }}
            onClick={goEditMode}
          >
            <div dangerouslySetInnerHTML={{ __html: liveHtml }} />
          </div>
            ))}
    </div>
  );
};
