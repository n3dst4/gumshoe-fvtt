import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { PropsWithChildren, useState } from "react";

import { absoluteCover } from "../../../absoluteCover";
import { Item } from "../Item";
import { ActiveIdContext } from "./ActiveIdContext";
import { DraggableRow } from "./DraggableRow";

type SortableTableProps = PropsWithChildren<{
  items: string[];
  setItems: (items: string[] | ((items: string[]) => string[])) => void;
}>;

export const SortableTable: React.FC<SortableTableProps> = ({
  items,
  setItems,
  children,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id.toString());
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!active || !over) {
      return;
    }
    setActiveId(null);

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id.toString());
        const newIndex = items.indexOf(over.id.toString());

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="sortable-table" css={{ ...absoluteCover, padding: "1em" }}>
      <ActiveIdContext.Provider value={activeId}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <DragOverlay />
            <div
              css={{
                display: "grid",
                gridTemplateColumns: "max-content 1fr 1fr",
                gap: "0.5em",
              }}
            >
              <div
                css={{
                  gridColumn: "1/-1",
                  display: "grid",
                  gridTemplateColumns: "subgrid",
                  borderBottom: "1px solid black",
                }}
              >
                <div></div>
                <div>Item Header</div>
                <div>C Header</div>
              </div>
              {items.map((id) => (
                <DraggableRow key={id} id={id}>
                  <Item id={id} />
                </DraggableRow>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </ActiveIdContext.Provider>
    </div>
  );
};

SortableTable.displayName = "SortableTable";
