import { Fragment, useCallback, useState } from "react";

import { confirmADoodleDo } from "../../functions/confirmADoodleDo";
import { assertGame } from "../../functions/utilities";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { useItemSheetContext } from "../../hooks/useSheetContexts";
import { settings } from "../../settings/settings";
import { assertWeaponItem } from "../../v10Types";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { Button } from "../inputs/Button";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { TextInput } from "../inputs/TextInput";
import { Toggle } from "../inputs/Toggle";
import { Translate } from "../Translate";
import { WeaponRange } from "./WeaponRangeConfig";

const customAbilityToken = "CUSTOM_ABILITY_TOKEN";

export const WeaponConfig = () => {
  assertGame(game);
  const { item } = useItemSheetContext();

  assertWeaponItem(item);
  const name = useAsyncUpdate(item.name || "", item.setName);

  const onClickDelete = useCallback(async () => {
    assertGame(game);
    const message = item.actor
      ? "DeleteActorNamesEquipmentName"
      : "DeleteEquipmentName";

    const aye = await confirmADoodleDo({
      message,
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmIconClass: "fa-trash",
      values: {
        ActorName: item.actor?.name ?? "",
        EquipmentName: item.name ?? "",
      },
      resolveFalseOnCancel: true,
    });
    if (aye) {
      await item.delete();
    }
  }, [item]);

  const validCombatAbilities = settings.combatAbilities.get();
  const chosenAbilityIsValid = validCombatAbilities.includes(
    item.system.ability,
  );
  const [showCustomAbility, setShowCustomAbility] =
    useState(!chosenAbilityIsValid);

  const handleChangeCustomAbility = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.currentTarget.value === customAbilityToken) {
        setShowCustomAbility(true);
      } else {
        setShowCustomAbility(false);
        await item.setAbility(e.currentTarget.value);
      }
    },
    [item, setShowCustomAbility],
  );

  const effectiveAbilityValue = showCustomAbility
    ? customAbilityToken
    : item.system.ability;

  return (
    <InputGrid>
      <GridField label="Item Name">
        <TextInput value={name.display} onChange={name.onChange} />
      </GridField>
      <GridField label="Cost">
        <AsyncNumberInput
          min={0}
          value={item.system.cost}
          onChange={item.setCost}
        />
      </GridField>

      <GridField label="Initiative">
        <select
          value={effectiveAbilityValue}
          onChange={handleChangeCustomAbility}
          css={{
            lineHeight: "inherit",
            height: "inherit",
          }}
        >
          {validCombatAbilities.map<JSX.Element>((cat: string) => (
            <option key={cat}>{cat}</option>
          ))}
          <option value={customAbilityToken}>
            <Translate>Other</Translate>
          </option>
        </select>
      </GridField>
      {showCustomAbility && (
        <GridField>
          <AsyncTextInput
            value={item.system.ability}
            onChange={item.setAbility}
          />
        </GridField>
      )}
      <GridField label="Base Damage">
        <AsyncNumberInput
          value={item.system.damage}
          onChange={item.setDamage}
        />
      </GridField>
      <WeaponRange
        label="Point Blank"
        damage={item.system.pointBlankDamage ?? 0}
        enabled={item.system.isPointBlank}
        setDamage={item.setPointBlankDamage}
        setEnabled={item.setIsPointBlank}
      />
      <WeaponRange
        label="Close range"
        damage={item.system.closeRangeDamage ?? 0}
        enabled={item.system.isCloseRange}
        setDamage={item.setCloseRangeDamage}
        setEnabled={item.setIsCloseRange}
      />
      <WeaponRange
        label="Near range"
        damage={item.system.nearRangeDamage ?? 0}
        enabled={item.system.isNearRange}
        setDamage={item.setNearRangeDamage}
        setEnabled={item.setIsNearRange}
      />
      <WeaponRange
        label="Long range"
        damage={item.system.longRangeDamage ?? 0}
        enabled={item.system.isLongRange}
        setDamage={item.setLongRangeDamage}
        setEnabled={item.setIsLongRange}
      />
      <GridField label="Uses ammo?">
        <Toggle checked={item.system.usesAmmo} onChange={item.setUsesAmmo} />
      </GridField>
      {item.system.usesAmmo && (
        <Fragment>
          <GridField label="Ammo capacity">
            <AsyncNumberInput
              min={0}
              value={item.system.ammo.max}
              onChange={item.setAmmoMax}
            />
          </GridField>
          <GridField label="Ammo per attack">
            <AsyncNumberInput
              min={0}
              value={item.system.ammoPerShot}
              onChange={item.setAmmoPerShot}
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
