import React, { ChangeEvent, useCallback } from "react";
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
import { EquipmentField } from "./EquipmentField";

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
  const categoryMetadata = categories[data.data.category];
  const isRealCategory = categoryMetadata !== undefined;

  const onChangeCategory = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.currentTarget.value;
      if (value === "") {
        // setIsUncategorized(true);
        equipment.setCategory("");
      } else {
        // setIsUncategorized(false);
        equipment.setCategory(e.currentTarget.value);
      }
    },
    [equipment],
  );

  const selectedCat = isRealCategory ? data.data.category : "";

  const fieldsLength = Object.keys(categoryMetadata?.fields ?? {}).length + 2;

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
          gridTemplateRows: `repeat(${fieldsLength}, auto) 1fr`,
        }}
      >
        <GridField label="Name">
          <TextInput value={name.display} onChange={name.onChange} />
        </GridField>

        <GridField
          label="Category"
          labelTitle={`Category ID: ${data.data.category}\nClick to copy to clipboard.`}
          onClickLabel={async () => {
            await navigator.clipboard.writeText(data.data.category);
            ui.notifications?.info(`Copied category ID "${data.data.category}" to clipboard`);
          }}
        >
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
                <option value="">{getTranslated("Uncategorized equipment")}</option>
              </select>
            </div>
          </div>
        </GridField>

        {Object.entries(categoryMetadata?.fields ?? {}).map(([fieldId, fieldMetadata]) => {
          return (
            <EquipmentField
              key={fieldId}
              fieldId={fieldId}
              fieldMetadata={fieldMetadata}
              value={data.data.fields?.[fieldId]}
              equipment={equipment}
            />
          );
        })}

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
