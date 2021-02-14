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
import { Checkbox } from "../inputs/Checkbox";

type WeaponConfigProps = {
  weapon: TrailItem,
};

export const WeaponConfig: React.FC<WeaponConfigProps> = ({
  weapon,
}) => {
  const name = useAsyncUpdate(weapon.name, weapon.setName);
  const notes = useAsyncUpdate(weapon.getNotes(), weapon.setNotes);

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

  const abilities = game.settings.get(system.name, combatAbilities).split(",").map((x: string) => x.trim());

  return (
    <Fragment>
      <InputGrid>
        <GridField label="Name">
          <TextInput value={name.display} onChange={name.onChange} />
        </GridField>
        <GridField label="Ability">
          <select
            value={weapon.data.data.ability}
            onChange={(e) => weapon.setAbility(e.currentTarget.value)}
            css={{
              lineHeight: "inherit",
              height: "inherit",
            }}
          >
            {abilities.map((cat: string) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </GridField>
        <GridField label="Base Damage">
          <AsyncNumberInput value={weapon.getDamage()} onChange={weapon.setDamage} />
        </GridField>
        <WeaponRange
          label="Point Blank"
          damage={weapon.getPointBlankDamage()}
          enabled={weapon.getIsPointBlank()}
          setDamage={weapon.setPointBlankDamage}
          setEnabled={weapon.setIsPointBlank}
        />
        <WeaponRange
          label="Close range"
          damage={weapon.getCloseRangeDamage()}
          enabled={weapon.getIsCloseRange()}
          setDamage={weapon.setCloseRangeDamage}
          setEnabled={weapon.setIsCloseRange}
        />
        <WeaponRange
          label="Near range"
          damage={weapon.getNearRangeDamage()}
          enabled={weapon.getIsNearRange()}
          setDamage={weapon.setNearRangeDamage}
          setEnabled={weapon.setIsNearRange}
        />
        <WeaponRange
          label="Long range"
          damage={weapon.getLongRangeDamage()}
          enabled={weapon.getIsLongRange()}
          setDamage={weapon.setLongRangeDamage}
          setEnabled={weapon.setIsLongRange}
        />
        <GridField label="Notes">
          <TextArea value={notes.display} onChange={notes.onChange} />
        </GridField>
        <GridField label="Uses ammo?">
          <Checkbox
            checked={weapon.getUsesAmmo()}
            onChange={weapon.setUsesAmmo}
          />
        </GridField>
        {weapon.data.data.usesAmmo &&
          <Fragment>
            <GridField label="Ammo capacity">
              <AsyncNumberInput
                min={0}
                value={weapon.getAmmoMax()}
                onChange={weapon.setAmmoMax}
              />
            </GridField>
            <GridField label="Ammo per attack">
              <AsyncNumberInput
                min={0}
                value={weapon.getAmmoPerShot()}
                onChange={weapon.setAmmoPerShot}
              />
            </GridField>
          </Fragment>
        }
        <GridField label="Delete">
          <button onClick={onClickDelete}>Delete</button>
        </GridField>
      </InputGrid>
    </Fragment>
  );
};
