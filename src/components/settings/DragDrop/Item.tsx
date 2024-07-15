import React from "react";

type ItemProps = {
  id: string | null;
};

export const Item: React.FC<ItemProps> = ({ id }) => {
  return (
    <>
      <div>Item {id}</div>
      <div>C!</div>
    </>
  );
};
