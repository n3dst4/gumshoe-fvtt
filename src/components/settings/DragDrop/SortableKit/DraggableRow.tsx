import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { PropsWithChildren } from "react";

import { DragHandle } from "../DragHandle";

type DraggableRowProps = PropsWithChildren<{
  id: string;
  active: boolean;
}>;

export const DraggableRow: React.FC<DraggableRowProps> = ({
  children,
  id,
  active,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({ id });

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
