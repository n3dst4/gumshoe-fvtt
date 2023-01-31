import React from "react";
import { assertGame, padLength } from "../../functions";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { settings } from "../../settings";
import { assertPersonalDetailDataSource } from "../../typeAssertions";
import { absoluteCover } from "../absoluteCover";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { GridField } from "../inputs/GridField";
// import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { InputGrid } from "../inputs/InputGrid";
import { NotesEditorWithControls } from "../inputs/NotesEditorWithControls";
// import { TextInput } from "../inputs/TextInput";

interface PersonalDetailMainProps {
  item: InvestigatorItem;
}

export const PersonalDetailMain: React.FC<PersonalDetailMainProps> = ({
  item,
}) => {
  assertGame(game);
  assertPersonalDetailDataSource(item.data);
  const name = item.name;
  const shortNotes = settings.shortNotes.get();
  const options = padLength(
    shortNotes,
    item.data.data.index + 1,
    (index) => `Slot ${index + 1}`,
  );
  const compendiumPacks = game.packs.filter(
    (pack: CompendiumCollection<CompendiumCollection.Metadata>) =>
      pack.metadata.type === "Item",
  );

  return (
    <InputGrid
      css={{
        ...absoluteCover,
        gridTemplateRows: "auto auto auto 1fr",
      }}
    >
      <GridField label="Name">
        <AsyncTextInput value={name || ""} onChange={item.setName} />
      </GridField>
      <GridField label="Slot">
        <select
          value={item.data.data.index}
          css={{
            width: "100%",
          }}
          onChange={(e) => {
            item.setIndex(+e.currentTarget.value);
          }}
        >
          <option value={-1}>{settings.occupationLabel.get()}</option>
          {options.map<JSX.Element>((option, i) => (
            <option key={option} value={i}>
              {option}
            </option>
          ))}
        </select>
      </GridField>
      <GridField label="Compendium Pack">
        <select
          value={item.data.data.compendiumPackId ?? ""}
          css={{
            width: "100%",
          }}
          onChange={(e) => {
            const value =
              e.currentTarget.value === "~~~NULL~~~"
                ? null
                : e.currentTarget.value;
            item.setCompendiumPack(value);
          }}
        >
          <option value={"~~~NULL~~~"}>None</option>
          {compendiumPacks.map<JSX.Element>((pack, i) => (
            <option key={pack.collection} value={pack.collection}>
              {pack.metadata.label}
            </option>
          ))}
        </select>
      </GridField>
      <NotesEditorWithControls
        allowChangeFormat
        format={item.data.data.notes.format}
        html={item.data.data.notes.html}
        source={item.data.data.notes.source}
        onSave={item.setNotes}
        css={{
          height: "100%",
          "&&": {
            resize: "none",
          },
        }}
      />
    </InputGrid>
  );
};

PersonalDetailMain.displayName = "PersonalDetailMain";
