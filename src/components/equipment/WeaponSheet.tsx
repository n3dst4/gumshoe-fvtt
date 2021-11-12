/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useEffect, useState } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { WeaponConfig } from "./WeaponConfig";
import { WeaponAttack } from "./WeaponAttack";
import { Translate } from "../Translate";
import { ImagePickle } from "../ImagePickle";

type WeaponSheetProps = {
  weapon: InvestigatorItem,
  application: ItemSheet,
};

export const WeaponSheet: React.FC<WeaponSheetProps> = ({
  weapon,
  application,
}) => {
  const name = useAsyncUpdate(weapon.name || "", weapon.setName);
  const [configMode, setConfigMode] = useState(false);
  useEffect(() => {
    application.render();
  }, [application, configMode]);
  return (
    <div
      css={{
        paddingBottom: "1em",
        position: "relative",
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gridTemplateRows: "auto auto auto",
        gridTemplateAreas:
          "\"image slug     cog\" " +
          "\"image headline headline\" " +
          "\"body  body     body\" ",
      }}
    >
      {/* Slug */}
      <div css={{ gridArea: "slug" }}>
        <Translate>Weapon</Translate>
      </div>

      {/* Headline */}
      <h1
        css={{ gridArea: "headline" }}
        contentEditable
        onInput={name.onInput}
        onFocus={name.onFocus}
        onBlur={name.onBlur}
        ref={name.contentEditableRef}
      />

      {/* Cog */}
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

      {/* Image */}
      <ImagePickle
        subject={weapon}
        application={application}
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
