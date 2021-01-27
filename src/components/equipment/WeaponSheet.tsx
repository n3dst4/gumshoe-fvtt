/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useState } from "react";
import { TrailItem } from "../../module/TrailItem";
import { CSSReset } from "../CSSReset";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { WeaponConfig } from "./WeaponConfig";
import { WeaponAttack } from "./WeaponAttack";

type WeaponSheetProps = {
  weapon: TrailItem,
  foundryWindow: Application,
};

export const WeaponSheet: React.FC<WeaponSheetProps> = ({
  weapon,
  foundryWindow,
}) => {
  const name = useAsyncUpdate(weapon.name, weapon.setName);

  const [configMode, setConfigMode] = useState(false);

  return (
    <CSSReset>
      <div>
        Weapon
        <a
          css={{
            float: "right",
          }}
          onClick={() => {
            setConfigMode((mode) => !mode);
          }}
        >
          <a className={`fa fa-${configMode ? "check" : "cog"}`}/>
        </a>
      </div>

      <h1
        contentEditable
        onInput={name.onInput}
        onFocus={name.onFocus}
        onBlur={name.onBlur}
        ref={name.contentEditableRef}
      />

          {configMode ? <WeaponConfig weapon={weapon} /> : <WeaponAttack weapon={weapon} />}

    </CSSReset>
  );
};
