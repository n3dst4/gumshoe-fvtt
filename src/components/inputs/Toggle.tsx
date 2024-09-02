import React, { useContext } from "react";

import { IdContext } from "../IdContext";

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
};

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  className,
}) => {
  const id = useContext(IdContext);

  return (
    <input
      id={id}
      type="checkbox"
      checked={checked}
      className={className}
      css={{
        lineHeight: "inherit",
        // height: "inherit",
        background: "red",
        position: "relative",
        top: "0.2em",
        "&[type=checkbox]": {
          // height: "inherit",
        },
      }}
      onChange={(e) => {
        onChange(e.currentTarget.checked);
      }}
    />
  );
};
