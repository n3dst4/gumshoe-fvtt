/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useEffect, useState } from "react";
import { GumshoeItem } from "../../module/GumshoeItem";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { WeaponConfig } from "./WeaponConfig";
import { WeaponAttack } from "./WeaponAttack";
import { Translate } from "../Translate";

type WeaponSheetProps = {
  weapon: GumshoeItem,
  foundryWindow: Application,
};

export const WeaponSheet: React.FC<WeaponSheetProps> = ({
  weapon,
  foundryWindow,
}) => {
  const name = useAsyncUpdate(weapon.name, weapon.setName);
  const [configMode, setConfigMode] = useState(false);
  useEffect(() => {
    foundryWindow.render();
  }, [foundryWindow, configMode]);
  return (
    <Fragment>
      <div>
        <Translate>Weapon</Translate>
        {weapon.isOwned && (
          <a
            css={{
              float: "right",
            }}
            onClick={() => {
              setConfigMode((mode) => !mode);
            }}
          >
            <i className={`fa fa-${configMode ? "check" : "cog"}`} />
          </a>
        )}
      </div>

      <h1
        contentEditable
        onInput={name.onInput}
        onFocus={name.onFocus}
        onBlur={name.onBlur}
        ref={name.contentEditableRef}
      />
      {configMode || !weapon.isOwned
        ? (
        <WeaponConfig weapon={weapon} />
          )
        : (
        <WeaponAttack weapon={weapon} />
          )}
    </Fragment>
  );
};
