import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { TextInput } from "../inputs/TextInput";
import { Translate } from "../Translate";
import { assertGame, confirmADoodleDo, getTranslated } from "../../functions";
import { ImagePickle } from "../ImagePickle";
import { NotesEditorWithControls } from "../inputs/NotesEditorWithControls";
import { absoluteCover } from "../absoluteCover";
import { settings } from "../../settings";
import { assertEquipmentDataSource } from "../../typeAssertions";
import { AsyncTextInput } from "../inputs/AsyncTextInput";

type EquipmentSheetProps = {
  equipment: InvestigatorItem,
  application: ItemSheet,
};

export const EquipmentSheet: React.FC<EquipmentSheetProps> = ({
  equipment,
  application,
}) => {
  const data = equipment.data;
  assertEquipmentDataSource(data);
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

  const isRealCategory = categories[data.data.category] !== undefined;
  const [category, setCategory] = useState(data.data.category);
  const [isCustom, setIsCustom] = useState(!isRealCategory);
  useEffect(() => {
    if (data.data.category !== category) {
      equipment.setCategory(category);
    }
  }, [category, data.data.category, equipment]);

  const onChangeCategory = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.currentTarget.value;
      if (value === "") {
        setIsCustom(true);
        setCategory("");
      } else {
        setIsCustom(false);
        setCategory(e.currentTarget.value);
      }
    },
    [],
  );

  const selectedCat = isCustom ? "" : data.data.category;

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
                {Object.entries(categories).map<JSX.Element>(([id, cat]) => (
                  <option key={id} value={id}>{cat.name}</option>
                ))}
                <option value="">{getTranslated("Custom category")}</option>
              </select>
            </div>
            <div
              css={{
                flex: 1,
              }}
            >
              {isCustom &&
                <AsyncTextInput
                  value={category}
                  onChange={setCategory}
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
