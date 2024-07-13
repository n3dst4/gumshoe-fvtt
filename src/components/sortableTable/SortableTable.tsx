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
import { createPortal } from "react-dom";

import { absoluteCover } from "../absoluteCover";
import { ActiveIdContext } from "./ActiveIdContext";
import { SortableRow } from "./SortableRow";

type Header = {
  id: string;
  label: string;
};

type SortableTableProps = {
  items: string[];
  setItems: (items: string[] | ((items: string[]) => string[])) => void;
  renderItem: (id: string) => React.ReactNode;
  headers: Header[];
};

export const SortableTable: React.FC<SortableTableProps> = ({
  items,
  setItems,
  renderItem,
  headers,
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
            {createPortal(<DragOverlay />, document.body)}
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
                <div />
                {headers.map((header) => (
                  <div key={header.label}>{header.label}</div>
                ))}
              </div>
              {items.map((id) => (
                <SortableRow key={id} id={id}>
                  {renderItem(id)}
                </SortableRow>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </ActiveIdContext.Provider>
    </div>
  );
};

SortableTable.displayName = "SortableTable";
