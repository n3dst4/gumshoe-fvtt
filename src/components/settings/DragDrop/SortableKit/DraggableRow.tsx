import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { PropsWithChildren, useContext } from "react";

import { DragHandle } from "../DragHandle";
import { ActiveIdContext } from "./ActiveIdContext";

type DraggableRowProps = PropsWithChildren<{
  id: string;
}>;

export const DraggableRow: React.FC<DraggableRowProps> = ({ children, id }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({ id });

  const active = useContext(ActiveIdContext) === id;

  return (
    <div
      css={{
        display: "grid",
        gridTemplateColumns: "subgrid",
        gridColumn: "1/-1",
        opacity: active ? 0.5 : 1,
      }}
      {...attributes}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <DragHandle
        setActivatorNodeRef={setActivatorNodeRef}
        listeners={listeners}
      />
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "subgrid",
          gridColumn: "2/-1",
        }}
      >
        {children}
      </div>
    </div>
  );
};
