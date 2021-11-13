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
import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";

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
  const nameInput = useAsyncUpdate(item.name || "", item.setName);

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
          <TextInput
            value={nameInput.display}
            onChange={nameInput.onChange}
            onFocus={nameInput.onFocus}
            onBlur={nameInput.onBlur}
          />
        </GridField>
        <GridField label="MwType">
          <select
            value={item.data.data.mwType}
            onChange={onChangeType}
            css={{
              width: "100%",
            }}
          >
            <option value="tweak">Tweak</option>
            <option value="spell">Spell</option>
            <option value="cantrap">Cantrap</option>
            <option value="enchantedItem">Enchanted item</option>
            <option value="meleeWeapon">Melee weapon</option>
            <option value="missileWeapon">Missile weapon</option>
          </select>
        </GridField>
        <GridFieldStacked label="Notes">
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
        </GridFieldStacked>
        {
          item.data.data.mwType === "enchantedItem" &&
          <GridField label="Charges">
            <AsyncNumberInput
              onChange={item.setCharges}
              value={item.getCharges()}
              min={0}
            />
          </GridField>
        }
        {
          item.data.data.mwType === "missileWeapon" &&
          <GridFieldStacked label="Ranges">
            <div
              css={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <GridFieldStacked label="Short" css={{ flex: 1 }}>
                <AsyncNumberInput
                  onChange={item.setRange(0)}
                  value={item.getRange(0)}
                  min={0}
                />
              </GridFieldStacked>
              <GridFieldStacked label="Medium" css={{ flex: 1 }}>
                <AsyncNumberInput
                  onChange={item.setRange(1)}
                  value={item.getRange(1)}
                  min={0}
                />
              </GridFieldStacked>
            </div>
            <div
              css={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <GridFieldStacked label="Long" css={{ flex: 1 }}>
                <AsyncNumberInput
                  onChange={item.setRange(2)}
                  value={item.getRange(2)}
                  min={0}
                />
              </GridFieldStacked>
              <GridFieldStacked label="Extreme" css={{ flex: 1 }}>
                <AsyncNumberInput
                  onChange={item.setRange(3)}
                  value={item.getRange(3)}
                  min={0}
                />
              </GridFieldStacked>
            </div>
          </GridFieldStacked>
        }
      </InputGrid>
    </div>
  );
};
