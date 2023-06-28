import React, { ChangeEvent, Fragment, useCallback, useState } from "react";
import { assertGame, confirmADoodleDo, getTranslated } from "../../functions";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { Translate } from "../Translate";
import { MwRefreshGroup } from "../../types";
import { AsyncCheckbox } from "../inputs/AsyncCheckbox";
import { settings } from "../../settings";
import { UnlocksEditor } from "./UnlocksEditor";
import { SituationalModifiersEditor } from "./SituationalModifiersEditor";
import { assertAbilityItem, isGeneralAbilityItem } from "../../v10Types";

type AbilityConfigProps = {
  ability: InvestigatorItem;
};

export const AbilityConfig: React.FC<AbilityConfigProps> = ({ ability }) => {
  assertGame(game);
  assertAbilityItem(ability);
  const isGeneral = isGeneralAbilityItem(ability);

  const onClickDelete = useCallback(() => {
    const message = ability.actor
      ? 'Delete {ActorName}\'s "{AbilityName}" ability?'
      : 'Delete the "{AbilityName}" ability?';

    confirmADoodleDo({
      message,
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmIconClass: "fa-trash",
      values: {
        ActorName: ability.actor?.name ?? "",
        AbilityName: ability.name ?? "",
      },
    }).then(() => {
      ability.delete();
    });
  }, [ability]);

  const categories = isGeneral
    ? settings.generalAbilityCategories.get()
    : settings.investigativeAbilityCategories.get();

  const isRealCategory = categories.includes(ability.system.category);
  const [showCustomField, setShowCustomField] = useState(!isRealCategory);
  const [selectCustomOption, setSelectCustomOption] = useState(!isRealCategory);

  const onChangeCategory = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.currentTarget.value;
      if (value === "") {
        setShowCustomField(true);
        setSelectCustomOption(true);
      } else {
        setSelectCustomOption(false);
        ability.setCategory(e.currentTarget.value);
      }
    },
    [ability],
  );

  const selectedCat = selectCustomOption ? "" : ability.system.category;

  return (
    <InputGrid>
      <GridField label="Item Name">
        <AsyncTextInput value={ability.name ?? ""} onChange={ability.setName} />
      </GridField>
      <GridField label="Category">
        <div
          css={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div>
            <select
              value={selectedCat}
              onChange={onChangeCategory}
              css={{
                lineHeight: "inherit",
                height: "inherit",
              }}
            >
              {categories.map<JSX.Element>((cat: string) => (
                <option key={cat}>{cat}</option>
              ))}
              <option value="">Custom</option>
            </select>
          </div>
          <div
            css={{
              flex: 1,
            }}
          >
            {showCustomField && (
              <AsyncTextInput
                value={ability.system.category}
                onChange={ability.setCategory}
              />
            )}
          </div>
        </div>
      </GridField>
      <GridField label="Min">
        <AsyncNumberInput
          max={ability.system.max}
          value={ability.system.min}
          onChange={ability.setMin}
        />
      </GridField>
      <GridField label="Max">
        <AsyncNumberInput
          min={ability.system.min}
          value={ability.system.max}
          onChange={ability.setMax}
        />
      </GridField>
      {settings.useNpcCombatBonuses.get() && isGeneralAbilityItem(ability) && (
        <Fragment>
          <GridField label="Combat bonus">
            <AsyncNumberInput
              value={ability.system.combatBonus}
              onChange={ability.setCombatBonus}
            />
          </GridField>
          <GridField label="Damage bonus">
            <AsyncNumberInput
              value={ability.system.damageBonus}
              onChange={ability.setDamageBonus}
            />
          </GridField>
        </Fragment>
      )}
      <GridField label="Has Specialities?">
        <AsyncCheckbox
          checked={ability.system.hasSpecialities}
          onChange={(t) => {
            ability.setHasSpecialities(t);
          }}
        />
      </GridField>
      <GridField label="Occupational?">
        <AsyncCheckbox
          checked={ability.system.occupational}
          onChange={ability.setOccupational}
        />
      </GridField>
      {isGeneralAbilityItem(ability) && (
        <GridField label="Can be investigative?">
          <AsyncCheckbox
            checked={ability.system.canBeInvestigative}
            onChange={ability.setCanBeInvestigative}
          />
        </GridField>
      )}
      <GridField label="Show tracker?">
        <AsyncCheckbox
          checked={ability.system.showTracker}
          onChange={ability.setShowTracker}
        />
      </GridField>
      <GridField label="Exclude from general refresh?">
        <AsyncCheckbox
          checked={ability.system.excludeFromGeneralRefresh}
          onChange={ability.setExcludeFromGeneralRefresh}
        />
      </GridField>
      <GridField label="Include in 24h refresh?">
        <AsyncCheckbox
          checked={ability.system.refreshesDaily}
          onChange={ability.setRefreshesDaily}
        />
      </GridField>
      <GridField label="Hide if zero-rated?">
        <AsyncCheckbox
          checked={ability.system.hideIfZeroRated}
          onChange={ability.setHideIfZeroRated}
        />
      </GridField>
      {isGeneralAbilityItem(ability) && (
        <GridField label="Goes first in combat?">
          <AsyncCheckbox
            checked={ability.system.goesFirstInCombat}
            onChange={ability.setGoesFirstInCombat}
          />
        </GridField>
      )}
      {settings.useMwStyleAbilities.get() && isGeneralAbilityItem(ability) && (
        <GridField label="Refresh group">
          <select
            value={ability.system.mwRefreshGroup}
            onChange={(e) => {
              ability.setMwRefreshGroup(
                Number(e.currentTarget.value) as MwRefreshGroup,
              );
            }}
          >
            <option value="2">{getTranslated("XHours", { x: "2" })}</option>
            <option value="4">{getTranslated("XHours", { x: "4" })}</option>
            <option value="8">{getTranslated("XHours", { x: "8" })}</option>
          </select>
        </GridField>
      )}
      <GridField label="Unlocks">
        <UnlocksEditor ability={ability} />
      </GridField>
      <GridField label="Situational Modifiers">
        <SituationalModifiersEditor ability={ability} />
      </GridField>
      <GridField label="Delete ability">
        <button
          onClick={onClickDelete}
          css={{
            margin: 0,
          }}
        >
          <Translate>Delete</Translate>
        </button>
      </GridField>
    </InputGrid>
  );
};
