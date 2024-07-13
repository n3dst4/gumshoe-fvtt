import React, { useState } from "react";

import { Item } from "./Item";
import { SortableTable } from "./SortableKit/SortableTable";

export function SortableTest() {
  const [items, setItems] = useState(
    new Array(10).fill(null).map((_, i) => (i + 1).toString()),
  );

  return (
    <SortableTable
      items={items}
      setItems={setItems}
      renderItem={(id) => <Item id={id} />}
      headers={[
        { label: "Item Header", id: "itemHeader" },
        { label: "C Header", id: "cHeader" },
      ]}
    />
  );
}
