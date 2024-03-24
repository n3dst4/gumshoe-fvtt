import React, { Fragment, useCallback, useContext } from "react";

import { confirmADoodleDo } from "../../../functions/confirmADoodleDo";
import { assertGame } from "../../../functions/utilities";
import { InvestigatorItem } from "../../../module/InvestigatorItem";
import { ThemeContext } from "../../../themes/ThemeContext";
import { assertWeaponItem } from "../../../v10Types";
import { AsyncCheckbox } from "../../inputs/AsyncCheckbox";
import { AsyncNumberInput } from "../../inputs/AsyncNumberInput";
import { AsyncTextInput } from "../../inputs/AsyncTextInput";
import { CombatAbilityDropDown } from "../../inputs/CombatAbilityDropDown";
import { CompactNotesEditor } from "../../inputs/CompactNotesEditor";

type WeaponRowEditProps = {
  weapon: InvestigatorItem;
  index: number;
};

export const WeaponRowEdit: React.FC<WeaponRowEditProps> = ({
  weapon,
  index,
}) => {
  assertWeaponItem(weapon);

  const theme = useContext(ThemeContext);

  const weaponRangeReduce = useCallback(async () => {
    if (weapon.getIsLongRange()) {
      await weapon.setIsLongRange(false);
    } else if (weapon.getIsNearRange()) {
      await weapon.setIsNearRange(false);
    } else if (weapon.getIsCloseRange()) {
      await weapon.setIsCloseRange(false);
    }
  }, [weapon]);
  const weaponRangeExpand = useCallback(async () => {
    if (!weapon.getIsCloseRange()) {
      await weapon.setIsCloseRange(true);
    } else if (!weapon.getIsNearRange()) {
      await weapon.setIsNearRange(true);
    } else if (!weapon.getIsLongRange()) {
      await weapon.setIsLongRange(true);
    }
  }, [weapon]);
  const onClickDelete = useCallback(async () => {
    assertGame(game);
    const message = weapon.actor
      ? "DeleteActorNamesEquipmentName"
      : "DeleteEquipmentName";

    (await confirmADoodleDo({
      message,
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmIconClass: "fa-trash",
      values: {
        ActorName: weapon.actor?.name ?? "",
        EquipmentName: weapon.name ?? "",
      },
    })) && (await weapon.delete());
  }, [weapon]);

  const gridRow = index * 3 + 3;

  return (
    <Fragment>
      <div
        css={{
          gridColumn: "1/-1",
          gridRow: `${gridRow}/${gridRow + 2}`,
          background: theme.colors.backgroundButton,
          margin: "-0.5em",
        }}
      />
      <div
        css={{
          gridColumn: "1/-1",
          gridRow: `${gridRow + 2}/${gridRow + 3}`,
          height: "0.5em",
        }}
      />

      {/* NAME */}
      <AsyncTextInput
        css={{
          gridColumn: "name",
          gridRow,
        }}
        value={weapon.name ?? ""}
        onChange={weapon.setName}
      />
      <AsyncNumberInput
        value={weapon.getDamage()}
        onChange={weapon.setDamage}
        noPlusMinus
        css={{ gridColumn: "base", gridRow }}
      />
      {weapon.getIsPointBlank() && (
        <AsyncNumberInput
          value={weapon.getPointBlankDamage()}
          onChange={weapon.setPointBlankDamage}
          noPlusMinus
          css={{ gridColumn: "pb", gridRow }}
        />
      )}
      {weapon.getIsCloseRange() && (
        <AsyncNumberInput
          value={weapon.getCloseRangeDamage()}
          onChange={weapon.setCloseRangeDamage}
          noPlusMinus
          css={{ gridColumn: "cr", gridRow }}
        />
      )}
      {weapon.getIsNearRange() && (
        <AsyncNumberInput
          value={weapon.getNearRangeDamage()}
          onChange={weapon.setNearRangeDamage}
          noPlusMinus
          css={{ gridColumn: "nr", gridRow }}
        />
      )}
      {weapon.getIsLongRange() && (
        <AsyncNumberInput
          value={weapon.getLongRangeDamage()}
          onChange={weapon.setLongRangeDamage}
          noPlusMinus
          css={{ gridColumn: "lr", gridRow }}
        />
      )}

      {/* left/right arrows */}
      <div
        css={{
          gridColumn: weapon.getIsLongRange()
            ? "back"
            : weapon.getIsNearRange()
              ? "lr"
              : weapon.getIsCloseRange()
                ? "nr"
                : weapon.getIsPointBlank()
                  ? "cr"
                  : "pb",
          gridRow,
        }}
      >
        <button
          css={{ width: "1em", padding: "0.2em 0.1em" }}
          onClick={weaponRangeReduce}
        >
          <i className="fa fa-chevron-left" />
        </button>
        {weapon.getIsLongRange() || (
          <button
            css={{ width: "1em", padding: "0.2em 0.1em" }}
            onClick={weaponRangeExpand}
          >
            <i className="fa fa-chevron-right" />
          </button>
        )}
      </div>

      {/* delete */}
      <button
        css={{
          gridColumn: "delete",
          gridRow,
          width: "1.6em",
          padding: "0.2em 0.1em",
          // margin: "0.5em 0.5em 0 0",
        }}
        onClick={onClickDelete}
      >
        <i className="fa fa-trash" />
      </button>

      {/* SIDEBAR */}
      <div
        css={{
          gridColumn: "ammo",
          gridRow: gridRow + 1,
        }}
      >
        <CombatAbilityDropDown
          value={weapon.system.ability}
          onChange={(e) => weapon.setAbility(e)}
          css={{ display: "block" }}
        />
        <div>
          <label>
            Use ammo?
            <AsyncCheckbox
              checked={weapon.getUsesAmmo()}
              onChange={weapon.setUsesAmmo}
            />
          </label>
        </div>
        {weapon.getUsesAmmo() && (
          <Fragment>
            Current
            <AsyncNumberInput
              min={0}
              value={weapon.getAmmo()}
              onChange={weapon.setAmmo}
            />
            Maximum
            <AsyncNumberInput
              min={0}
              value={weapon.getAmmoMax()}
              onChange={weapon.setAmmoMax}
            />
          </Fragment>
        )}
      </div>

      <CompactNotesEditor
        css={{
          gridColumn: "notes / -1",
          gridRow: gridRow + 1,
        }}
        note={weapon.getNotes()}
        onChange={weapon.setNotes}
      />
    </Fragment>
  );
};
