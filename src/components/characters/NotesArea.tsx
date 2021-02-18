/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback, useMemo } from "react";
import { TrailActor } from "../../module/TrailActor";
import system from "../../system.json";
import { longNotes } from "../../constants";
import { crappySplit } from "../../functions";
import { AsyncTextArea } from "../inputs/AsyncTextArea";

type NotesAreaProps = {
  actor: TrailActor,
};

export const NotesArea: React.FC<NotesAreaProps> = ({
  actor,
}) => {
  const longNotesAsString = game.settings.get(system.name, longNotes);
  const longNotesNames = useMemo(() => {
    return crappySplit(longNotesAsString);
  }, [longNotesAsString]);

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
