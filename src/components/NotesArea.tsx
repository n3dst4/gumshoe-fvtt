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
  const notesGetter = actor.getter("notes");
  const notesSetter = actor.setter("notes");

  const {
    display,
    onBlur,
    onFocus,
    onChange,
  } = useAsyncUpdate(notesGetter(), notesSetter);

  return (
    <div>
      <h2>Notes, contacts etc.</h2>
      <textarea
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        value={display}
      />
    </div>
  );
};
