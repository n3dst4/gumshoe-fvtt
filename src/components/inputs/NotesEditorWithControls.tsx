/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback, useState } from "react";
import { assertGame, confirmADoodleDo } from "../../functions";
import { NoteFormat } from "../../types";
import { Translate } from "../Translate";
import { NotesEditor } from "./NotesEditor";
import * as constants from "../../constants";

interface TextEditorWithControlsProps {
  source: string;
  html: string;
  format: NoteFormat;
  setSource: (source: string) => Promise<void>;
  setFormat?: (format: NoteFormat) => Promise<string>;
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
  const [liveSource, setLiveSource] = useState(source);
  const [dirty, setDirty] = useState(false);
  const isDebugging = (game.modules.get("_dev-mode") as any)?.api?.getPackageDebugValue(constants.systemName);

  const onEdit = useCallback((newSource: string) => {
    setLiveSource(newSource);
    setDirty(true);
  }, []);

  const onClickEdit = useCallback(() => {
    setLiveSource(source);
    setEditMode(true);
    setDirty(false);
  }, [source]);

  const onClickSave = useCallback(() => {
    setSource(liveSource);
    setEditMode(false);
    setDirty(false);
  }, [liveSource, setSource]);

  const onClickCancel = useCallback(async () => {
    if (dirty) {
      await confirmADoodleDo({
        message: "Lose unsaved changes?",
        confirmText: "Confirm",
        cancelText: "Whoops, no!",
        confirmIconClass: "fa-ban",
      });
    }
    setLiveSource(source);
    setEditMode(false);
    setDirty(false);
  }, [dirty, source]);

  const onChangeFormat = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (setFormat === undefined) {
      return;
    }
    const newSource = await setFormat(e.currentTarget.value as NoteFormat);
    setLiveSource(newSource);
  }, [setFormat]);

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
            setFormat && editMode && (
              <select value={format} onChange={onChangeFormat}>
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
          html={html}
          format={format}
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
