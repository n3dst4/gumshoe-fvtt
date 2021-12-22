/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { getLongNotes } from "../../settingsHelpers";
import { assertPCDataSource } from "../../types";
import { InputGrid } from "../inputs/InputGrid";
import { NotesEditorWithControls } from "../inputs/NotesEditorWithControls";

type NotesAreaProps = {
  actor: InvestigatorActor,
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
        longNotesNames.map<JSX.Element>((name: string, i: number) => {
          assertPCDataSource(actor.data);
          return (
            <InputGrid key={`${name}--${i}`} css={{ height: "12em" }}>
              <NotesEditorWithControls
                title={name}
                index={i}
                allowChangeFormat={false}
                format={actor.data.data.longNotesFormat}
                html={actor.data.data.longNotes[i]?.html ?? ""}
                source={actor.data.data.longNotes[i]?.source ?? ""}
                onSave={updateLongNote}
              />
            </InputGrid>
          );
        })
      }
    </div>
  );
};
