import React, { useCallback, useContext } from "react";
import { assertGame } from "../../functions";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { ThemeContext } from "../../themes/ThemeContext";
import { isPCDataSource } from "../../typeAssertions";
import { absoluteCover } from "../absoluteCover";
// import { absoluteCover } from "../absoluteCover";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { GridField } from "../inputs/GridField";

export const ShortNotesField: React.FC<{
  actor: InvestigatorActor,
  name: string,
  index: number,
}> = ({ actor, name, index }) => {
  const [hovering, setHovering] = React.useState(false);

  const updateShortNote = useCallback(
    (value: string) => {
      actor.setShortNote(index, value);
    },
    [actor, index],
  );

  const onDragEnter = useCallback((e: React.DragEvent) => {
    // console.log("Enter", e);
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    if ((!data?.id) || data?.type !== "JournalEntry") {
      console.log("Not a JournalEntry");
      return;
    }
    setHovering(true);
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDragEnd = useCallback((e: React.DragEvent) => {
    // console.log("End");
    setHovering(false);
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback(async (e: React.DragEvent) => {
    // console.log("Drop");
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    if ((!data?.id) || data?.type !== "JournalEntry") {
      console.log("Not a JournalEntry");
      return;
    }
    setHovering(false);
    e.preventDefault();
    e.stopPropagation();

    // Case 1 - Document from Compendium Pack
    let name = "";
    if (data.pack) {
      assertGame(game);
      const pack = game.packs.get(data.pack);
      if (!pack) return;
      const document = await pack.getDocument(data.id);
      name = document?.name ?? "Unknown";
    } else if (data.type) {
      // Case 2 - Document from World
      name = (CONFIG.JournalEntry.collection as any)?.instance?.get(data.id).name ?? "Unknown";
    }
    console.log("name", name);
  }, []);

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
      onDragOver={onDragEnter}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
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
