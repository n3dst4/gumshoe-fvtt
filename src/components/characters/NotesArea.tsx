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
  // const notes = useAsyncUpdate(actor.getNotes(), actor.setNotes);
  // const occupationalBenefits = useAsyncUpdate(
  //   actor.getOccupationalBenefits(),
  //   actor.setOccupationalBenefits);
  // const pillarsOfSanity = useAsyncUpdate(
  //   actor.getPillarsOfSanity(),
  //   actor.setPillarsOfSanity);
  // const sourcesOfStability = useAsyncUpdate(
  //   actor.getSourcesOfStability(),
  //   actor.setSourcesOfStability);
  // const background = useAsyncUpdate(
  //   actor.getBackground(),
  //   actor.setBackground);

  const longNotesAsString = game.settings.get(system.name, longNotes);
  const longNotesNames = useMemo(() => {
    return crappySplit(longNotesAsString);
  }, [longNotesAsString]);

  const updateLongNote = useCallback((value, index) => {
    const newNotes = [...actor.data.data.longNotes || []];
    newNotes[index] = value;
    actor.update({
      data: {
        longNotes: newNotes,
      },
    });
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

      {/* <h2>Notes, contacts etc.</h2>
      <TextArea
        onChange={notes.onChange}
        onBlur={notes.onBlur}
        onFocus={notes.onFocus}
        value={notes.display}
      />
      <h2>Occupational Bennies</h2>
      <TextArea
        onChange={occupationalBenefits.onChange}
        onBlur={occupationalBenefits.onBlur}
        onFocus={occupationalBenefits.onFocus}
        value={occupationalBenefits.display}
      />
      <h2>Pillars of Sanity</h2>
      <TextArea
        onChange={pillarsOfSanity.onChange}
        onBlur={pillarsOfSanity.onBlur}
        onFocus={pillarsOfSanity.onFocus}
        value={pillarsOfSanity.display}
      />
      <h2>Sources of Stability</h2>
      <TextArea
        onChange={sourcesOfStability.onChange}
        onBlur={sourcesOfStability.onBlur}
        onFocus={sourcesOfStability.onFocus}
        value={sourcesOfStability.display}
      />
      <h2>Background</h2>
      <TextArea
        onChange={background.onChange}
        onBlur={background.onBlur}
        onFocus={background.onFocus}
        value={background.display}
      /> */}
    </div>
  );
};
