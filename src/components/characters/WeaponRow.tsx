/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback, useState } from "react";
import { GumshoeItem } from "../../module/GumshoeItem";
type WeaponRowProps = {
  weapon: GumshoeItem,
};

export const WeaponRow: React.FC<WeaponRowProps> = ({
  weapon,
}) => {
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
    >
      {weapon.name}
    </a>
    <a
      css={{ gridColumn: 2 }}
      className={hover ? "hover" : ""}
      onClick={() => weapon.sheet?.render(true)}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {weapon.getAmmo()}
    </a>
    <a
      css={{ gridColumn: 3, overflow: "hidden", textOverflow: "ellipsis" }}
      className={hover ? "hover" : ""}
      onClick={() => weapon.sheet?.render(true)}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {weapon.getNotes()}
    </a>
  </Fragment>
  );
};
