/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent, useCallback } from "react";
import { isGeneralAbility, isInvestigativeAbility } from "../../functions";
import { useUpdate } from "../../hooks/useUpdate";
import { TrailItem } from "../../module/TrailItem";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import system from "../../system.json";
import { abilityCategories } from "../../constants";
import { Checkbox } from "../inputs/Checkbox";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";

type AbilityConfigProps = {
  ability: TrailItem,
};

export const AbilityConfig: React.FC<AbilityConfigProps> = ({
  ability,
}) => {
  const isInvestigative = isInvestigativeAbility(ability);
  const isGeneral = isGeneralAbility(ability);

  const updateName = useUpdate(ability, (name) => ({ name }));
  const updateCategory = useUpdate(ability, (category) => ({ data: { category } }));
  const updateHasSpecialities = useUpdate(ability, (hasSpecialities) => ({ data: { hasSpecialities } }));
  const updateOccupational = useUpdate(ability, (occupational) => ({ data: { occupational } }));
  const updateCanBeInvestigative = useUpdate(ability, (canBeInvestigative) => ({ data: { canBeInvestigative } }));
  const updateMax = useUpdate(ability, (max) => ({ data: { max } }));
  const updateMin = useUpdate(ability, (min) => ({ data: { min } }));

  const onClickDelete = useCallback(() => {
    const message = ability.actor
      ? `Delete ${ability.actor.data.name}'s "${ability.data.name}" ability?`
      : `Delete the "${ability.data.name}" ability?`;

    const d = new Dialog({
      title: "Confirm",
      content: `<p>${message}</p>`,
      buttons: {
        cancel: {
          icon: '<i class="fas fa-ban"></i>',
          label: "Cancel",
        },
        delete: {
          icon: '<i class="fas fa-trash"></i>',
          label: "Delete",
          callback: () => {
            ability.delete();
          },
        },
      },
      default: "two",
      // render: html => console.log("Register interactivity in the rendered dialog"),
      // close: html => console.log("This always is logged no matter which option is chosen"),
    });
    d.render(true);
  }, [ability]);

  const categories = game.settings.get(system.name, abilityCategories).split(",").map(x => x.trim());

  const onChangeCategory = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    updateCategory(e.currentTarget.value);
  }, [updateCategory]);

  return (
    <InputGrid>
      <GridField label="Name">
        <AsyncTextInput value={ability.data.name} onChange={updateName} />
      </GridField>
      {isInvestigative && (
        <GridField label="Category">
          <select
            value={ability.data.data.category}
            onChange={onChangeCategory}
            css={{
              lineHeight: "inherit",
              height: "inherit",
            }}
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          {/* <AsyncTextInput value={ability.data.data.category} onChange={updateCategory} /> */}
        </GridField>
      )}
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
        <Checkbox
          checked={ability.data.data.hasSpecialities}
          onChange={(t) => {
            updateHasSpecialities(t);
          }}
        />
      </GridField>
      <GridField label="Occupational?">
        <Checkbox
          checked={ability.data.data.occupational}
          onChange={(t) => {
            updateOccupational(t);
          }}
        />
      </GridField>
      {isGeneral && (
        <GridField label="Can be investigative?">
          <Checkbox
            checked={ability.data.data.canBeInvestigative}
            onChange={(t) => {
              updateCanBeInvestigative(t);
            }}
          />
        </GridField>
      )}
      {ability.actor && (
        <GridField label="Delete ability">
          <button onClick={onClickDelete}>Delete</button>
        </GridField>
      )}
    </InputGrid>
  );
};
