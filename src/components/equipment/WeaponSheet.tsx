/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { TrailItem } from "../../module/TrailItem";
import { CSSReset } from "../CSSReset";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { TextInput } from "../inputs/TextInput";
import { TextArea } from "../inputs/TextArea";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";

type WeaponSheetProps = {
  entity: TrailItem,
  foundryWindow: Application,
};

export const WeaponSheet: React.FC<WeaponSheetProps> = ({
  entity,
  foundryWindow,
}) => {
  const name = useAsyncUpdate(entity.name, entity.setName);
  const notes = useAsyncUpdate(entity.getter("notes")(), entity.setter("notes"));

  const onClickDelete = useCallback(() => {
    const message = entity.actor
      ? `Delete ${entity.actor.data.name}'s ${entity.data.name}?`
      : `Delete "${entity.data.name}"?`;

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
            entity.delete();
          },
        },
      },
      default: "two",
      // render: html => console.log("Register interactivity in the rendered dialog"),
      // close: html => console.log("This always is logged no matter which option is chosen"),
    });
    d.render(true);
  }, [entity]);

  return (
    <CSSReset>
      <div>
        Weapon
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
        <GridField label="Damage">
          <AsyncNumberInput value={entity.getter("damage")()} onChange={entity.setter("damage")} />
        </GridField>
        <GridField label="Point Blank">
          <AsyncNumberInput value={entity.getter("pointBlankRange")()} onChange={entity.setter("pointBlankRange")} />
        </GridField>
        <GridField label="Close">
          <AsyncNumberInput value={entity.getter("closeRange")()} onChange={entity.setter("closeRange")} />
        </GridField>
        <GridField label="Near">
          <AsyncNumberInput value={entity.getter("nearRange")()} onChange={entity.setter("nearRange")} />
        </GridField>
        <GridField label="Long">
          <AsyncNumberInput value={entity.getter("longRange")()} onChange={entity.setter("longRange")} />
        </GridField>
        <GridField label="Notes">
          <TextArea value={notes.display} onChange={notes.onChange} />
        </GridField>
      </InputGrid>
    </CSSReset>
  );
};
