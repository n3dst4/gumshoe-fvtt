/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback, useContext, useState } from "react";
import { GumshoeItem } from "../../module/GumshoeItem";
import { ActorSheetAppContext } from "../FoundryAppContext";
type WeaponRowProps = {
  weapon: GumshoeItem,
};

export const WeaponRow: React.FC<WeaponRowProps> = ({
  weapon,
}) => {
  const app = useContext(ActorSheetAppContext);
  const onDragStart = useCallback((e: React.DragEvent<HTMLAnchorElement>) => {
    if (app !== null) {
      (app as any)._onDragStart(e);
    }
  }, [app]);
  const [hover, setHover] = useState(false);
  const onMouseOver = useCallback(() => { setHover(true); }, []);
  const onMouseOut = useCallback(() => { setHover(false); }, []);

  return (
    <Fragment>
      <a
        css={{ gridColumn: 1, overflow: "hidden", textOverflow: "ellipsis" }}
        className={hover ? "hover" : ""}
        onClick={() => weapon.sheet?.render(true)}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        data-item-id={weapon.id}
        onDragStart={onDragStart}
        draggable="true"
      >
        {weapon.name}
      </a>
      <a
        css={{ gridColumn: 2, overflow: "hidden", textOverflow: "ellipsis" }}
        className={hover ? "hover" : ""}
        onClick={() => weapon.sheet?.render(true)}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        data-item-id={weapon.id}
        onDragStart={onDragStart}
        draggable="true"
      >
        {weapon.getIsPointBlank() ? weapon.getDamage() + weapon.getPointBlankDamage() : <span>&ndash;</span>}/
        {weapon.getIsCloseRange() ? weapon.getDamage() + weapon.getCloseRangeDamage() : <span>&ndash;</span>}/
        {weapon.getIsNearRange() ? weapon.getDamage() + weapon.getNearRangeDamage() : <span>&ndash;</span>}/
        {weapon.getIsLongRange() ? weapon.getDamage() + weapon.getLongRangeDamage() : <span>&ndash;</span>}
      </a>
      <a
        css={{ gridColumn: 3 }}
        className={hover ? "hover" : ""}
        onClick={() => weapon.sheet?.render(true)}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        data-item-id={weapon.id}
        onDragStart={onDragStart}
        draggable="true"
      >
        {weapon.getUsesAmmo() ? <span>{weapon.getAmmo()}/{weapon.getAmmoMax()}</span> : <span>&mdash;</span>}
      </a>
      <div
        css={{ gridColumn: "1 / 3", paddingLeft: "1em" }}
      >
        {weapon.getNotes()}
      </div>
    </Fragment>
  );
};
