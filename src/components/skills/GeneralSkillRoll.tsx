/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useState } from "react";
import { TrailItem } from "../../module/TrailItem";
import { CSSReset } from "../CSSReset";
import { CheckButtons } from "../inputs/CheckButtons";
import { GridField } from "../inputs/GridField";
import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { InputGrid } from "../inputs/InputGrid";

const defaultSpendOptions = new Array(8).fill(null).map((_, i) => {
  const label = i.toString();
  return { label, value: label, enabled: true };
});

type GeneralSkillRollProps = {
  entity: TrailItem,
  foundryWindow: Application,
};

export const GeneralSkillRoll: React.FC<GeneralSkillRollProps> = ({
  entity,
  foundryWindow,
}) => {
  const [spend, setSpend] = useState("0");

  const onRoll = useCallback(() => {
    const roll = new Roll("1d6 + @spend", { spend });
    const label = `Rolling ${entity.name}`;
    roll.roll().toMessage({
      speaker: ChatMessage.getSpeaker({ actor: entity.actor }),
      flavor: label,
    });
    entity.update({ data: { pool: entity.data.data.pool - Number(spend) || 0 } });
  }, [entity, spend]);

  const openSheet = useCallback(() => {
    entity.sheet.render(true);
    foundryWindow.close();
  }, [entity.sheet, foundryWindow]);

  const spendOptions = defaultSpendOptions.map((option) => ({
    ...option,
    enabled: option.value <= entity.data.data.pool,
  }));

  return (
    <CSSReset>
      <h1>
        {entity.name}
        <button
          css={{
            float: "right",
            width: "auto",
          }}
          onClick={openSheet}
        >
          Edit Skill
        </button>
      </h1>
      <InputGrid>
        <GridField label="Pool">
          <span css={{ fontWeight: "bold", fontSize: "1.4em" }}>{entity.data.data.pool}</span>
        </GridField>
        <GridField label="Spend">
          <CheckButtons
            onChange={setSpend}
            selected={spend}
            options={spendOptions}
          />
        </GridField>
        <GridFieldStacked>
          <button onClick={onRoll}>Roll!</button>
        </GridFieldStacked>
      </InputGrid>
    </CSSReset>
  );
};
