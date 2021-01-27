/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback, useState } from "react";
import { generalAbility } from "../../constants";
import { TrailItem } from "../../module/TrailItem";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { CheckButtons } from "../inputs/CheckButtons";
import { GridField } from "../inputs/GridField";
import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { InputGrid } from "../inputs/InputGrid";

type WeaponAttackProps = {
  weapon: TrailItem,
};

const defaultSpendOptions = new Array(8).fill(null).map((_, i) => {
  const label = i.toString();
  return { label, value: label, enabled: true };
});

export const WeaponAttack: React.FC<WeaponAttackProps> = ({
  weapon,
}) => {
  const [spend, setSpend] = useState("0");
  const [bonusPool, setBonusPool] = useState(0);

  const ability = weapon.actor.items.find((item) => {
    return item.type === generalAbility && item.name === weapon.data.data.ability;
  });

  const spendOptions = defaultSpendOptions.map((option) => ({
    ...option,
    enabled: option.value <= ability.data.data.pool,
  }));

  const onPointBlank = useCallback(() => {
    const roll = new Roll("1d6 + @spend", { spend });
    const label = `Rolling ${ability.name} at point blank range`;
    roll.roll().toMessage({
      speaker: ChatMessage.getSpeaker({ actor: ability.actor }),
      flavor: label,
    });
    const currentPool = ability.getter("pool")();
    const poolHit = Math.max(0, Number(spend) - bonusPool);
    const newPool = Math.max(0, currentPool - poolHit);
    const newBonusPool = Math.max(0, bonusPool - Number(spend));
    ability.setter("pool")(newPool);
    setBonusPool(newBonusPool);
    setSpend("0");
  }, [ability, bonusPool, spend]);

  return (
    <Fragment>
      <InputGrid
        css={{
          border: "2px groove white",
          padding: "1em",
          marginBottom: "1em",
        }}
      >
        <GridField label="Spend">
          <CheckButtons
            onChange={setSpend}
            selected={spend}
            options={spendOptions}
          />
        </GridField>
        <GridFieldStacked>
          <div
            css={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <button css={{ flex: 1 }} disabled={!weapon.data.data.isPointBlank} onClick={onPointBlank}>
              Point Blank
            </button>
          </div>
        </GridFieldStacked>
      </InputGrid>
      <InputGrid>
      <GridField label="Bonus pool">
            <AsyncNumberInput
              onChange={setBonusPool}
              value={bonusPool}
            />
          </GridField>
          <GridField>
            <a onClick={() => ability.sheet.render(true)}>Open {ability.name} ability</a>
          </GridField>
      </InputGrid>
    </Fragment>
  );
};
