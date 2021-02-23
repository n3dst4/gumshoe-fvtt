/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback } from "react";
import { TrailActor } from "../../module/TrailActor";
import { AsyncTextArea } from "../inputs/AsyncTextArea";
import { getLongNotes } from "../../settingsHelpers";

type NotesAreaProps = {
  actor: TrailActor,
};

export const NotesArea: React.FC<NotesAreaProps> = ({
  actor,
}) => {
  const longNotesNames = getLongNotes();

  const updateLongNote = useCallback((value, index) => {
    actor.setLongNote(index, value);
  }, [actor]);

  return (
    <div
      css={{
        paddingTop: "1em",
      }}
    >
      {
        longNotesNames.map((name: string, i: number) => (
          <Fragment key={`${name}--${i}`}>
            <h2>{name}</h2>
            <AsyncTextArea
              onChange={updateLongNote}
              value={actor.data.data.longNotes[i]}
              index={i}
            />
          </Fragment>
        ))
      }
    </div>
  );
};
