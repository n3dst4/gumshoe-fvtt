/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { generalAbility } from "../../constants";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { ThemeContext } from "../../themes/ThemeContext";
import { assertWeaponDataSource, isAbilityDataSource, isPCDataSource, PCDataSource } from "../../types";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { CheckButtons } from "../inputs/CheckButtons";
import { GridField } from "../inputs/GridField";
import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { InputGrid } from "../inputs/InputGrid";
import { TextArea } from "../inputs/TextArea";
import { Translate } from "../Translate";
import { performAttack } from "./performAttack";

type WeaponAttackProps = {
  weapon: InvestigatorItem,
};

const defaultSpendOptions = new Array(8).fill(null).map((_, i) => {
  const label = i.toString();
  return { label, value: Number(label), enabled: true };
});

export const WeaponAttack: React.FC<WeaponAttackProps> = ({ weapon }) => {
  assertWeaponDataSource(weapon.data);
  const [spend, setSpend] = useState(0);
  const [bonusPool, setBonusPool] = useState(0);
  const theme = useContext(ThemeContext);

  const abilityName = weapon.data.data.ability;

  const ability: InvestigatorItem|undefined = weapon.actor?.items.find((item: InvestigatorItem) => {
    return (
      item.type === generalAbility && item.name === abilityName
    );
  });

  const pool = ability && isAbilityDataSource(ability.data) ? ability.data.data.pool : 0;

  const spendOptions = defaultSpendOptions.map((option) => ({
    ...option,
    enabled: option.value <= (pool + bonusPool),
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
    assertWeaponDataSource(weapon.data);
    basePerformAttack({
      rangeName: "point blank",
      rangeDamage: weapon.data.data.pointBlankDamage,
    });
  }, [basePerformAttack, weapon.data]);

  const onCloseRange = useCallback(() => {
    assertWeaponDataSource(weapon.data);
    basePerformAttack({
      rangeName: "close range",
      rangeDamage: weapon.data.data.closeRangeDamage,
    });
  }, [basePerformAttack, weapon.data]);

  const onNearRange = useCallback(() => {
    assertWeaponDataSource(weapon.data);
    basePerformAttack({
      rangeName: "close range",
      rangeDamage: weapon.data.data.nearRangeDamage,
    });
  }, [basePerformAttack, weapon.data]);

  const onLongRange = useCallback(() => {
    assertWeaponDataSource(weapon.data);
    basePerformAttack({
      rangeName: "long range",
      rangeDamage: weapon.data.data.longRangeDamage,
    });
  }, [basePerformAttack, weapon.data]);

  const weaponActorData = weapon.actor?.data;

  const [actorInitiativeAbility, setActorInitiativeAbility] = React.useState(
    weaponActorData && isPCDataSource(weaponActorData)
      ? weaponActorData.data.initiativeAbility
      : "",
  );

  useEffect(() => {
    const callback = (actor: Actor, diff: {_id: string, data: DeepPartial<PCDataSource>}, options: unknown, id: string) => {
      if (actor.data._id === weaponActorData?._id) {
        setActorInitiativeAbility(weaponActorData && isPCDataSource(weaponActorData)
          ? weaponActorData.data.initiativeAbility
          : "");
      }
    };
    Hooks.on("updateActor", callback);
    return () => {
      Hooks.off("updateActor", callback);
    };
  }, [weaponActorData]);

  const isAbilityUsed = actorInitiativeAbility === ability?.name;
  const onClickUseForInitiative = useCallback(
    (e: React.MouseEvent) => {
      if (ability) {
        weapon.actor?.update({
          data: {
            initiativeAbility: ability.name || "",
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
          background: theme.colors.backgroundSecondary,
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
                  <Translate>Out of ammo</Translate>
                </div>
            }
            <button
              css={{ lineHeight: 1, flex: 1 }}
              disabled={ammoFail || !weapon.data.data.isPointBlank}
              onClick={onPointBlank}
            >
              <Translate>Point Blank</Translate>
            </button>
            <button
              css={{ lineHeight: 1, flex: 1 }}
              disabled={ammoFail || !weapon.data.data.isCloseRange}
              onClick={onCloseRange}
            >
              <Translate>Close Range</Translate>
            </button>
            <button
              css={{ lineHeight: 1, flex: 1 }}
              disabled={ammoFail || !weapon.data.data.isNearRange}
              onClick={onNearRange}
            >
              <Translate>Near Range</Translate>
            </button>
            <button
              css={{ lineHeight: 1, flex: 1 }}
              disabled={ammoFail || !weapon.data.data.isLongRange}
              onClick={onLongRange}
            >
              <Translate>Long Range</Translate>
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
                  <Translate>Reload</Translate>
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
        <GridField noTranslate label={abilityName}>
          <a onClick={() => ability?.sheet?.render(true)}>
            <Translate
              values={{ AbilityName: ability?.name ?? "" }}
            >
              Open (ability name) ability
            </Translate>
          </a>
        </GridField>
        <GridField label="">
          {isAbilityUsed
            ? (
            <i>
              <Translate>This ability is currently being used for combat ordering</Translate>
            </i>
              )
            : (
            <span>
              <a onClick={onClickUseForInitiative}>
                <Translate
                  values={{ AbilityName: ability?.name ?? "" }}
                >
                  Use (ability name) for combat ordering
                </Translate>

              </a>{" "}
              (
              <Translate
                values={{ AbilityName: actorInitiativeAbility || "nothing" }}
              >
                Currently using (ability name)
              </Translate>
              )
            </span>
              )}
        </GridField>
      </InputGrid>
    </Fragment>
  );
};
