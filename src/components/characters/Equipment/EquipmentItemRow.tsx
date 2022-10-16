import { EquipmentFieldMetadata } from "@lumphammer/investigator-fvtt-types";
import React, { useContext } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { InvestigatorItem } from "../../../module/InvestigatorItem";
import { ThemeContext } from "../../../themes/ThemeContext";
import { assertEquipmentDataSource } from "../../../typeAssertions";

interface EquipmentItemRowProps {
  item: InvestigatorItem;
  onDragStart: (e: React.DragEvent<HTMLElement>) => void;
  gridRow: number;
  fields: Record<string, EquipmentFieldMetadata>;
}

export const EquipmentItemRow: React.FC<EquipmentItemRowProps> = ({
  item,
  onDragStart,
  gridRow,
  fields,
}) => {
  const theme = useContext(ThemeContext);

  return (
    <>
      <div
        css={{
          gridColumn: "1/-1",
          gridRow,
          ":hover": {
            backgroundColor: theme.colors.backgroundButton,
          },
        }}
      />
      <a
        key={item.id}
        css={{
          gridColumn: "1",
          gridRow,
          mouseEvents: "none",
        }}
        onClick={() => item.sheet?.render(true)}
        data-item-id={item.id}
        onDragStart={onDragStart}
        draggable="true"
      >
        {item.name}
      </a>
      {Object.entries(fields).map<JSX.Element>(([fieldId, field], j) => {
        assertEquipmentDataSource(item.data);
        return (
          <div
            key={fieldId}
            css={{
              gridColumn: j + 2,
              gridRow,
              mouseEvents: "none",
            }}
          >
            {field.type === "checkbox"
              ? (
                  item.data.data.fields?.[fieldId]
                    ? (
                <FaCheck />
                      )
                    : (
                <FaTimes />
                      )
                )
              : (
                  item.data.data.fields?.[fieldId]
                )}
          </div>
        );
      })}
    </>
  );
};

EquipmentItemRow.displayName = "EquipmentItemRow";
