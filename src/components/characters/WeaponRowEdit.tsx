/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback, useContext, useState } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { ActorSheetAppContext } from "../FoundryAppContext";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { AsyncCheckbox } from "../inputs/AsyncCheckbox";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { CompactNotesEditor } from "../inputs/CompactNotesEditor";
import { CombatAbilityDropDown } from "../inputs/CombatAbilityDropDown";
import { assertGame, confirmADoodleDo } from "../../functions";
import { assertWeaponDataSource } from "../../types";

type WeaponRowEditProps = {
  weapon: InvestigatorItem,
};

export const WeaponRowEdit: React.FC<WeaponRowEditProps> = ({
  weapon,
}) => {
  assertWeaponDataSource(weapon.data);

  const app = useContext(ActorSheetAppContext);
  const onDragStart = useCallback((e: React.DragEvent<HTMLAnchorElement>) => {
    if (app !== null) {
      (app as any)._onDragStart(e);
    }
  }, [app]);
  const [hover, setHover] = useState(false);
  const onMouseOver = useCallback(() => { setHover(true); }, []);
  const onMouseOut = useCallback(() => { setHover(false); }, []);
  const name = useAsyncUpdate(weapon.name || "", weapon.setName);

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

  return (
    <Fragment>
      <a
        css={{ gridColumn: 1, overflow: "hidden", textOverflow: "ellipsis" }}
        className={hover ? "hover" : ""}
        onClick={() => weapon.sheet?.render(true)}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        data-item-id={weapon.id}
        onDragStart={onDragStart}
        draggable="true"
      >
        <div
          contentEditable
          onInput={name.onInput}
          onFocus={name.onFocus}
          onBlur={name.onBlur}
          ref={name.contentEditableRef}
        />
      </a>
      <div css={{ gridColumn: 2, display: "flex" }}>
        <AsyncNumberInput
          min={0}
          value={weapon.getDamage()}
          onChange={weapon.setDamage}
          noPlusMinus={true}
          css={{ width: "2.3em", paddingRight: "0.3em" }}
        />
        <button
          css={{ width: "1.2em", padding: "0" }}
          onClick={weaponRangeReduce}
        >
        <i className="fa fa-chevron-left fa-xs"/>
        </button>
        { weapon.getIsPointBlank() && (
          <AsyncNumberInput
            min={0}
            value={weapon.getPointBlankDamage()}
            onChange={weapon.setPointBlankDamage}
            noPlusMinus={true}
            css={{ width: "1.5em" }}
          />
        )}
        { weapon.getIsCloseRange() && "/" }
        { weapon.getIsCloseRange() && (
          <AsyncNumberInput
            min={0}
            value={weapon.getCloseRangeDamage()}
            onChange={weapon.setCloseRangeDamage}
            noPlusMinus={true}
            css={{ width: "1.5em" }}
          />
        )}
        { weapon.getIsNearRange() && "/" }
        { weapon.getIsNearRange() && (
          <AsyncNumberInput
            min={0}
            value={weapon.getNearRangeDamage()}
            onChange={weapon.setNearRangeDamage}
            noPlusMinus={true}
            css={{ width: "1.5em" }}
          />
        )}
        { weapon.getIsLongRange() && "/" }
        { weapon.getIsLongRange() && (
          <AsyncNumberInput
            min={0}
            value={weapon.getLongRangeDamage()}
            onChange={weapon.setLongRangeDamage}
            noPlusMinus={true}
            css={{ width: "1.5em" }}
          />
        )}
        <button
          css={{ width: "1.2em", padding: "0" }}
          onClick={weaponRangeExpand}
        >
        <i className="fa fa-chevron-right fa-xs"/>
        </button>
      </div>
      <div css={{ gridColumn: 3, display: "flex" }}>
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
        css={{ gridColumn: 4 }}
        onClick={onClickDelete}
      >
        <i className="fa fa-trash fa-xs"/>
      </button>
      <span css={{ gridColumn: 1, margin: "0 0 1em 0em" }}>
      <CombatAbilityDropDown
        value={weapon.data.data.ability}
        onChange={(e) => weapon.setAbility(e)}
      />
      </span>
      <CompactNotesEditor
        note={weapon.getNotes()}
        onChange={weapon.setNotes}
      />
    </Fragment>
  );
};
