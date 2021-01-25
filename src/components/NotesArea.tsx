/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { useAsyncUpdate } from "../hooks/useAsyncUpdate";
import { TrailActor } from "../module/TrailActor";

type NotesAreaProps = {
  actor: TrailActor,
};

export const NotesArea: React.FC<NotesAreaProps> = ({
  actor,
}) => {
  const {
    display,
    onBlur,
    onFocus,
    onChange,
  } = useAsyncUpdate(actor.getNotes(), actor.setNotes);

  return (
    <div>
      <h1>Notes, contacts etc.</h1>
      <textarea
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      >
        {display}
      </textarea>
    </div>
  );
};
