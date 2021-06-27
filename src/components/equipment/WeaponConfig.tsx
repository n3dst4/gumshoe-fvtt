/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback } from "react";
import { GumshoeItem } from "../../module/GumshoeItem";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { TextInput } from "../inputs/TextInput";
import { TextArea } from "../inputs/TextArea";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { WeaponRange } from "./WeaponRangeConfig";
import { Checkbox } from "../inputs/Checkbox";
import { getCombatAbilities } from "../../settingsHelpers";
import { Translate } from "../Translate";
import { systemName } from "../../constants";

type WeaponConfigProps = {
  weapon: GumshoeItem,
};

export const WeaponConfig: React.FC<WeaponConfigProps> = ({
  weapon,
}) => {
  const name = useAsyncUpdate(weapon.name, weapon.setName);
  const notes = useAsyncUpdate(weapon.getNotes(), weapon.setNotes);

  const onClickDelete = useCallback(() => {
    const message = weapon.actor
      ? game.i18n.format(`${systemName}.DeleteActorNamesEquipmentName`, {
          ActorName: weapon.actor.data.name,
          EquipmentName: weapon.data.name,
        })
      : game.i18n.format(`${systemName}.DeleteEquipmentName`, {
        EquipmentName: weapon.data.name,
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
            weapon.delete();
          },
        },
      },
      default: "cancel",
      // render: html => console.log("Register interactivity in the rendered dialog"),
      // close: html => console.log("This always is logged no matter which option is chosen"),
    });
    d.render(true);
  }, [weapon]);

  const abilities = getCombatAbilities();

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
          <button onClick={onClickDelete}><Translate>Delete</Translate></button>
        </GridField>
      </InputGrid>
    </Fragment>
  );
};
