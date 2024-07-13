import React, { useState } from "react";

import { Item } from "../Item";
import { DraggableRow } from "./DraggableRow";
import { SortableTable } from "./SortableTable";

export function SortableTest() {
  const [items, setItems] = useState(
    new Array(10).fill(null).map((_, i) => (i + 1).toString()),
  );

  return (
    <SortableTable items={items} setItems={setItems}>
      <div>
        <div></div>
        <div>Item Header</div>
        <div>C Header</div>
      </div>
      {items.map((id) => (
        <DraggableRow key={id} id={id}>
          <Item id={id} />
        </DraggableRow>
      ))}
    </SortableTable>
  );
}
