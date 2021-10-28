/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent, useCallback, useState } from "react";
import { confirmADoodleDo, isGeneralAbility } from "../../functions";
import { useUpdate } from "../../hooks/useUpdate";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { getGeneralAbilityCategories, getInvestigativeAbilityCategories } from "../../settingsHelpers";
import { Translate } from "../Translate";
import { assertAbilityDataSource, isGeneralAbilityDataSource } from "../../types";
import { AsyncCheckbox } from "../inputs/AsyncCheckbox";

type AbilityConfigProps = {
  ability: InvestigatorItem,
};

export const AbilityConfig: React.FC<AbilityConfigProps> = ({
  ability,
}) => {
  assertAbilityDataSource(ability.data);
  const isGeneral = isGeneralAbility(ability);

  const updateName = useUpdate(ability, (name) => ({ name }));
  const updateCategory = useUpdate(ability, (category) => ({ data: { category } }));
  const updateHasSpecialities = useUpdate(ability, (hasSpecialities) => ({ data: { hasSpecialities } }));
  const updateOccupational = useUpdate(ability, (occupational) => ({ data: { occupational } }));
  const updateCanBeInvestigative = useUpdate(ability, (canBeInvestigative) => ({ data: { canBeInvestigative } }));
  const updateShowTracker = useUpdate(ability, (showTracker) => ({ data: { showTracker } }));
  const updateExcludeFromGeneralRefresh = useUpdate(ability, (excludeFromGeneralRefresh) => ({ data: { excludeFromGeneralRefresh } }));
  const updateRefreshesDaily = useUpdate(ability, (refreshesDaily) => ({ data: { refreshesDaily } }));
  const updateGoesFirstInCombat = useUpdate(ability, (goesFirstInCombat) => ({ data: { goesFirstInCombat } }));
  const updateMax = useUpdate(ability, (max) => ({ data: { max } }));
  const updateMin = useUpdate(ability, (min) => ({ data: { min } }));

  const onClickDelete = useCallback(() => {
    const message = ability.actor
      ? "Delete {ActorName}'s \"{AbilityName}\" ability?"
      : "Delete the \"{AbilityName}\" ability?";

    confirmADoodleDo(
      message,
      "Delete",
      "Cancel",
      "fa-trash",
      {
        ActorName: ability.actor?.data.name ?? "",
        AbilityName: ability.data.name,
      },
      () => {
        ability.delete();
      },
    );
  }, [ability]);

  const categories = isGeneral ? getGeneralAbilityCategories() : getInvestigativeAbilityCategories();

  const isRealCategory = categories.includes(ability.data.data.category);
  const [showCustomField, setShowCustomField] = useState(!isRealCategory);
  const [selectCustomOption, setSelectCustomOption] = useState(!isRealCategory);

  const onChangeCategory = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    if (value === "") {
      setShowCustomField(true);
      setSelectCustomOption(true);
    } else {
      setSelectCustomOption(false);
      updateCategory(e.currentTarget.value);
    }
  }, [updateCategory]);

  const selectedCat = selectCustomOption ? "" : ability.data.data.category;

  // useEffect(() => {
  //   if (selectedCat === "") {
  //     setShowCustomField(true);
  //   }
  // }, [selectedCat]);

  return (
    <InputGrid>
      <GridField label="Name">
        <AsyncTextInput value={ability.data.name} onChange={updateName} />
      </GridField>
      <GridField label="Category">
        <div
          css={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div
            css={{
              // flex: 1,
            }}
          >
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
            {showCustomField &&
              <AsyncTextInput
                value={ability.data.data.category}
                onChange={updateCategory}
              />
            }
          </div>

        </div>
      </GridField>
      <GridField label="Min">
        <AsyncNumberInput
          max={ability.data.data.max}
          value={ability.data.data.min}
          onChange={updateMin}
        />
      </GridField>
      <GridField label="Max">
        <AsyncNumberInput
          min={ability.data.data.min}
          value={ability.data.data.max}
          onChange={updateMax}
        />
      </GridField>
      <GridField label="Has Specialities?">
        <AsyncCheckbox
          checked={ability.data.data.hasSpecialities}
          onChange={(t) => {
            updateHasSpecialities(t);
          }}
        />
      </GridField>
      <GridField label="Occupational?">
        <AsyncCheckbox
          checked={ability.data.data.occupational}
          onChange={(t) => {
            updateOccupational(t);
          }}
        />
      </GridField>
      {isGeneralAbilityDataSource(ability.data) && (
        <GridField label="Can be investigative?">
          <AsyncCheckbox
            checked={ability.data.data.canBeInvestigative}
            onChange={(t) => {
              updateCanBeInvestigative(t);
            }}
          />
        </GridField>
      )}
      <GridField label="Show tracker?">
        <AsyncCheckbox
          checked={ability.data.data.showTracker}
          onChange={(t) => {
            updateShowTracker(t);
          }}
        />
      </GridField>
      <GridField label="Exclude from general refresh?">
        <AsyncCheckbox
          checked={ability.data.data.excludeFromGeneralRefresh}
          onChange={(t) => {
            updateExcludeFromGeneralRefresh(t);
          }}
        />
      </GridField>
      <GridField label="Include in 24h refresh?">
        <AsyncCheckbox
          checked={ability.data.data.refreshesDaily}
          onChange={(t) => {
            updateRefreshesDaily(t);
          }}
        />
      </GridField>
      {
        isGeneralAbilityDataSource(ability.data) &&
          <GridField label="Goes first in combat?">
            <AsyncCheckbox
              checked={ability.data.data.goesFirstInCombat}
              onChange={(t) => {
                updateGoesFirstInCombat(t);
              }}
            />
          </GridField>
      }
      <GridField label="Delete ability">
        <button onClick={onClickDelete}><Translate>Delete</Translate></button>
      </GridField>
    </InputGrid>
  );
};
