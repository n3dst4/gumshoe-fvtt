/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { GumshoeItem } from "../../module/GumshoeItem";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { TextInput } from "../inputs/TextInput";
import { TextArea } from "../inputs/TextArea";
import { Translate } from "../Translate";
import { assertGame, confirmADoodleDo } from "../../functions";
import { ImagePickle } from "../ImagePickle";

type EquipmentSheetProps = {
  entity: GumshoeItem,
  foundryWindow: ItemSheet,
};

export const EquipmentSheet: React.FC<EquipmentSheetProps> = ({
  entity,
  foundryWindow,
}) => {
  const name = useAsyncUpdate(entity.name || "", entity.setName);
  const notes = useAsyncUpdate(entity.getNotes(), entity.setNotes);

  const onClickDelete = useCallback(() => {
    assertGame(game);
    const message = entity.actor
      ? "DeleteActorNamesEquipmentName"
      : "DeleteEquipmentName";

    confirmADoodleDo(
      message,
      "Delete",
      "Cancel",
      "fa-trash",
      {
        ActorName: entity.actor?.data.name ?? "",
        EquipmentName: entity.data.name,
      },
      () => {
        entity.delete();
      },
    );
  }, [entity]);

  return (
    <div
      css={{
        paddingBottom: "1em",
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gridTemplateRows: "auto auto auto",
        gridTemplateAreas:
          "\"image slug     trash\" " +
          "\"image headline headline\" " +
          "\"body  body     body\" ",
      }}
    >
      <div css={{ gridArea: "slug" }}>
        <Translate>Equipment</Translate>
      </div>

      {/* Image */}
      <ImagePickle
        editMode={true}
        document={entity}
        application={foundryWindow}
        css={{
          gridArea: "image",
          transform: "rotateZ(-2deg)",
          width: "4em",
          height: "4em",
          margin: "0 1em 0.5em 0",
        }}
      />

      <a
        css={{
          gridArea: "trash",
        }}
        onClick={() => {
          onClickDelete();
        }}
      >
        <i className={"fa fa-trash"}/>
      </a>

      <h1
        css={{ gridArea: "headline" }}
        contentEditable
        onInput={name.onInput}
        onFocus={name.onFocus}
        onBlur={name.onBlur}
        ref={name.contentEditableRef}
      />
      <InputGrid css={{ gridArea: "body" }}>
        <GridField label="Name">
          <TextInput value={name.display} onChange={name.onChange} />
        </GridField>
        <GridField label="Notes">
          <TextArea value={notes.display} onChange={notes.onChange} />
        </GridField>
      </InputGrid>
    </div>
  );
};
