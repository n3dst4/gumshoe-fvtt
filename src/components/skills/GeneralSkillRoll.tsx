/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useState } from "react";
import { TrailItem } from "../../module/TrailItem";
import { CSSReset } from "../CSSReset";
import { CheckButtons } from "../inputs/CheckButtons";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";

const spendOptions = new Array(8).fill(null).map((_, i) => {
  const label = i.toString();
  return { label, value: label };
});

type GeneralSkillRollProps = {
  entity: TrailItem,
  foundryWindow: Application,
};

export const GeneralSkillRoll: React.FC<GeneralSkillRollProps> = ({
  entity,
  foundryWindow,
}) => {
  const onRoll = useCallback(() => {
    const roll = new Roll("1d6", {});
    const label = `Rolling ${entity.name}`;
    roll.roll().toMessage({
      speaker: ChatMessage.getSpeaker({ actor: entity.actor }),
      flavor: label,
    });
  }, [entity.actor, entity.name]);

  const openSheet = useCallback(() => {
    entity.sheet.render(true);
    foundryWindow.close();
  }, [entity.sheet, foundryWindow]);

  const [spend, setSpend] = useState("0");

  return (
    <CSSReset>
      <h1>
        {entity.name}
        <i
          className="fa fa-edit"
          onClick={openSheet}
        />
      </h1>
      <InputGrid>
        <GridField label="Spend">
          <CheckButtons
            onChange={setSpend}
            selected={spend}
            options={spendOptions}
          />
        </GridField>
      </InputGrid>
      <button onClick={onRoll}>Roll!</button>
    </CSSReset>
  );
};
