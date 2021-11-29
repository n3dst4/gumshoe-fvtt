/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { toHtml } from "../../textFunctions";
import { NoteFormat } from "../../types";
import { AsyncTextArea } from "../inputs/AsyncTextArea";
import { MarkdownEditor } from "../inputs/MarkdownEditor";

interface WeaponRowEditNotesProps {
  className?: string;
  item: InvestigatorItem;
}

export const WeaponRowEditNotes: React.FC<WeaponRowEditNotesProps> = ({
  className,
  item,
}: WeaponRowEditNotesProps) => {
  const note = item.getNotes();
  // const [liveSource, setLiveSource, getLiveSource] = useStateWithGetter(note.source);
  // const [liveHtml, setLiveHtml] = useStateWithGetter(note.html);
  // const [liveFormat, setLiveFormat, getLiveFormat] = useStateWithGetter(note.format);

  // useEffect(() => {
  //   const whenItemUpdates = (
  //     updatedItem: Item,
  //     change: DeepPartial<ItemDataConstructorData | undefined>,
  //     options: DocumentModificationOptions,
  //     userId: string,
  //   ) => {
  //     if (updatedItem.id === item.id) {
  //       setLiveHtml(item.getNotes().html);
  //       if (getEditMode()) {
  //         setLiveSource(item.getNotes().source);
  //       }
  //       setLiveFormat(item.getNotes().format);
  //     }
  //   };
  //   Hooks.on<Hooks.UpdateDocument<typeof Item>>(
  //     "updateItem",
  //     whenItemUpdates,
  //   );
  //   return () => {
  //     Hooks.off("updateItem", whenItemUpdates);
  //   };
  // }, [getEditMode, item, setLiveFormat, setLiveHtml, setLiveSource]);

  const onChange = useCallback((source: string) => {
    const format = item.getNotes().format;
    const html = toHtml(item.getNotes().format, source);
    item.setNotes({
      format,
      html,
      source,
    });
  }, [item]);

  const maxHeight = "8em";

  return (
    <div
      className={className}
      css={{
        gridColumn: "1 / -1",
        // maxHeight,
        whiteSpace: "normal",
        margin: "0 0 0.5em 1em",
        position: "relative",
      }}
    >
      {(note.format === NoteFormat.plain) &&
        <AsyncTextArea
          onChange={onChange}
          value={note.source}
        />
      }
      {(note.format === NoteFormat.markdown) &&
        <MarkdownEditor
          onChange={onChange}
          value={note.source}
        />
      }
      {(note.format === NoteFormat.richText) &&
        <div
          css={{
            maxHeight,
            overflow: "auto",
          }}
          // onClick={goEditMode}
        >
          <div dangerouslySetInnerHTML={{ __html: note.html }}/>
        </div>
      }
      </div>
  );
};
