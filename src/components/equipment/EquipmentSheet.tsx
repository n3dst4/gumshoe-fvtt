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
import { systemName } from "../../constants";
import { assertGame } from "../../functions";

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
      ? game.i18n.format(`${systemName}.DeleteActorNamesEquipmentName`, {
          ActorName: entity.actor.data.name,
          EquipmentName: entity.data.name,
        })
      : game.i18n.format(`${systemName}.DeleteEquipmentName`, {
        EquipmentName: entity.data.name,
      });

    const d = new Dialog({
      title: game.i18n.localize("Confirm"),
      content: `<p>${message}</p>`,
      buttons: {
        cancel: {
          icon: '<i class="fas fa-ban"></i>',
          label: game.i18n.localize("Cancel"),
        },
        delete: {
          icon: '<i class="fas fa-trash"></i>',
          label: game.i18n.localize("Delete"),
          callback: () => {
            entity.delete();
          },
        },
      },
      default: "cancel",
      // render: html => console.log("Register interactivity in the rendered dialog"),
      // close: html => console.log("This always is logged no matter which option is chosen"),
    });
    d.render(true);
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
