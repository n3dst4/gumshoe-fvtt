/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback, useContext, useState } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { ActorSheetAppContext } from "../FoundryAppContext";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { AsyncCheckbox } from "../inputs/AsyncCheckbox";
import { ThemeContext } from "../../themes/ThemeContext";

type WeaponRowEditProps = {
  weapon: InvestigatorItem,
};

export const WeaponRowEdit: React.FC<WeaponRowEditProps> = ({
  weapon,
}) => {
  const theme = useContext(ThemeContext);
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
      <div css={{ gridColumn: 2, display: "flex" }}>
        <AsyncNumberInput
          min={0}
          value={weapon.getDamage()}
          onChange={weapon.setDamage}
          noPlusMinus={true}
          css={{ width: "3em", paddingRight: "1.5em" }}
        />
        { weapon.getIsPointBlank() && (
          <AsyncNumberInput
            min={0}
            value={weapon.getPointBlankDamage()}
            onChange={weapon.setPointBlankDamage}
            noPlusMinus={true}
            css={{ width: "1.5em" }}
          />
        )}
        { weapon.getIsCloseRange() && "/" }
        { weapon.getIsCloseRange() && (
          <AsyncNumberInput
            min={0}
            value={weapon.getCloseRangeDamage()}
            onChange={weapon.setCloseRangeDamage}
            noPlusMinus={true}
            css={{ width: "1.5em" }}
          />
        )}
        { weapon.getIsNearRange() && "/" }
        { weapon.getIsNearRange() && (
          <AsyncNumberInput
            min={0}
            value={weapon.getNearRangeDamage()}
            onChange={weapon.setNearRangeDamage}
            noPlusMinus={true}
            css={{ width: "1.5em" }}
          />
        )}
        { weapon.getIsLongRange() && "/" }
        { weapon.getIsLongRange() && (
          <AsyncNumberInput
            min={0}
            value={weapon.getLongRangeDamage()}
            onChange={weapon.setLongRangeDamage}
            noPlusMinus={true}
            css={{ width: "1.5em" }}
          />
        )}
      </div>
      <div css={{ gridColumn: 3, display: "flex" }}>
        <AsyncCheckbox
          checked={weapon.getUsesAmmo()}
          onChange={weapon.setUsesAmmo}
        />
        {weapon.getUsesAmmo() && (
          <span css={{ display: "flex" }}>
            <AsyncNumberInput
              min={0}
              value={weapon.getAmmo()}
              onChange={weapon.setAmmo}
              noPlusMinus={true}
              css={{ width: "2em" }}
            />
            {"/"}
            <AsyncNumberInput
              min={0}
              value={weapon.getAmmoMax()}
              onChange={weapon.setAmmoMax}
              noPlusMinus={true}
              css={{ width: "2em" }}
            />
          </span>
        )}
      </div>
      <div
        css={{
          gridColumn: "1 / -1",
          padding: "0.5em 0.5em 0.5em 1em",
          maxHeight: "6em",
          overflow: "auto",
          whiteSpace: "normal",
          margin: "0.5em",
          border: `1px solid ${theme.colors.text}`,
        }}
        dangerouslySetInnerHTML={{ __html: weapon.data.data.notes.html }}
      />
    </Fragment>
  );
};
