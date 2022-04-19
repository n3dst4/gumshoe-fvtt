/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback, useState } from "react";
import { assertGame, confirmADoodleDo, getDevMode, getTranslated } from "../../functions";
import { NoteFormat, NoteWithFormat } from "../../types";
import { Translate } from "../Translate";
import { NotesEditor } from "./NotesEditor";
import { convertNotes, toHtml } from "../../textFunctions";
import { useStateWithGetter } from "../../hooks/useStateWithGetter";

interface TextEditorWithControlsProps {
  source: string;
  html: string;
  format: NoteFormat;
  className?: string;
  onSave: (note: NoteWithFormat, index?: number) => void;
  allowChangeFormat: boolean;
  index?: number;
  title?: string;
}

export const NotesEditorWithControls: React.FC<TextEditorWithControlsProps> = ({
  source: origSource,
  html: origHtml,
  format: origFormat,
  onSave,
  className,
  allowChangeFormat,
  index,
  title,
}: TextEditorWithControlsProps) => {
  assertGame(game);
  const [editMode, setEditMode] = useState(false);
  const [showSource, setShowSource] = useState(false);

  const [getLiveSource, setLiveSource, liveSource] = useStateWithGetter(origSource);
  const [getLiveHtml, setLiveHtml, liveHtml] = useStateWithGetter(origHtml);
  const [getLiveFormat, setLiveFormat, liveFormat] = useStateWithGetter(origFormat);

  const [dirty, setDirty] = useState(false);
  const isDebugging = getDevMode();

  const onEdit = useCallback((newSource: string) => {
    setLiveSource(newSource);
    setLiveHtml(toHtml(liveFormat, newSource));
    setDirty(true);
  }, [liveFormat, setLiveHtml, setLiveSource]);

  const onClickEdit = useCallback(() => {
    setLiveSource(origSource);
    setEditMode(true);
    setDirty(false);
  }, [origSource, setLiveSource]);

  const onClickSave = useCallback(() => {
    onSave({
      format: getLiveFormat(),
      html: getLiveHtml(),
      source: getLiveSource(),
    }, index);
    setEditMode(false);
    setDirty(false);
  }, [getLiveFormat, getLiveHtml, getLiveSource, index, onSave]);

  const onClickCancel = useCallback(async () => {
    if (dirty) {
      await confirmADoodleDo({
        message: "Lose unsaved changes?",
        confirmText: "Confirm",
        cancelText: "Whoops, no!",
        confirmIconClass: "fa-ban",
      });
    }
    setLiveSource(origSource);
    setEditMode(false);
    setDirty(false);
  }, [dirty, origSource, setLiveSource]);

  const onChangeFormat = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFormat = e.currentTarget.value as NoteFormat;
    const { newHtml, newSource } = convertNotes(liveFormat, newFormat, liveSource);
    setLiveFormat(newFormat);
    setLiveSource(newSource);
    setLiveHtml(newHtml);
    setDirty(true);
  }, [liveFormat, liveSource, setLiveFormat, setLiveHtml, setLiveSource]);

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
        <h1
          css={{
            "&&": {
              marginTop: 0,
            },
            flex: 1,
          }}
        >
          {title === undefined
            ? <Translate>Notes</Translate>
            : title
          }
        </h1>
        <div>
          {
            isDebugging &&
              <button
                css={{
                  width: "auto",
                  marginRight: "0.5em",
                }}
                onClick={() => setShowSource((e) => !e)}
              >
                <i className={showSource ? "fas fa-window-close" : "fas fa-code"}/>
              </button>
          }

          {
            (!editMode && !showSource) &&
              <button
                css={{
                  width: "auto",
                  marginRight: "0.5em",
                }}
                onClick={onClickEdit}
              >
                <i className="fas fa-edit"/>
                <Translate>Edit</Translate>
              </button>
          }

          {
            (editMode && !showSource) &&
              <Fragment>
                <button
                  css={{
                    width: "auto",
                    marginRight: "0.5em",
                  }}
                  onClick={onClickSave}
                >
                  <i className="fas fa-download"/>
                  <Translate>Save</Translate>
                </button>
                <button
                  css={{
                    width: "auto",
                    marginRight: "0.5em",
                  }}
                  onClick={onClickCancel}
                >
                  <i className="fas fa-ban"/>
                  <Translate>Cancel</Translate>
                </button>
              </Fragment>
          }

          {
            allowChangeFormat && editMode && !showSource && (
              <select value={liveFormat} onChange={onChangeFormat}>
                <option value={NoteFormat.plain}>{getTranslated("Plain")}</option>
                <option value={NoteFormat.markdown}>{getTranslated("Markdown")}</option>
                <option value={NoteFormat.richText}>{getTranslated("RichText")}</option>
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
          source={liveSource}
          html={liveHtml}
          format={liveFormat}
          className={className}
          editMode={editMode}
          showSource={showSource}
          setSource={onEdit}
          onSave={onClickSave}
        />
      </div>
    </div>
  );
};
