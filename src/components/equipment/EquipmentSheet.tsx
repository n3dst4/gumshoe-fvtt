import React, { ChangeEvent, useCallback, useState } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { TextInput } from "../inputs/TextInput";
import { Translate } from "../Translate";
import { assertGame, confirmADoodleDo } from "../../functions";
import { ImagePickle } from "../ImagePickle";
import { NotesEditorWithControls } from "../inputs/NotesEditorWithControls";
import { absoluteCover } from "../absoluteCover";
import { settings } from "../../settings";
import { assertEquimentDataSource } from "../../types";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
// import { AsyncTextInput } from "../inputs/AsyncTextInput";

type EquipmentSheetProps = {
  equipment: InvestigatorItem,
  application: ItemSheet,
};

export const EquipmentSheet: React.FC<EquipmentSheetProps> = ({
  equipment,
  application,
}) => {
  assertEquimentDataSource(equipment.data);
  const name = useAsyncUpdate(equipment.name || "", equipment.setName);

  const onClickDelete = useCallback(() => {
    assertGame(game);
    const message = equipment.actor
      ? "DeleteActorNamesEquipmentName"
      : "DeleteEquipmentName";

    confirmADoodleDo({
      message,
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmIconClass: "fa-trash",
      values: {
        ActorName: equipment.actor?.data.name ?? "",
        EquipmentName: equipment.data.name,
      },
    }).then(() => {
      equipment.delete();
    });
  }, [equipment]);

  const categories = settings.equipmentCategories.get();

  const isRealCategory = categories.includes(equipment.data.data.category);
  const [showCustomField, setShowCustomField] = useState(!isRealCategory);
  const [selectCustomOption, setSelectCustomOption] = useState(!isRealCategory);

  const onChangeCategory = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.currentTarget.value;
      if (value === "") {
        setShowCustomField(true);
        setSelectCustomOption(true);
      } else {
        setSelectCustomOption(false);
        equipment.setCategory(e.currentTarget.value);
      }
    },
    [equipment],
  );

  const selectedCat = selectCustomOption ? "" : equipment.data.data.category;

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
          '"image slug     trash" ' +
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
          gridArea: "trash",
        }}
        onClick={() => {
          onClickDelete();
        }}
      >
        <i className={"fa fa-trash"} />
      </a>

      {/* Body */}
      <InputGrid
        css={{
          gridArea: "body",
          position: "relative",
          gridTemplateRows: "auto auto 1fr",
        }}
      >
        <GridField label="Name">
          <TextInput value={name.display} onChange={name.onChange} />
        </GridField>

        <GridField label="Category">
          <div
            css={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>
              <select
                value={selectedCat}
                onChange={onChangeCategory}
                css={{
                  lineHeight: "inherit",
                  height: "inherit",
                }}
              >
                {categories.map<JSX.Element>((cat: string) => (
                  <option key={cat}>{cat}</option>
                ))}
                <option value="">Custom</option>
              </select>
            </div>
            <div
              css={{
                flex: 1,
              }}
            >
              {showCustomField &&
                <AsyncTextInput
                  value={equipment.data.data.category}
                  onChange={equipment.setCategory}
                />
              }
            </div>

          </div>
        </GridField>

        <NotesEditorWithControls
          allowChangeFormat
          format={equipment.data.data.notes.format}
          html={equipment.data.data.notes.html}
          source={equipment.data.data.notes.source}
          onSave={equipment.setNotes}
          css={{
            height: "100%",
            "&&": {
              resize: "none",
            },
          }}
        />
      </InputGrid>
    </div>
  );
};
