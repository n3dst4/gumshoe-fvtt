/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback, useState } from "react";
import { assertGame, confirmADoodleDo } from "../../functions";
import { NoteFormat, NoteWithFormat } from "../../types";
import { Translate } from "../Translate";
import { NotesEditor } from "./NotesEditor";
import * as constants from "../../constants";
import { convertNotes, toHtml } from "../../textFunctions";

interface TextEditorWithControlsProps {
  source: string;
  html: string;
  format: NoteFormat;
  // setSource: (source: string) => Promise<void>;
  // setFormat?: (format: NoteFormat) => Promise<string>;
  className?: string;
  onSave: (note: NoteWithFormat) => void;
  allowChangeFormat: boolean;
}

export const NotesEditorWithControls: React.FC<TextEditorWithControlsProps> = ({
  source: origSource,
  html: origHtml,
  format: origFormat,
  onSave,
  className,
  allowChangeFormat,
}: TextEditorWithControlsProps) => {
  assertGame(game);
  const [editMode, setEditMode] = useState(false);
  const [showSource, setShowSource] = useState(false);

  const [liveSource, setLiveSource] = useState(origSource);
  const [liveHtml, setLiveHtml] = useState(origHtml);
  const [liveFormat, setLiveFormat] = useState(origFormat);

  const [dirty, setDirty] = useState(false);
  const isDebugging = (game.modules.get("_dev-mode") as any)?.api?.getPackageDebugValue(constants.systemName);

  const onEdit = useCallback((newSource: string) => {
    setLiveSource(newSource);
    setLiveHtml(toHtml(liveFormat, newSource));
    setDirty(true);
  }, [liveFormat]);

  const onClickEdit = useCallback(() => {
    setLiveSource(origSource);
    setEditMode(true);
    setDirty(false);
  }, [origSource]);

  const onClickSave = useCallback(() => {
    onSave({
      format: liveFormat,
      html: liveHtml,
      source: liveSource,
    });
    setEditMode(false);
    setDirty(false);
  }, [liveFormat, liveHtml, liveSource, onSave]);

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
  }, [dirty, origSource]);

  const onChangeFormat = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFormat = e.currentTarget.value as NoteFormat;
    const { newHtml, newSource } = convertNotes(liveFormat, newFormat, liveSource, liveHtml);
    setLiveFormat(newFormat);
    setLiveSource(newSource);
    setLiveHtml(newHtml);
    setDirty(true);
  }, [liveFormat, liveHtml, liveSource]);

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
                onClick={onClickEdit}
              >
                <i className="fas fa-edit"/>
                <Translate>Edit</Translate>
              </button>
          }

          {
            (editMode) &&
              <Fragment>
                <button
                  css={{
                    width: "auto",
                    marginRight: "1em",
                  }}
                  onClick={onClickSave}
                >
                  <i className="fas fa-save"/>
                  <Translate>Save</Translate>
                </button>
                <button
                  css={{
                    width: "auto",
                    marginRight: "1em",
                  }}
                  onClick={onClickCancel}
                >
                  <i className="fas fa-ban"/>
                  <Translate>Cancel</Translate>
                </button>
              </Fragment>
          }

          {
            allowChangeFormat && editMode && (
              <select value={liveFormat} onChange={onChangeFormat}>
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
          source={liveSource}
          html={liveHtml}
          format={liveFormat}
          setSource={onEdit}
          className={className}
          editMode={editMode}
          showSource={showSource}
          onSave={onClickSave}
        />
      </div>
    </div>
  );
};
