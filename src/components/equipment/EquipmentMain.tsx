import React, { ChangeEvent, useCallback } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { TextInput } from "../inputs/TextInput";
import { getTranslated } from "../../functions";
import { NotesEditorWithControls } from "../inputs/NotesEditorWithControls";
import { settings } from "../../settings";
import { EquipmentField } from "./EquipmentField";
import { assertEquipmentDataSource } from "../../typeAssertions";

interface EquipmentMainProps {
  equipment: InvestigatorItem;
  name: string;
  onChangeName: (name: string) => void;
}

export const EquipmentMain: React.FC<EquipmentMainProps> = ({
  equipment,
  name,
  onChangeName,
}) => {
  const data = equipment.data;
  assertEquipmentDataSource(data);

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
    <InputGrid
      css={{
        gridArea: "body",
        position: "relative",
        gridTemplateRows: `repeat(${fieldsLength}, auto) 1fr`,
      }}
    >
      <GridField label="Name">
        <TextInput value={name} onChange={onChangeName} />
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
                <option key={id} value={id}>
                  {cat.name}
                </option>
              ))}
              <option value="">
                {getTranslated("Uncategorized equipment")}
              </option>
            </select>
          </div>
        </div>
      </GridField>

      {Object.entries(categoryMetadata?.fields ?? {}).map(
        ([fieldId, fieldMetadata]) => {
          return (
            <EquipmentField
              key={fieldId}
              fieldId={fieldId}
              fieldMetadata={fieldMetadata}
              value={data.data.fields?.[fieldId]}
              equipment={equipment}
            />
          );
        },
      )}

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
  );
};

EquipmentMain.displayName = "EquipmentMain";
