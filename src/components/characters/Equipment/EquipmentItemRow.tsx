import { EquipmentFieldMetadata } from "@lumphammer/investigator-fvtt-types";
import React, { useCallback, useContext } from "react";
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
  const [hover, setHover] = React.useState(false);
  const handleMouseOver = useCallback((e: React.MouseEvent<HTMLElement>) => {
    setHover(true);
  }, []);
  const handleMouseOut = useCallback((e: React.MouseEvent<HTMLElement>) => {
    setHover(false);
  }, []);

  return (
    <>
      {/* hover bar */}
      <div
        css={{
          gridColumn: "1/-1",
          gridRow,
          backgroundColor: hover ? theme.colors.backgroundButton : undefined,
          // padding: "0.5em",
          // ":hover": {
          // },
        }}
      />
      <a
        key={item.id}
        css={{
          gridColumn: "1",
          gridRow,
          // mouseEvents: "none",
          // pointerEvents: "",
          cursor: "pointer",
        }}
        onClick={() => item.sheet?.render(true)}
        data-item-id={item.id}
        onDragStart={onDragStart}
        draggable="true"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        {item.name}
      </a>
      {Object.entries(fields).map<JSX.Element>(([fieldId, field], j) => {
        assertEquipmentDataSource(item.data);
        return (
          <a
            key={fieldId}
            css={{
              gridColumn: j + 2,
              gridRow,
              mouseEvents: "none",
            }}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={() => item.sheet?.render(true)}
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
          </a>
        );
      })}
    </>
  );
};

EquipmentItemRow.displayName = "EquipmentItemRow";
