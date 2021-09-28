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
        css={{ gridColumn: 2 }}
        className={hover ? "hover" : ""}
        onClick={() => weapon.sheet?.render(true)}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        data-item-id={weapon.id}
        onDragStart={onDragStart}
        draggable="true"
      >
        {weapon.getUsesAmmo() ? weapon.getAmmo() : <span>&mdash;</span>}
      </a>
      <a
        css={{ gridColumn: 3, overflow: "hidden", textOverflow: "ellipsis" }}
        className={hover ? "hover" : ""}
        onClick={() => weapon.sheet?.render(true)}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        data-item-id={weapon.id}
        onDragStart={onDragStart}
        draggable="true"
      >
        {weapon.getNotes()}
      </a>
    </Fragment>
  );
};
