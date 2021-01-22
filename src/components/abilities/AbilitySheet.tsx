/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ChangeEvent, useCallback, useState } from "react";
import { useUpdate } from "../../hooks/useUpdate";
import { TrailItem } from "../../module/TrailItem";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { CSSReset } from "../CSSReset";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { CheckButtons } from "../inputs/CheckButtons";
import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { Checkbox } from "../inputs/Checkbox";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { isGeneralAbility, isInvestigativeAbility } from "../../functions";
import { abilityCategories } from "../../constants";
import system from "../../system.json";

type AbilitySheetProps = {
  ability: TrailItem,
  foundryWindow: Application,
};

const defaultSpendOptions = new Array(8).fill(null).map((_, i) => {
  const label = i.toString();
  return { label, value: label, enabled: true };
});

export const AbilitySheet: React.FC<AbilitySheetProps> = ({
  ability,
  foundryWindow,
}) => {
  const isInvestigative = isInvestigativeAbility(ability);
  const isGeneral = isGeneralAbility(ability);

  const updateName = useUpdate(ability, (name) => ({ name }));
  const updateCategory = useUpdate(ability, (category) => ({ data: { category } }));
  const updateRating = useUpdate(ability, (rating) => ({ data: { rating } }));
  const updatePool = useUpdate(ability, (pool) => ({ data: { pool } }));
  const updateHasSpeciality = useUpdate(ability, (hasSpeciality) => ({ data: { hasSpeciality } }));
  const updateSpeciality = useUpdate(ability, (speciality) => ({ data: { speciality } }));
  const updateCanBeInvestigative = useUpdate(ability, (canBeInvestigative) => ({ data: { canBeInvestigative } }));

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

  const [spend, setSpend] = useState("0");

  const onTest = useCallback(() => {
    const roll = new Roll("1d6 + @spend", { spend });
    const label = `Rolling ${ability.name}`;
    roll.roll().toMessage({
      speaker: ChatMessage.getSpeaker({ actor: ability.actor }),
      flavor: label,
    });
    ability.update({ data: { pool: ability.data.data.pool - Number(spend) || 0 } });
    setSpend("0");
  }, [ability, spend]);

  const onSpend = useCallback(() => {
    const roll = new Roll("@spend", { spend });
    const label = `Ability pool spend for ${ability.name}`;
    roll.roll().toMessage({
      speaker: ChatMessage.getSpeaker({ actor: ability.actor }),
      flavor: label,
    });
    ability.update({ data: { pool: ability.data.data.pool - Number(spend) || 0 } });
    setSpend("0");
  }, [ability, spend]);

  const {
    // display,
    contentEditableRef: contentEditableRefName,
    onBlur: onBlurName,
    onFocus: onFocusName,
    onInput: onInputName,
  } = useAsyncUpdate(ability.data.name, updateName);

  const spendOptions = defaultSpendOptions.map((option) => ({
    ...option,
    enabled: option.value <= ability.data.data.pool,
  }));

  const onClickRefresh = useCallback(() => {
    ability.refreshPool();
  }, [ability]);

  const categories = game.settings.get(system.name, abilityCategories).split(",").map(x => x.trim());

  const onChangeCategory = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    updateCategory(e.currentTarget.value);
  }, [updateCategory]);

  return (
    <CSSReset>
      <div>
        {isGeneral ? "General" : "Investigative"} ability
      </div>

      <h1>
        <span
          contentEditable
          css={{
            minWidth: "1em",
            display: "inline-block",
          }}
          ref={contentEditableRefName}
          onInput={onInputName}
          onBlur={onBlurName}
          onFocus={onFocusName}
        />
      </h1>

      {/* Spending/testing area */}
      {ability.isOwned &&
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
              <button
                css={{ flex: 1 }}
                disabled={spend === "0"}
                onClick={onSpend}
              >
                {isGeneral ? "Simple Spend" : "Spend"}
              </button>
              {isGeneral &&
                <button css={{ flex: 1 }} onClick={onTest}>
                  Test
                  {" "}
                  <i className="fa fa-dice"/>
                </button>
              }
            </div>
          </GridFieldStacked>
        </InputGrid>
      }

      {/* regular editing stuiff */}
      <InputGrid>
        <GridField label="Name">
          <AsyncTextInput value={ability.data.name} onChange={updateName} />
        </GridField>
        {isInvestigative &&
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
        }
        <GridField label="Rating">
          <AsyncNumberInput
            min={0}
            value={ability.data.data.rating}
            onChange={updateRating}
          />
        </GridField>
        <GridField label="Pool">
          <div
            css={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <AsyncNumberInput
              min={0}
              max={ability.data.data.rating}
              value={ability.data.data.pool}
              onChange={updatePool}
              css={{
                flex: 1,
              }}
            />
            <button
              css={{
                flexBasis: "min-content",
                flex: 0,
                lineHeight: "inherit",
              }}
              onClick={onClickRefresh}
            >
              Refresh
            </button>
          </div>
        </GridField>
        <GridField label="Speciality?">
          <div
            css={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Checkbox
              checked={ability.data.data.hasSpeciality}
              onChange={(t) => {
                updateHasSpeciality(t);
              }}
            />
            <AsyncTextInput
              value={ability.data.data.speciality}
              onChange={updateSpeciality}
              disabled={!ability.data.data.hasSpeciality}
              css={{
                opacity: ability.data.data.hasSpeciality ? 1 : 0.3,
                transition: "opacity 0.5s",
              }}
            />

          </div>
        </GridField>
        {isGeneral &&
          <GridField label="Can be investigative?">
            <Checkbox
              checked={ability.data.data.canBeInvestigative}
              onChange={(t) => {
                updateCanBeInvestigative(t);
              }}
            />
          </GridField>
        }
        {
          ability.actor &&
          <GridField label="Delete ability">
            <button
              onClick={onClickDelete}
            >
              Delete
            </button>

          </GridField>

        }

      </InputGrid>
    </CSSReset>
  );
};
