import React, { ChangeEvent, useCallback } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { TextInput } from "../inputs/TextInput";
import { getTranslated } from "../../functions";
import { NotesEditorWithControls } from "../inputs/NotesEditorWithControls";
import { settings } from "../../settings";
import { EquipmentField } from "./EquipmentField";
import { absoluteCover } from "../absoluteCover";
import { assertEquipmentItem } from "../../v10Types";

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
  assertEquipmentItem(equipment);

  const categories = settings.equipmentCategories.get();
  const categoryMetadata = categories[equipment.system.category];
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

  const selectedCat = isRealCategory ? equipment.system.category : "";

  const fieldsLength = Object.keys(categoryMetadata?.fields ?? {}).length + 2;

  return (
    <InputGrid
      css={{
        gridTemplateRows: `repeat(${fieldsLength}, auto) 1fr`,
        ...absoluteCover,
      }}
    >
      <GridField label="Item Name">
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
              value={equipment.system.fields?.[fieldId]}
              equipment={equipment}
            />
          );
        },
      )}

      <NotesEditorWithControls
        allowChangeFormat
        format={equipment.system.notes.format}
        html={equipment.system.notes.html}
        source={equipment.system.notes.source}
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
