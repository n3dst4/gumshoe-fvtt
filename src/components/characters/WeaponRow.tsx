import React, { Fragment, useCallback, useContext, useState, useMemo } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { FoundryAppContext } from "../FoundryAppContext";
import { CheckButtons } from "../inputs/CheckButtons";
import { generalAbility } from "../../constants";
import { assertWeaponDataSource, isAbilityDataSource } from "../../typeAssertions";
import { performAttack } from "../equipment/performAttack";

type WeaponRowProps = {
  weapon: InvestigatorItem,
};

export const WeaponRow: React.FC<WeaponRowProps> = ({
  weapon,
}) => {
  assertWeaponDataSource(weapon.data);

  const app = useContext(FoundryAppContext);
  const onDragStart = useCallback((e: React.DragEvent<HTMLAnchorElement>) => {
    if (app !== null) {
      (app as any)._onDragStart(e);
    }
  }, [app]);
  const [hover, setHover] = useState(false);
  const onMouseOver = useCallback(() => { setHover(true); }, []);
  const onMouseOut = useCallback(() => { setHover(false); }, []);
  const makeRangeOption = (isRange: boolean, rangeDamage: number, id:number, hover: string) => {
    const totalDamage = weapon.getDamage() + rangeDamage;
    const label = isRange ? (totalDamage >= 0 ? "+" : "") + totalDamage.toString() : "-";
    return { label, value: id, enabled: isRange, rangeDamage, hover };
  };
  const rangeInfo = [
    makeRangeOption(weapon.getIsPointBlank(), weapon.getPointBlankDamage(), 0, "Point Blank"),
    makeRangeOption(weapon.getIsCloseRange(), weapon.getCloseRangeDamage(), 1, "Close Range"),
    makeRangeOption(weapon.getIsNearRange(), weapon.getNearRangeDamage(), 2, "Near Range"),
    makeRangeOption(weapon.getIsLongRange(), weapon.getLongRangeDamage(), 3, "Long Range"),
  ];
  const [rangeSelected, setRangeSelected] = useState(0);
  const ammoFail = weapon.getUsesAmmo() && weapon.getAmmo() <= 0;

  const abilityName = weapon.data.data.ability;
  const ability: InvestigatorItem|undefined = weapon.actor?.items.find((item: InvestigatorItem) => {
    return (
      item.type === generalAbility && item.name === abilityName
    );
  });
  const pool = ability && isAbilityDataSource(ability.data) ? ability.data.data.pool : 0;
  const [spend, setSpend] = useState(0);
  const [bonusPool, setBonusPool] = useState(0);
  const onClickInc = useCallback(() => {
    setSpend(s => s + 1);
  }, []);
  const onClickDec = useCallback(() => {
    setSpend(s => s - 1);
  }, []);

  const basePerformAttack = useMemo(() => {
    if (ability) {
      return performAttack({
        spend,
        bonusPool,
        setSpend,
        setBonusPool,
        ability,
        weapon,
      });
    } else {
      return () => {};
    }
  }, [ability, spend, weapon, bonusPool]);
  const onAttack = () => {
    basePerformAttack({
      rangeName: rangeInfo[rangeSelected].hover,
      rangeDamage: rangeInfo[rangeSelected].rangeDamage,
    });
  };

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
        {weapon.name}
      </a>
      {weapon.getUsesAmmo()
        ? <div css={{ gridColumn: 2 }}>
            <button
              css={{ width: "1.5em", padding: "0" }}
              onClick={weapon.reload}
            >
              <i className="fa fa-redo fa-xs"/>
            </button>
            &nbsp;
            {weapon.getAmmo()}/{weapon.getAmmoMax()}
          </div>
        : <div
          css={{ gridColumn: 2, textAlign: "center" }}>&mdash;</div>}
      <div css={{ gridColumn: 3 }} >
        <CheckButtons
          onChange={setRangeSelected}
          selected={rangeSelected}
          options={rangeInfo}
          size={1}
        />
      </div>
      <div
        css={{
          gridColumn: 4,
          display: "grid",
          gridTemplateColumns: "1.6em 1.6em",
        }}
      >
        <button
          css={{ gridColumn: "1" }}
          onClick={onClickDec}
          disabled={spend <= 0}
        >
          <i css={{ fontSize: "x-small" }} className="fa fa-minus" />
        </button>
        <button
          css={{ gridColumn: "2" }}
          onClick={onClickInc}
          disabled={spend >= pool}
        >
          <i css={{ fontSize: "x-small" }} className="fa fa-plus" />
        </button>
        <button
          css={{ gridColumn: 3, width: "4.1em" }}
          onClick={onAttack}
          disabled={ammoFail}
        >
          <i className="fa fa-dice" title="Test" />+{spend}
        </button>
      </div>
      <div
        css={{
          gridColumn: "1 / -1",
          paddingLeft: "1em",
          whiteSpace: "normal",
          maxHeight: "8em",
          overflow: "auto",
          marginBottom: "1em",
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: weapon.getNotes().html }} />
      </div>
    </Fragment>
  );
};
