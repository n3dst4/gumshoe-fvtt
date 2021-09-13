/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback } from "react";
import { GumshoeItem } from "../../module/GumshoeItem";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { TextInput } from "../inputs/TextInput";
import { TextArea } from "../inputs/TextArea";
import { Translate } from "../Translate";
import { assertGame, confirmADoodleDo } from "../../functions";

type EquipmentSheetProps = {
  entity: GumshoeItem,
  foundryWindow: Application,
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
    <Fragment>
      <div>
        <Translate>Equipment</Translate>
        <a
          css={{
            float: "right",
          }}
          onClick={() => {
            onClickDelete();
          }}
        >
          <i className={"fa fa-trash"}/>
        </a>

      </div>

      <h1
        contentEditable
        onInput={name.onInput}
        onFocus={name.onFocus}
        onBlur={name.onBlur}
        ref={name.contentEditableRef}
      />
      <InputGrid>
        <GridField label="Name">
          <TextInput value={name.display} onChange={name.onChange} />
        </GridField>
        <GridField label="Notes">
          <TextArea value={notes.display} onChange={notes.onChange} />
        </GridField>
      </InputGrid>
    </Fragment>
  );
};
