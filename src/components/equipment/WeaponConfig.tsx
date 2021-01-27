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
import { WeaponRange } from "./WeaponRangeConfig";
import { combatAbilities } from "../../constants";
import system from "../../system.json";

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

  const abilities = game.settings.get(system.name, combatAbilities).split(",").map(x => x.trim());

  return (
    <Fragment>
      <InputGrid>
        <GridField label="Name">
          <TextInput value={name.display} onChange={name.onChange} />
        </GridField>
        <GridField label="Ability">
          <select
            value={weapon.data.data.ability}
            onChange={(e) => weapon.setter("ability")(e.currentTarget.value)}
            css={{
              lineHeight: "inherit",
              height: "inherit",
            }}
          >
            {abilities.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </GridField>
        <GridField label="Base Damage">
          <AsyncNumberInput value={weapon.getter("damage")()} onChange={weapon.setter("damage")} />
        </GridField>
        <WeaponRange
          label="Point Blank"
          weapon={weapon}
          valueField="pointBlankDamage"
          enabledField="isPointBlank"
        />
        <WeaponRange
          label="Close range"
          weapon={weapon}
          valueField="closeRangeDamage"
          enabledField="isCloseRange"
        />
        <WeaponRange
          label="Near range"
          weapon={weapon}
          valueField="nearRangeDamage"
          enabledField="isNearRange"
        />
        <WeaponRange
          label="Long range"
          weapon={weapon}
          valueField="longRangeDamage"
          enabledField="isLongRange"
        />
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
