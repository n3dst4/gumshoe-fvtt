import React, { useCallback } from "react";

import { InvestigatorActor } from "../../module/InvestigatorActor";
import { settings } from "../../settings/settings";
import { NoteWithFormat } from "../../types";
import { assertPCActor } from "../../v10Types";
import { absoluteCover } from "../absoluteCover";
import { CssClassContext } from "../CssClassContext";
import { IndexedNotesEditorWithControls } from "../inputs/IndexedNotesEditorWithControls";
import { InputGrid } from "../inputs/InputGrid";

type NotesAreaProps = {
  actor: InvestigatorActor;
};

export const NotesArea: React.FC<NotesAreaProps> = ({ actor }) => {
  const longNotesNames = settings.longNotes.get();

  const updateLongNote = useCallback(
    (value: NoteWithFormat, index: number) => {
      actor.setLongNote(index, value);
    },
    [actor],
  );

  return (
    <div
      css={{
        ...absoluteCover,
        paddingTop: "1em",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {longNotesNames.map<JSX.Element>((name: string, i: number) => {
        assertPCActor(actor);

        return (
          <CssClassContext.Provider key={`${name}--${i}`} value="pcNote">
            <InputGrid css={{ flex: 1, minHeight: "12em" }}>
              <IndexedNotesEditorWithControls
                title={name}
                index={i}
                allowChangeFormat={false}
                format={actor.system.longNotesFormat}
                html={actor.system.longNotes[i]?.html ?? ""}
                source={actor.system.longNotes[i]?.source ?? ""}
                onSave={updateLongNote}
                h2
              />
            </InputGrid>
          </CssClassContext.Provider>
        );
      })}
    </div>
  );
};
