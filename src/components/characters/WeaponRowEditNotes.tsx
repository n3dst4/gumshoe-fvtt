/** @jsx jsx */
import { jsx } from "@emotion/react";
import { DocumentModificationOptions } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs";
import { ItemDataConstructorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { ThemeContext } from "../../themes/ThemeContext";
import { NoteFormat } from "../../types";
import { AsyncTextArea } from "../inputs/AsyncTextArea";
import { MarkdownEditor } from "../inputs/MarkdownEditor";
import { RichTextEditor } from "../inputs/RichTextEditor";

interface WeaponRowEditNotesProps {
  className?: string;
  item: InvestigatorItem;
}

function useStateWithGetter<T> (initial: T) {
  const [value, setValue] = useState(initial);
  const ref = useRef(initial);
  useEffect(function () {
    ref.current = value;
  }, [value]);
  const getValue = useCallback(function () {
    return ref.current;
  }, []);
  return [value, setValue, getValue] as const; // as const makes it a tuple
}

export const WeaponRowEditNotes: React.FC<WeaponRowEditNotesProps> = ({
  className,
  item,
}: WeaponRowEditNotesProps) => {
  const note = item.getNotes();
  const [editMode, setEditMode, getEditMode] = useStateWithGetter(false);
  const [liveSource, setLiveSource] = useStateWithGetter(note.source);
  const [liveHtml, setLiveHtml] = useState(note.html);
  const [liveFormat, setLiveFormat] = useState(note.format);

  useEffect(() => {
    const whenItemUpdates = (
      updatedItem: Item,
      change: DeepPartial<ItemDataConstructorData | undefined>,
      options: DocumentModificationOptions,
      userId: string,
    ) => {
      if (updatedItem.id === item.id) {
        setLiveHtml(item.getNotes().html);
        if (getEditMode()) {
          setLiveSource(item.getNotes().source);
        }
        setLiveFormat(item.getNotes().format);
      }
    };
    Hooks.on<Hooks.UpdateDocument<typeof Item>>(
      "updateItem",
      whenItemUpdates,
    );
    return () => {
      Hooks.off("updateItem", whenItemUpdates);
    };
  }, [getEditMode, item, setLiveSource]);

  const goEditMode = useCallback(() => {
    setEditMode(true);
  }, [setEditMode]);

  const theme = useContext(ThemeContext);
  const onSaveRichtext = useCallback((html) => {
    item.setNotes({
      source: html,
      html,
      format: liveFormat,
    }).then(() => {
      setEditMode(false);
    });
  }, [item, liveFormat, setEditMode]);
  const maxHeight = editMode
    ? (note.format === NoteFormat.richText
        ? "unset"
        : "8em")
    : "6em";

  return (
    <div
      className={className}
      css={{
        gridColumn: "1 / -1",
        padding: "0.5em 0.5em 0.5em 1em",
        maxHeight,
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
          dangerouslySetInnerHTML={{ __html: liveHtml }}
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
        <div
          css={{
            height: "12em",
          }}
        >
          <RichTextEditor
            onSave={onSaveRichtext}
            initialValue={liveSource}
          />
        </div>
      }
    </div>
  );
};
