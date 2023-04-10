import React, { ChangeEvent, Fragment, useCallback, useState } from "react";
import { assertGame, confirmADoodleDo, getTranslated } from "../../functions";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { Translate } from "../Translate";
import { MwRefreshGroup } from "../../types";
import {
  assertAbilityDataSource,
  isGeneralAbilityDataSource,
} from "../../typeAssertions";
import { AsyncCheckbox } from "../inputs/AsyncCheckbox";
import { settings } from "../../settings";
import { UnlocksEditor } from "./UnlocksEditor";
import { SituationalModifiersEditor } from "./SituationalModifiersEditor";

type AbilityConfigProps = {
  ability: InvestigatorItem;
};

export const AbilityConfig: React.FC<AbilityConfigProps> = ({ ability }) => {
  assertGame(game);
  assertAbilityDataSource(ability.data);
  const isGeneral = isGeneralAbilityDataSource(ability.data);

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
        ActorName: ability.actor?.data.name ?? "",
        AbilityName: ability.data.name,
      },
    }).then(() => {
      ability.delete();
    });
  }, [ability]);

  const categories = isGeneral
    ? settings.generalAbilityCategories.get()
    : settings.investigativeAbilityCategories.get();

  const isRealCategory = categories.includes(ability.data.data.category);
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

  const selectedCat = selectCustomOption ? "" : ability.data.data.category;

  return (
    <InputGrid>
      <GridField label="Name">
        <AsyncTextInput value={ability.data.name} onChange={ability.setName} />
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
                value={ability.data.data.category}
                onChange={ability.setCategory}
              />
            )}
          </div>
        </div>
      </GridField>
      <GridField label="Min">
        <AsyncNumberInput
          max={ability.data.data.max}
          value={ability.data.data.min}
          onChange={ability.setMin}
        />
      </GridField>
      <GridField label="Max">
        <AsyncNumberInput
          min={ability.data.data.min}
          value={ability.data.data.max}
          onChange={ability.setMax}
        />
      </GridField>
      {settings.useNpcCombatBonuses.get() &&
        isGeneralAbilityDataSource(ability.data) && (
          <Fragment>
            <GridField label="Combat bonus">
              <AsyncNumberInput
                value={ability.data.data.combatBonus}
                onChange={ability.setCombatBonus}
              />
            </GridField>
            <GridField label="Damage bonus">
              <AsyncNumberInput
                value={ability.data.data.damageBonus}
                onChange={ability.setDamageBonus}
              />
            </GridField>
          </Fragment>
        )}
      <GridField label="Has Specialities?">
        <AsyncCheckbox
          checked={ability.data.data.hasSpecialities}
          onChange={(t) => {
            ability.setHasSpecialities(t);
          }}
        />
      </GridField>
      <GridField label="Occupational?">
        <AsyncCheckbox
          checked={ability.data.data.occupational}
          onChange={ability.setOccupational}
        />
      </GridField>
      {isGeneralAbilityDataSource(ability.data) && (
        <GridField label="Can be investigative?">
          <AsyncCheckbox
            checked={ability.data.data.canBeInvestigative}
            onChange={ability.setCanBeInvestigative}
          />
        </GridField>
      )}
      <GridField label="Show tracker?">
        <AsyncCheckbox
          checked={ability.data.data.showTracker}
          onChange={ability.setShowTracker}
        />
      </GridField>
      <GridField label="Exclude from general refresh?">
        <AsyncCheckbox
          checked={ability.data.data.excludeFromGeneralRefresh}
          onChange={ability.setExcludeFromGeneralRefresh}
        />
      </GridField>
      <GridField label="Include in 24h refresh?">
        <AsyncCheckbox
          checked={ability.data.data.refreshesDaily}
          onChange={ability.setRefreshesDaily}
        />
      </GridField>
      <GridField label="Hide if zero-rated?">
        <AsyncCheckbox
          checked={ability.data.data.hideIfZeroRated}
          onChange={ability.setHideIfZeroRated}
        />
      </GridField>
      {isGeneralAbilityDataSource(ability.data) && (
        <GridField label="Goes first in combat?">
          <AsyncCheckbox
            checked={ability.data.data.goesFirstInCombat}
            onChange={ability.setGoesFirstInCombat}
          />
        </GridField>
      )}
      {settings.useMwStyleAbilities.get() &&
        isGeneralAbilityDataSource(ability.data) && (
          <GridField label="Refresh group">
            <select
              value={ability.data.data.mwRefreshGroup}
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
