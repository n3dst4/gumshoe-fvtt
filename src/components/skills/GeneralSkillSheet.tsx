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

type GeneralSkillSheetProps = {
  entity: TrailItem,
  foundryWindow: Application,
};

const defaultSpendOptions = new Array(8).fill(null).map((_, i) => {
  const label = i.toString();
  return { label, value: label, enabled: true };
});

export const GeneralSkillSheet: React.FC<GeneralSkillSheetProps> = ({
  entity,
  foundryWindow,
}) => {
  const updateName = useUpdate(entity, (name) => ({ name }));
  const updateRating = useUpdate(entity, (rating) => ({ data: { rating } }));
  const updatePool = useUpdate(entity, (pool) => ({ data: { pool } }));
  const updateHasSpeciality = useUpdate(entity, (hasSpeciality) => ({ data: { hasSpeciality } }));
  const updateSpeciality = useUpdate(entity, (speciality) => ({ data: { speciality } }));
  const updateCanBeInvestigative = useUpdate(entity, (canBeInvestigative) => ({ data: { canBeInvestigative } }));

  const onClickDelete = useCallback(() => {
    const message = entity.actor
      ? `Delete ${entity.actor.data.name}'s "${entity.data.name}" ability?`
      : `Delete the "${entity.data.name}" ability?`;

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
            entity.delete();
          },
        },
      },
      default: "two",
      // render: html => console.log("Register interactivity in the rendered dialog"),
      // close: html => console.log("This always is logged no matter which option is chosen"),
    });
    d.render(true);
  }, [entity]);

  const [spend, setSpend] = useState("0");

  const onTest = useCallback(() => {
    const roll = new Roll("1d6 + @spend", { spend });
    const label = `Rolling ${entity.name}`;
    roll.roll().toMessage({
      speaker: ChatMessage.getSpeaker({ actor: entity.actor }),
      flavor: label,
    });
    entity.update({ data: { pool: entity.data.data.pool - Number(spend) || 0 } });
    setSpend("0");
  }, [entity, spend]);

  const onSpend = useCallback(() => {
    const roll = new Roll("@spend", { spend });
    const label = `Ability pool spend for ${entity.name}`;
    roll.roll().toMessage({
      speaker: ChatMessage.getSpeaker({ actor: entity.actor }),
      flavor: label,
    });
    entity.update({ data: { pool: entity.data.data.pool - Number(spend) || 0 } });
    setSpend("0");
  }, [entity, spend]);

  const spendOptions = defaultSpendOptions.map((option) => ({
    ...option,
    enabled: option.value <= entity.data.data.pool,
  }));

  return (
    <CSSReset>
      <h1>
        General skill
      </h1>

      {/* Spending/testing area */}
      {entity.isOwned &&
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
          <AsyncTextInput value={entity.data.name} onChange={updateName} />
        </GridField>
        <GridField label="Rating">
          <AsyncNumberInput value={entity.data.data.rating} onChange={updateRating} />
        </GridField>
        <GridField label="Pool">
          <AsyncNumberInput value={entity.data.data.pool} onChange={updatePool} />
        </GridField>
        <GridField label="Has speciality?">
          <Checkbox
            checked={entity.data.data.hasSpeciality}
            onChange={(t) => {
              updateHasSpeciality(t);
            }}
          />
        </GridField>
        <GridField
          label="Speciality"
          css={{
            opacity: entity.data.data.hasSpeciality ? 1 : 0.3,
            transition: "opacity 0.5s",
          }}
        >
          <AsyncTextInput
            value={entity.data.data.speciality}
            onChange={updateSpeciality}
            disabled={!entity.data.data.hasSpeciality}
          />
        </GridField>
        <GridField label="Can be use investigatively?">
          <Checkbox
            checked={entity.data.data.canBeInvestigative}
            onChange={(t) => {
              updateCanBeInvestigative(t);
            }}
          />
        </GridField>
        {
          entity.actor &&
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
