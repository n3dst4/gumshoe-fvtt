/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useEffect, useState } from "react";
import { GumshoeItem } from "../../module/GumshoeItem";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { WeaponConfig } from "./WeaponConfig";
import { WeaponAttack } from "./WeaponAttack";
import { Translate } from "../Translate";
import { ImagePickle } from "../ImagePickle";

type WeaponSheetProps = {
  weapon: GumshoeItem,
  foundryWindow: ItemSheet,
};

export const WeaponSheet: React.FC<WeaponSheetProps> = ({
  weapon,
  foundryWindow,
}) => {
  const name = useAsyncUpdate(weapon.name || "", weapon.setName);
  const [configMode, setConfigMode] = useState(false);
  useEffect(() => {
    foundryWindow.render();
  }, [foundryWindow, configMode]);
  return (
    <div
      css={{
        paddingBottom: "1em",
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gridTemplateRows: "auto auto auto",
        gridTemplateAreas:
          "\"image slug     cog\" " +
          "\"image headline headline\" " +
          "\"body  body     body\" ",
      }}
    >
      <div css={{ gridArea: "slug" }}>
        <Translate>Weapon</Translate>
      </div>

      {weapon.isOwned && (
        <a
          css={{
            gridArea: "cog",
          }}
          onClick={() => {
            setConfigMode((mode) => !mode);
          }}
        >
          <i className={`fa fa-${configMode ? "check" : "cog"}`} />
        </a>
      )}

      <h1
        css={{ gridArea: "headline" }}
        contentEditable
        onInput={name.onInput}
        onFocus={name.onFocus}
        onBlur={name.onBlur}
        ref={name.contentEditableRef}
      />

      {/* Image */}
      <ImagePickle
        editMode={true}
        document={weapon}
        application={foundryWindow}
        css={{
          gridArea: "image",
          transform: "rotateZ(-2deg)",
          width: "4em",
          height: "4em",
          margin: "0 1em 0.5em 0",
        }}
      />

      <div css={{ gridArea: "body" }}>
        {configMode || !weapon.isOwned
          ? (
          <WeaponConfig weapon={weapon} />
            )
          : (
          <WeaponAttack weapon={weapon} />
            )
        }
      </div>
    </div>
  );
};
