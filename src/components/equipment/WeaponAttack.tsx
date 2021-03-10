/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback, useContext, useMemo, useState } from "react";
import { generalAbility } from "../../constants";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { GumshoeItem } from "../../module/GumshoeItem";
import { ThemeContext } from "../../theme";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { CheckButtons } from "../inputs/CheckButtons";
import { GridField } from "../inputs/GridField";
import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { InputGrid } from "../inputs/InputGrid";
import { TextArea } from "../inputs/TextArea";
import { performAttack } from "./performAttack";

type WeaponAttackProps = {
  weapon: GumshoeItem,
};

const defaultSpendOptions = new Array(8).fill(null).map((_, i) => {
  const label = i.toString();
  return { label, value: label, enabled: true };
});

export const WeaponAttack: React.FC<WeaponAttackProps> = ({ weapon }) => {
  const [spend, setSpend] = useState("0");
  const [bonusPool, setBonusPool] = useState(0);
  const theme = useContext(ThemeContext);

  const abilityName = weapon.data.data.ability;

  const ability: GumshoeItem|undefined = weapon?.actor?.items.find((item: GumshoeItem) => {
    return (
      item.type === generalAbility && item.name === abilityName
    );
  });

  const spendOptions = defaultSpendOptions.map((option) => ({
    ...option,
    enabled: option.value <= ability?.data.data.pool + bonusPool,
  }));

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
  }, [ability, bonusPool, spend, weapon]);

  const notes = useAsyncUpdate(weapon.getNotes(), weapon.setNotes);

  const onPointBlank = useCallback(() => {
    basePerformAttack({
      description: "point blank",
      rangeDamage: weapon.data.data.pointBlankDamage,
    });
  }, [basePerformAttack, weapon.data.data.pointBlankDamage]);

  const onCloseRange = useCallback(() => {
    basePerformAttack({
      description: "close range",
      rangeDamage: weapon.data.data.closeRangeDamage,
    });
  }, [basePerformAttack, weapon.data.data.closeRangeDamage]);

  const onNearRange = useCallback(() => {
    basePerformAttack({
      description: "close range",
      rangeDamage: weapon.data.data.nearRangeDamage,
    });
  }, [basePerformAttack, weapon.data.data.nearRangeDamage]);

  const onLongRange = useCallback(() => {
    basePerformAttack({
      description: "long range",
      rangeDamage: weapon.data.data.longRangeDamage,
    });
  }, [basePerformAttack, weapon.data.data.longRangeDamage]);

  const actorInitiativeAbility = weapon.actor?.data.data.initiativeAbility;
  const isAbilityUsed = actorInitiativeAbility === ability?.name;
  const onClickUseForInitiative = useCallback(
    (e: React.MouseEvent) => {
      if (ability) {
        weapon.actor?.update({
          data: {
            initiativeAbility: ability.name,
          },
        });
      }
    },
    [ability, weapon.actor],
  );

  const ammoFail = weapon.getUsesAmmo() && weapon.getAmmo() <= 0;

  return (
    <Fragment>
      <InputGrid
        css={{
          border: `1px solid ${theme.colors.text}`,
          padding: "1em",
          marginBottom: "0.5em",
          background: theme.colors.bgTransSecondary,
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
              position: "relative",
            }}
          >
            {
              ammoFail &&
                <div
                  css={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "1.2em",
                    backgroundColor: theme.colors.accentContrast,
                    color: theme.colors.accent,
                    padding: "0 1em",
                  }}
                >
                  Out of ammo
                </div>
            }
            <button
              css={{ lineHeight: 1, flex: 1 }}
              disabled={ammoFail || !weapon.data.data.isPointBlank}
              onClick={onPointBlank}
            >
              Point Blank
            </button>
            <button
              css={{ lineHeight: 1, flex: 1 }}
              disabled={ammoFail || !weapon.data.data.isCloseRange}
              onClick={onCloseRange}
            >
              Close Range
            </button>
            <button
              css={{ lineHeight: 1, flex: 1 }}
              disabled={ammoFail || !weapon.data.data.isNearRange}
              onClick={onNearRange}
            >
              Near Range
            </button>
            <button
              css={{ lineHeight: 1, flex: 1 }}
              disabled={ammoFail || !weapon.data.data.isLongRange}
              onClick={onLongRange}
            >
              Long Range
            </button>
          </div>
        </GridFieldStacked>
      </InputGrid>
      <InputGrid>
        {weapon.data.data.usesAmmo &&
            <GridField label="Ammo">
              <div
                css={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <button
                  css={{
                    flexBasis: "min-content",
                    flex: 0,
                    lineHeight: "inherit",
                  }}
                  onClick={weapon.reload}
                >
                  Reload
                </button>
                <AsyncNumberInput
                  css={{ flex: 1 }}
                  min={0}
                  max={weapon.getAmmoMax()}
                  value={weapon.getAmmo()}
                  onChange={weapon.setAmmo}
                />
              </div>
            </GridField>
        }

        <GridField label="Notes">
          <TextArea value={notes.display} onChange={notes.onChange} />
        </GridField>
        <GridField label="Bonus pool">
          <AsyncNumberInput onChange={setBonusPool} value={bonusPool} />
        </GridField>
        <GridField label={abilityName}>
          <a onClick={() => ability?.sheet.render(true)}>
            Open {ability?.name} ability
          </a>
        </GridField>
        <GridField label="">
          {isAbilityUsed
            ? (
            <i>
              This ability is currently being used for combat ordering
            </i>
              )
            : (
            <span>
              <a onClick={onClickUseForInitiative}>
                Use {ability?.name} for combat ordering
              </a>{" "}
              (Currently using {actorInitiativeAbility || "nothing"})
            </span>
              )}
        </GridField>
      </InputGrid>
    </Fragment>
  );
};
