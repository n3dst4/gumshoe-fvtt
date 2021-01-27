/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback } from "react";
import { TrailItem } from "../../module/TrailItem";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { TextInput } from "../inputs/TextInput";
import { TextArea } from "../inputs/TextArea";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";

type WeaponConfigProps = {
  weapon: TrailItem,
};

export const WeaponConfig: React.FC<WeaponConfigProps> = ({
  weapon,
}) => {
  const name = useAsyncUpdate(weapon.name, weapon.setName);
  const notes = useAsyncUpdate(weapon.getter("notes")(), weapon.setter("notes"));

  const onClickDelete = useCallback(() => {
    const message = weapon.actor
      ? `Delete ${weapon.actor.data.name}'s ${weapon.data.name}?`
      : `Delete "${weapon.data.name}"?`;

    const d = new Dialog({
      title: "Confirm",
      content: `<p>${message}</p>`,
      buttons: {
        cancel: {
          icon: '<i class="fas fa-ban"></i>',
          label: "Cancel",
        },
        delete: {
          icon: '<i class="fas fa-trash"></i>',
          label: "Delete",
          callback: () => {
            weapon.delete();
          },
        },
      },
      default: "two",
      // render: html => console.log("Register interactivity in the rendered dialog"),
      // close: html => console.log("This always is logged no matter which option is chosen"),
    });
    d.render(true);
  }, [weapon]);

  return (
    <Fragment>
      <InputGrid>
        <GridField label="Name">
          <TextInput value={name.display} onChange={name.onChange} />
        </GridField>
        <GridField label="Damage">
          <AsyncNumberInput value={weapon.getter("damage")()} onChange={weapon.setter("damage")} />
        </GridField>
        <GridField label="Point Blank">
          <AsyncNumberInput value={weapon.getter("pointBlankRange")()} onChange={weapon.setter("pointBlankRange")} />
        </GridField>
        <GridField label="Close">
          <AsyncNumberInput value={weapon.getter("closeRange")()} onChange={weapon.setter("closeRange")} />
        </GridField>
        <GridField label="Near">
          <AsyncNumberInput value={weapon.getter("nearRange")()} onChange={weapon.setter("nearRange")} />
        </GridField>
        <GridField label="Long">
          <AsyncNumberInput value={weapon.getter("longRange")()} onChange={weapon.setter("longRange")} />
        </GridField>
        <GridField label="Notes">
          <TextArea value={notes.display} onChange={notes.onChange} />
        </GridField>
        <GridField label="Delete">
          <button onClick={onClickDelete}>Delete</button>
        </GridField>
      </InputGrid>
    </Fragment>
  );
};
