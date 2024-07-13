import React from "react";

type ItemProps = {
  id: string | null;
};

export const Item: React.FC<ItemProps> = ({ id }) => {
  return (
    <div
      css={{
        display: "grid",
        gridTemplateColumns: "subgrid",
        gridColumn: "1/-1",
      }}
    >
      <div>Item {id}</div>
      <div>C</div>
    </div>
  );
};
