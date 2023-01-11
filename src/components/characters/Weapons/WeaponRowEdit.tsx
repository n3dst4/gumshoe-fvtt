import React, { Fragment, useCallback, useContext } from "react";
import { InvestigatorItem } from "../../../module/InvestigatorItem";
import { AsyncNumberInput } from "../../inputs/AsyncNumberInput";
import { AsyncCheckbox } from "../../inputs/AsyncCheckbox";
import { CompactNotesEditor } from "../../inputs/CompactNotesEditor";
import { CombatAbilityDropDown } from "../../inputs/CombatAbilityDropDown";
import { assertGame, confirmADoodleDo } from "../../../functions";
import { assertWeaponDataSource } from "../../../typeAssertions";
import { AsyncTextInput } from "../../inputs/AsyncTextInput";
import { ThemeContext } from "../../../themes/ThemeContext";

type WeaponRowEditProps = {
  weapon: InvestigatorItem;
  index: number;
};

export const WeaponRowEdit: React.FC<WeaponRowEditProps> = ({
  weapon,
  index,
}) => {
  assertWeaponDataSource(weapon.data);

  const theme = useContext(ThemeContext);

  const weaponRangeReduce = useCallback(() => {
    if (weapon.getIsLongRange()) {
      weapon.setIsLongRange(false);
    } else if (weapon.getIsNearRange()) {
      weapon.setIsNearRange(false);
    } else if (weapon.getIsCloseRange()) {
      weapon.setIsCloseRange(false);
    }
  }, [weapon]);
  const weaponRangeExpand = useCallback(() => {
    if (!weapon.getIsCloseRange()) {
      weapon.setIsCloseRange(true);
    } else if (!weapon.getIsNearRange()) {
      weapon.setIsNearRange(true);
    } else if (!weapon.getIsLongRange()) {
      weapon.setIsLongRange(true);
    }
  }, [weapon]);
  const onClickDelete = useCallback(() => {
    assertGame(game);
    const message = weapon.actor
      ? "DeleteActorNamesEquipmentName"
      : "DeleteEquipmentName";

    confirmADoodleDo({
      message,
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmIconClass: "fa-trash",
      values: {
        ActorName: weapon.actor?.data.name ?? "",
        EquipmentName: weapon.data.name,
      },
    }).then(() => {
      weapon.delete();
    });
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
          value={weapon.data.data.ability}
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
