/* eslint-disable react-hooks/exhaustive-deps */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent, useCallback, useContext } from "react";
import { assertGame } from "../../functions";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { IdContext } from "../IdContext";

type AsyncTextAreaProps = {
  className?: string,
  value: string,
  onChange: (value: string, index?: number) => void,
  disabled?: boolean,
  index?: number,
};

export const AsyncTextArea: React.FC<AsyncTextAreaProps> = ({
  className,
  value,
  onChange: onChangeOrig,
  disabled,
  index,
}) => {
  const id = useContext(IdContext);

  const {
    onChange,
    onFocus,
    onBlur,
    display,
  } = useAsyncUpdate(value, onChangeOrig, index);

  const onChangeCb = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.currentTarget.value);
  }, [index, onChange]);

  // inspired by _onDropEditorData in foundry.js
  const onDropEditorData = async (event : React.DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData("text/plain"));
    if (!data?.id) return;

    // Case 1 - Document from Compendium Pack
    if (data.pack) {
      assertGame(game);
      const pack = game.packs.get(data.pack);
      if (!pack) return;
      const document = await pack.getDocument(data.id);
      const link = `@Compendium[${data.pack}.${data.id}]{${document?.name}}`;
      onChange(`${display}${link}`);
    } else if (data.type) {
      // Case 2 - Document from World
      const config = CONFIG[data.type as "Actor"|"Item"|"Scene"];
      if (!config) return false;
      const entity = (config.collection as any).instance.get(data.id);
      if (!entity) return false;
      const link = `@${data.type}[${entity._id}]{${entity.name}}`;
      onChange(`${display || ""}${link}`);
    }
  };

  return (
    <textarea
      id={id}
      css={{
        flex: 1,
        width: "100%",
      }}
      className={className}
      data-lpignore="true"
      value={display || ""}
      onChange={onChangeCb}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      onDrop={(e) => onDropEditorData(e)}
    />
  );
};
