/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useState } from "react";
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
  const updateName = useUpdate(ability, (name) => ({ name }));
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

  const spendOptions = defaultSpendOptions.map((option) => ({
    ...option,
    enabled: option.value <= ability.data.data.pool,
  }));

  return (
    <CSSReset>
      <h1>
        General skill
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
                Simple Spend
              </button>
              <button css={{ flex: 1 }} onClick={onTest}>
                Test
                {" "}
                <i className="fa fa-dice"/>
              </button>
            </div>
          </GridFieldStacked>
        </InputGrid>
      }

      {/* regular editing stuiff */}
      <InputGrid>
        <GridField label="Name">
          <AsyncTextInput value={ability.data.name} onChange={updateName} />
        </GridField>
        <GridField label="Rating">
          <AsyncNumberInput value={ability.data.data.rating} onChange={updateRating} />
        </GridField>
        <GridField label="Pool">
          <AsyncNumberInput value={ability.data.data.pool} onChange={updatePool} />
        </GridField>
        <GridField label="Has speciality?">
          <Checkbox
            checked={ability.data.data.hasSpeciality}
            onChange={(t) => {
              updateHasSpeciality(t);
            }}
          />
        </GridField>
        <GridField
          label="Speciality"
          css={{
            opacity: ability.data.data.hasSpeciality ? 1 : 0.3,
            transition: "opacity 0.5s",
          }}
        >
          <AsyncTextInput
            value={ability.data.data.speciality}
            onChange={updateSpeciality}
            disabled={!ability.data.data.hasSpeciality}
          />
        </GridField>
        <GridField label="Can be use investigatively?">
          <Checkbox
            checked={ability.data.data.canBeInvestigative}
            onChange={(t) => {
              updateCanBeInvestigative(t);
            }}
          />
        </GridField>
        {
          ability.actor &&
          <GridField label="Delete skill">
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
