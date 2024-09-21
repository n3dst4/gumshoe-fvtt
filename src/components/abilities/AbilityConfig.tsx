import React, { ChangeEvent, Fragment, useCallback, useState } from "react";

import { confirmADoodleDo } from "../../functions/confirmADoodleDo";
import { getTranslated } from "../../functions/getTranslated";
import { assertGame } from "../../functions/utilities";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { settings } from "../../settings/settings";
import { MwRefreshGroup, SpecialitiesMode } from "../../types";
import {
  assertAbilityItem,
  isGeneralAbilityItem,
  isInvestigativeAbilityItem,
} from "../../v10Types";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { Button } from "../inputs/Button";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { Toggle } from "../inputs/Toggle";
import { Translate } from "../Translate";
import { SituationalModifiersEditor } from "./SituationalModifiersEditor";
import { UnlocksEditor } from "./UnlocksEditor";

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

    void confirmADoodleDo({
      message,
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmIconClass: "fa-trash",
      resolveFalseOnCancel: true,
      values: {
        ActorName: ability.actor?.name ?? "",
        AbilityName: ability.name ?? "",
      },
    }).then((yes) => {
      if (yes) {
        void ability.delete();
      }
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
        void ability.setCategory(e.currentTarget.value);
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
        <Toggle
          checked={ability.system.hasSpecialities}
          onChange={(t) => {
            void ability.setHasSpecialities(t);
          }}
        />
      </GridField>
      {ability.system.hasSpecialities && (
        <GridField label="Specialities Mode">
          <select
            value={ability.system.specialitiesMode}
            onChange={(t) => {
              void ability.setSpecialitiesMode(
                t.currentTarget.value as SpecialitiesMode,
              );
            }}
          >
            <option value="one">{getTranslated("One per rank")}</option>
            <option value="twoThreeFour">
              {getTranslated("+2/+3/+4 per rank")}
            </option>
          </select>
        </GridField>
      )}
      <GridField label="Occupational?">
        <Toggle
          checked={ability.system.occupational}
          onChange={ability.setOccupational}
        />
      </GridField>
      {isGeneralAbilityItem(ability) && (
        <GridField label="Can be investigative?">
          <Toggle
            checked={ability.system.canBeInvestigative}
            onChange={ability.setCanBeInvestigative}
          />
        </GridField>
      )}
      <GridField label="Show tracker?">
        <Toggle
          checked={ability.system.showTracker}
          onChange={ability.setShowTracker}
        />
      </GridField>
      <GridField label="Exclude from general refresh?">
        <Toggle
          checked={ability.system.excludeFromGeneralRefresh}
          onChange={ability.setExcludeFromGeneralRefresh}
        />
      </GridField>
      <GridField label="Include in 24h refresh?">
        <Toggle
          checked={ability.system.refreshesDaily}
          onChange={ability.setRefreshesDaily}
        />
      </GridField>
      <GridField label="Hide if zero-rated?">
        <Toggle
          checked={ability.system.hideIfZeroRated}
          onChange={ability.setHideIfZeroRated}
        />
      </GridField>
      {isGeneralAbilityItem(ability) && (
        <GridField label="Goes first in combat?">
          <Toggle
            checked={ability.system.goesFirstInCombat}
            onChange={ability.setGoesFirstInCombat}
          />
        </GridField>
      )}
      {isGeneralAbilityItem(ability) && (
        <GridField label="IsAPushPool">
          <Toggle
            checked={ability.system.isPushPool}
            onChange={ability.setIsPushPool}
          />
        </GridField>
      )}
      <GridField label="AllowPoolToExceedRating">
        <Toggle
          checked={ability.system.allowPoolToExceedRating}
          onChange={ability.setAllowPoolToExceedRating}
        />
      </GridField>
      {isInvestigativeAbilityItem(ability) && (
        <GridField label="IsQuickShock">
          <Toggle
            checked={ability.system.isQuickShock}
            onChange={ability.setIsQuickShock}
          />
        </GridField>
      )}

      {settings.useMwStyleAbilities.get() && isGeneralAbilityItem(ability) && (
        <GridField label="Refresh group">
          <select
            value={ability.system.mwRefreshGroup}
            onChange={(e) => {
              void ability.setMwRefreshGroup(
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
        <Button
          onClick={onClickDelete}
          css={{
            margin: 0,
          }}
        >
          <Translate>Delete</Translate>
        </Button>
      </GridField>
    </InputGrid>
  );
};
