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
import React, { useState } from "react";

import { absoluteCover } from "../../../absoluteCover";
import { DraggableRow } from "./DraggableRow";
import { Item } from "./Item";

export function SortableTest() {
  const [items, setItems] = useState(
    new Array(10).fill(null).map((_, i) => (i + 1).toString()),
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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
    <div className="sortable-test" css={{ ...absoluteCover, padding: "1em" }}>
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
              <DraggableRow key={id} id={id} active={activeId === id}>
                <Item id={id} />
              </DraggableRow>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
