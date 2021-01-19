/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { TrailItem } from "../../module/TrailItem";
import { CSSReset } from "../CSSReset";
import { InputGrid } from "../inputs/InputGrid";
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
      </InputGrid>
      <button onClick={onRoll}>Roll!</button>
    </CSSReset>
  );
};
