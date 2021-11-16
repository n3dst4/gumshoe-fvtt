/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { TextInput } from "../inputs/TextInput";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { WeaponRange } from "./WeaponRangeConfig";
import { getCombatAbilities } from "../../settingsHelpers";
import { Translate } from "../Translate";
import { assertGame, confirmADoodleDo } from "../../functions";
import { assertWeaponDataSource } from "../../types";
import { AsyncCheckbox } from "../inputs/AsyncCheckbox";
import { AsyncTextArea } from "../inputs/AsyncTextArea";

type WeaponConfigProps = {
  weapon: InvestigatorItem,
};

export const WeaponConfig: React.FC<WeaponConfigProps> = ({
  weapon,
}) => {
  assertGame(game);
  assertWeaponDataSource(weapon.data);
  const name = useAsyncUpdate(weapon.name || "", weapon.setName);

  const onClickDelete = useCallback(() => {
    assertGame(game);
    const message = weapon.actor
      ? "DeleteActorNamesEquipmentName"
      : "DeleteEquipmentName";

    confirmADoodleDo(
      message,
      "Delete",
      "Cancel",
      "fa-trash",
      {
        ActorName: weapon.actor?.data.name ?? "",
        EquipmentName: weapon.data.name,
      },
      () => {
        weapon.delete();
      },
    );
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
            {abilities.map<JSX.Element>((cat: string) => (
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
          <AsyncTextArea value={weapon.getNotes()} onChange={weapon.setNotes} />
        </GridField>
        <GridField label="Uses ammo?">
          <AsyncCheckbox
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
