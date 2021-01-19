/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { TrailItem } from "../module/TrailItem";
import { CSSReset } from "./CSSReset";
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
        General skill roll
      </h1>
        {entity.name} <button onClick={openSheet}>Edit skill</button>
        <button onClick={onRoll}>Roll!</button>
    </CSSReset>
  );
};
