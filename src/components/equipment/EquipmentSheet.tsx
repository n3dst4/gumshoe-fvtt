/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { TextInput } from "../inputs/TextInput";
import { Translate } from "../Translate";
import { assertGame, confirmADoodleDo } from "../../functions";
import { ImagePickle } from "../ImagePickle";
import { AsyncTextArea } from "../inputs/AsyncTextArea";

type EquipmentSheetProps = {
  equipment: InvestigatorItem,
  application: ItemSheet,
};

export const EquipmentSheet: React.FC<EquipmentSheetProps> = ({
  equipment,
  application,
}) => {
  const name = useAsyncUpdate(equipment.name || "", equipment.setName);

  const onClickDelete = useCallback(() => {
    assertGame(game);
    const message = equipment.actor
      ? "DeleteActorNamesEquipmentName"
      : "DeleteEquipmentName";

    confirmADoodleDo(
      message,
      "Delete",
      "Cancel",
      "fa-trash",
      {
        ActorName: equipment.actor?.data.name ?? "",
        EquipmentName: equipment.data.name,
      },
      () => {
        equipment.delete();
      },
    );
  }, [equipment]);

  return (
    <div
      css={{
        paddingBottom: "1em",
        display: "grid",
        position: "relative",
        gridTemplateColumns: "auto 1fr auto",
        gridTemplateRows: "auto auto auto",
        gridTemplateAreas:
          "\"image slug     trash\" " +
          "\"image headline headline\" " +
          "\"body  body     body\" ",
      }}
    >
      {/* Slug */}
      <div css={{ gridArea: "slug" }}>
        <Translate>Equipment</Translate>
      </div>

      {/* Headline */}
      <h1
        css={{ gridArea: "headline" }}
        contentEditable
        onInput={name.onInput}
        onFocus={name.onFocus}
        onBlur={name.onBlur}
        ref={name.contentEditableRef}
      />

      {/* Image */}
      <ImagePickle
        subject={equipment}
        application={application}
        css={{
          gridArea: "image",
          transform: "rotateZ(-2deg)",
          width: "4em",
          height: "4em",
          margin: "0 1em 0.5em 0",
        }}
      />

      {/* Trash */}
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

      {/* Body */}
      <InputGrid css={{ gridArea: "body" }}>
        <GridField label="Name">
          <TextInput value={name.display} onChange={name.onChange} />
        </GridField>
        <GridField label="Notes">
          {/* XXX RTF */}
          <AsyncTextArea value={equipment.getNotes().source} onChange={equipment.setNotesSource} />
        </GridField>
      </InputGrid>
    </div>
  );
};
