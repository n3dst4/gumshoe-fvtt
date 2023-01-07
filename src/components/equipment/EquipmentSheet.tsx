import React, { useState } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { Translate } from "../Translate";
import { ImagePickle } from "../ImagePickle";
import { absoluteCover } from "../absoluteCover";
import { assertEquipmentDataSource } from "../../typeAssertions";
import { EquipmentMain } from "./EquipmentMain";
import { EquipmentConfig } from "./EquipmentConfig";

type EquipmentSheetProps = {
  equipment: InvestigatorItem,
  application: ItemSheet,
};

export const EquipmentSheet: React.FC<EquipmentSheetProps> = ({
  equipment,
  application,
}) => {
  const [configMode, setConfigMode] = useState(false);

  const data = equipment.data;
  assertEquipmentDataSource(data);
  const name = useAsyncUpdate(equipment.name || "", equipment.setName);

  return (
    <div
      css={{
        ...absoluteCover,
        padding: "0.5em 0.5em 1em 0.5em",
        display: "grid",
        gap: "0.3em",
        gridTemplateColumns: "auto 1fr auto",
        gridTemplateRows: "auto auto 1fr",
        gridTemplateAreas:
          '"image slug     cog" ' +
          '"image headline headline" ' +
          '"body  body     body" ',
      }}
    >
      {/* Slug */}
      <div css={{ gridArea: "slug" }}>
        <Translate>Equipment</Translate>
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

      {/* Image */}
      <ImagePickle
        subject={equipment}
        application={application}
        css={{
          gridArea: "image",
          transform: "rotateZ(-2deg)",
          width: "4em",
          height: "4em",
          margin: "0 1em 0.5em 0",
        }}
      />

      {/* Trash */}
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

      {/* Body */}
      <div
        css={{
          gridArea: "body",
        }}
      >
        {configMode
          ? (
          <EquipmentConfig equipment={equipment} />
            )
          : (
          <EquipmentMain
            equipment={equipment}
            name={name.display}
            onChangeName={name.onChange}
          />
            )}
      </div>
    </div>
  );
};
