/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback, useContext } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { AsyncCheckbox } from "../inputs/AsyncCheckbox";
import { CompactNotesEditor } from "../inputs/CompactNotesEditor";
import { CombatAbilityDropDown } from "../inputs/CombatAbilityDropDown";
import { assertGame, confirmADoodleDo } from "../../functions";
import { assertWeaponDataSource } from "../../types";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { ThemeContext } from "../../themes/ThemeContext";

type WeaponRowEditProps = {
  weapon: InvestigatorItem,
  index: number,
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

  const gridRow = ((index) * 3) + 2;

  return (
    <Fragment>
      <div
        css={{
          gridColumn: "1/-1",
          gridRow: `${gridRow}/${gridRow + 2}`,
          background: theme.colors.backgroundButton,
          // margin: "0.5em",
        }}
      />
      <div
        css={{
          gridColumn: "1/-1",
          gridRow: `${gridRow + 2}/${gridRow + 3}`,
          height: "0.5em",
        }}
      />
      <AsyncTextInput
        css={{
          gridColumn: 1,
          gridRow,
          margin: "0.5em 0.5em 0 0.5em",
        }}
        value={weapon.name ?? ""}
        onChange={weapon.setName}
      />
      <div
        css={{
          gridColumn: 2,
          gridRow,
          display: "flex",
          margin: "0.5em 0 0 0",
        }}
      >
        <AsyncNumberInput
          value={weapon.getDamage()}
          onChange={weapon.setDamage}
          noPlusMinus={true}
          css={{ width: "2.3em", paddingRight: "0.3em" }}
        />
        <button
          css={{ width: "1em", padding: "0" }}
          onClick={weaponRangeReduce}
        >
        <i className="fa fa-chevron-left"/>
        </button>
        { weapon.getIsPointBlank() && (
          <AsyncNumberInput
            value={weapon.getPointBlankDamage()}
            onChange={weapon.setPointBlankDamage}
            noPlusMinus={true}
            css={{ width: "1.5em" }}
          />
        )}
        { weapon.getIsCloseRange() && "/" }
        { weapon.getIsCloseRange() && (
          <AsyncNumberInput
            value={weapon.getCloseRangeDamage()}
            onChange={weapon.setCloseRangeDamage}
            noPlusMinus={true}
            css={{ width: "1.5em" }}
          />
        )}
        { weapon.getIsNearRange() && "/" }
        { weapon.getIsNearRange() && (
          <AsyncNumberInput
            value={weapon.getNearRangeDamage()}
            onChange={weapon.setNearRangeDamage}
            noPlusMinus={true}
            css={{ width: "1.5em" }}
          />
        )}
        { weapon.getIsLongRange() && "/" }
        { weapon.getIsLongRange() && (
          <AsyncNumberInput
            value={weapon.getLongRangeDamage()}
            onChange={weapon.setLongRangeDamage}
            noPlusMinus={true}
            css={{ width: "1.5em" }}
          />
        )}
        <button
          css={{ width: "1em", padding: "0" }}
          onClick={weaponRangeExpand}
        >
        <i className="fa fa-chevron-right"/>
        </button>
      </div>
      <div
        css={{
          gridColumn: 3,
          display: "flex",
          gridRow,
          margin: "0.5em 0 0 0",
        }}
      >
        <AsyncCheckbox
          checked={weapon.getUsesAmmo()}
          onChange={weapon.setUsesAmmo}
        />
        {weapon.getUsesAmmo() && (
          <span css={{ display: "flex" }}>
            <AsyncNumberInput
              min={0}
              value={weapon.getAmmo()}
              onChange={weapon.setAmmo}
              noPlusMinus={true}
              css={{ width: "2em" }}
            />
            {"/"}
            <AsyncNumberInput
              min={0}
              value={weapon.getAmmoMax()}
              onChange={weapon.setAmmoMax}
              noPlusMinus={true}
              css={{ width: "2em" }}
            />
          </span>
        )}
      </div>
      <button
        css={{
          gridColumn: 4,
          gridRow,
          width: "1.6em",
          padding: "0",
          margin: "0.5em 0.5em 0 0",
        }}
        onClick={onClickDelete}
      >
        <i className="fa fa-trash"/>
      </button>
      <span
        css={{
          gridColumn: 1,
          gridRow: gridRow + 1,
          // margin: "0 0 1em 0em",
          margin: "0 0 0.5em 0.5em",
        }}
      >
        <CombatAbilityDropDown
          value={weapon.data.data.ability}
          onChange={(e) => weapon.setAbility(e)}
        />
      </span>
      <CompactNotesEditor
        css={{
          gridColumn: "2 / -1",
          gridRow: gridRow + 1,
          margin: "0 0.5em 0.5em 0",
        }}
        note={weapon.getNotes()}
        onChange={weapon.setNotes}
      />
    </Fragment>
  );
};
