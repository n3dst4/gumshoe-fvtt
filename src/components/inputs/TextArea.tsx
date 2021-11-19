/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent, useCallback, useContext } from "react";
import { assertGame } from "../../functions";
import { IdContext } from "../IdContext";

type TextAreaProps = {
  className?: string,
  value?: string,
  defaultValue?: string,
  onChange?: (value: string, index?: number) => void,
  onFocus?: () => void,
  onBlur?: () => void,
  disabled?: boolean,
  placeholder?: string,
  index?: number,
};

export const TextArea: React.FC<TextAreaProps> = ({
  className,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  disabled,
  placeholder,
  index,
}) => {
  const id = useContext(IdContext);

  const onChangeCb = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.currentTarget.value, index);
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
      onChange?.(`${value}${link}`, index);
    } else if (data.type) {
      // Case 2 - Document from World
      const config = CONFIG[data.type as "Actor"|"Item"|"Scene"];
      if (!config) return false;
      const entity = (config.collection as any).instance.get(data.id);
      if (!entity) return false;
      const link = `@${data.type}[${entity._id}]{${entity.name}}`;
      onChange?.(`${value || ""}${link}`, index);
    }
  };

  return (
    <textarea
      id={id}
      css={{
        flex: 1,
        width: "100%",
        height: "4em",
      }}
      className={className}
      data-lpignore="true"
      value={value}
      defaultValue={defaultValue}
      onChange={onChangeCb}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={placeholder}
      onDrop={(e) => onDropEditorData(e)}
    />
  );
};
