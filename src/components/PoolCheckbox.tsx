import React from "react";

type PoolCheckboxProps = {
  value: number,
  selected: boolean,
};

export const PoolCheckbox: React.FC<PoolCheckboxProps> = ({
  value,
  selected,
}) => {
  return (
    <div
      style={{
        width: "2em",
        height: "1.5em",
        background: selected ? "#d44" : "#fff",
      }}
    >
      {value}
    </div>
  );
}
;
