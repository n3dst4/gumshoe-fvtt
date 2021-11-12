/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { TextInput } from "../inputs/TextInput";
import { Translate } from "../Translate";
import { assertGame, confirmADoodleDo } from "../../functions";
import { ImagePickle } from "../ImagePickle";
import { AsyncTextArea } from "../inputs/AsyncTextArea";
import { absoluteCover } from "../absoluteCover";
import { assertMwItemDataSource, MwType } from "../../types";

type WmItemSheetProps = {
  item: InvestigatorItem,
  application: ItemSheet,
};

export const WmItemSheet: React.FC<WmItemSheetProps> = ({
  item,
  application,
}) => {
  assertMwItemDataSource(item.data);

  const name = useAsyncUpdate(item.name || "", item.setName);

  const onClickDelete = useCallback(() => {
    assertGame(game);
    const message = item.actor
      ? "DeleteActorNamesEquipmentName"
      : "DeleteEquipmentName";

    confirmADoodleDo(
      message,
      "Delete",
      "Cancel",
      "fa-trash",
      {
        ActorName: item.actor?.data.name ?? "",
        EquipmentName: item.data.name,
      },
      () => {
        item.delete();
      },
    );
  }, [item]);

  const onChangeType = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    item.setMwType(e.currentTarget.value as MwType);
  }, [item]);

  return (
    <div
      css={{
        ...absoluteCover,
        padding: "1em",
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gridTemplateRows: "auto auto 1fr",
        gridTemplateAreas:
          "\"image  slug      trash\" " +
          "\"image  headline  headline\" " +
          "\"body   body      body\" ",
      }}
    >
      {/* Slug */}
      <div css={{ gridArea: "slug" }}>
        <Translate>MWItem</Translate>
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
        subject={item}
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
          gridArea: "trash",
        }}
        onClick={() => {
          onClickDelete();
        }}
      >
        <i className={"fa fa-trash"}/>
      </a>

      {/* Body */}
      <InputGrid
        css={{
          gridArea: "body",
          gridTemplateRows: "auto auto 1fr",
          gridAutoRows: "auto",
        }}
      >
        <GridField label="Name">
          <TextInput value={name.display} onChange={name.onChange} />
        </GridField>
        <GridField label="Type">
          <select value={item.data.data.mwType} onChange={onChangeType}>
            <option value="tweak">Tweak</option>
            <option value="spell">Spell</option>
            <option value="cantrap">Cantrap</option>
            <option value="enchantedItem">Enchanted item</option>
            <option value="meleeWeapon">Melee weapon</option>
            <option value="missileWeapon">Missile weapon</option>
          </select>
        </GridField>
        <GridField label="Notes">
          <AsyncTextArea
            value={item.data.data.notes}
            onChange={item.setNotes}
            css={{
              height: "100%",
              "&&": {
                resize: "none",
              },
            }}
          />
        </GridField>
      </InputGrid>
    </div>
  );
};
