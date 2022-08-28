import React, { useCallback, useContext } from "react";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { ThemeContext } from "../../themes/ThemeContext";
import { isPCDataSource } from "../../types";
import { absoluteCover } from "../absoluteCover";
// import { absoluteCover } from "../absoluteCover";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { GridField } from "../inputs/GridField";

export const ShortNotesField: React.FC<{
  actor: InvestigatorActor,
  name: string,
  index: number,
}> = ({ actor, name, index }) => {
  const updateShortNote = useCallback(
    (value: string) => {
      actor.setShortNote(index, value);
    },
    [actor, index],
  );

  const [hovering, setHovering] = React.useState(false);

  const value = isPCDataSource(actor.data)
    ? actor.data.data.shortNotes[index]
    : "";

  const theme = useContext(ThemeContext);

  return (
    <GridField
      noTranslate
      label={name}
      css={{
        position: "relative",
      }}
      onDragStart={(e) => { setHovering(true); e.preventDefault(); }}
      onDragEnd={() => { setHovering(false); }}
    >
      {hovering &&
        <div
          css={{
            ...absoluteCover,
            backgroundColor: theme.colors.backgroundButton,
            color: theme.colors.text,
          }}
        >
          <div
            css={{
              // ...absoluteCover,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            Drop here
          </div>
        </div>
      }
      <AsyncTextInput
        value={value}
        onChange={updateShortNote}
        index={index}
        css={{
          filter: hovering ? "blur(2px)" : "none",
          transition: "filter 0.3s, transform 0.3s",
          // transform: hovering ? "scale(1.5)" : "none",
        }}
      />
    </GridField>
  );
};

ShortNotesField.displayName = "ShortNotesField";
