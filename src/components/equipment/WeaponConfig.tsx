import React, { Fragment, useCallback } from "react";

import { confirmADoodleDo } from "../../functions/confirmADoodleDo";
import { assertGame } from "../../functions/utilities";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { settings } from "../../settings/settings";
import { assertWeaponItem } from "../../v10Types";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { Button } from "../inputs/Button";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { TextInput } from "../inputs/TextInput";
import { Toggle } from "../inputs/Toggle";
import { Translate } from "../Translate";
import { WeaponRange } from "./WeaponRangeConfig";

type WeaponConfigProps = {
  weapon: InvestigatorItem;
};

export const WeaponConfig = (
  {
    weapon
  }: WeaponConfigProps
) => {
  assertGame(game);
  assertWeaponItem(weapon);
  const name = useAsyncUpdate(weapon.name || "", weapon.setName);

  const onClickDelete = useCallback(async () => {
    assertGame(game);
    const message = weapon.actor
      ? "DeleteActorNamesEquipmentName"
      : "DeleteEquipmentName";

    const aye = await confirmADoodleDo({
      message,
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmIconClass: "fa-trash",
      values: {
        ActorName: weapon.actor?.name ?? "",
        EquipmentName: weapon.name ?? "",
      },
      resolveFalseOnCancel: true,
    });
    if (aye) {
      await weapon.delete();
    }
  }, [weapon]);

  const abilities = settings.combatAbilities.get();

  return (
    <InputGrid>
      <GridField label="Item Name">
        <TextInput value={name.display} onChange={name.onChange} />
      </GridField>
      <GridField label="Ability">
        <select
          value={weapon.system.ability}
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
        <AsyncNumberInput
          value={weapon.system.damage}
          onChange={weapon.setDamage}
        />
      </GridField>
      <WeaponRange
        label="Point Blank"
        damage={weapon.system.pointBlankDamage ?? 0}
        enabled={weapon.system.isPointBlank}
        setDamage={weapon.setPointBlankDamage}
        setEnabled={weapon.setIsPointBlank}
      />
      <WeaponRange
        label="Close range"
        damage={weapon.system.closeRangeDamage ?? 0}
        enabled={weapon.system.isCloseRange}
        setDamage={weapon.setCloseRangeDamage}
        setEnabled={weapon.setIsCloseRange}
      />
      <WeaponRange
        label="Near range"
        damage={weapon.system.nearRangeDamage ?? 0}
        enabled={weapon.system.isNearRange}
        setDamage={weapon.setNearRangeDamage}
        setEnabled={weapon.setIsNearRange}
      />
      <WeaponRange
        label="Long range"
        damage={weapon.system.longRangeDamage ?? 0}
        enabled={weapon.system.isLongRange}
        setDamage={weapon.setLongRangeDamage}
        setEnabled={weapon.setIsLongRange}
      />
      <GridField label="Uses ammo?">
        <Toggle
          checked={weapon.system.usesAmmo}
          onChange={weapon.setUsesAmmo}
        />
      </GridField>
      {weapon.system.usesAmmo && (
        <Fragment>
          <GridField label="Ammo capacity">
            <AsyncNumberInput
              min={0}
              value={weapon.system.ammo.max}
              onChange={weapon.setAmmoMax}
            />
          </GridField>
          <GridField label="Ammo per attack">
            <AsyncNumberInput
              min={0}
              value={weapon.system.ammoPerShot}
              onChange={weapon.setAmmoPerShot}
            />
          </GridField>
        </Fragment>
      )}
      <GridField label="Delete">
        <Button onClick={onClickDelete}>
          <Translate>Delete</Translate>
        </Button>
      </GridField>
    </InputGrid>
  );
};
