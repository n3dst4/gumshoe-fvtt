import * as Switch from "@radix-ui/react-switch";
import React, { useContext } from "react";

import { systemLogger } from "../../functions/utilities";
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
    <Switch.Root
      id={id}
      className={className}
      css={{
        width: "42px",
        height: "25px",
        backgroundColor: "var(--black-a9)",
        borderRadius: "9999px",
        position: "relative",
        boxShadow: "0 2px 10px var(--black-a7)",
        "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)",
        "&:focus": {
          "box-shadow": "0 0 0 2px black",
        },
        "&[data-state='checked']": {
          "background-color": "black",
        },
      }}
      checked={checked}
      onCheckedChange={(e) => {
        systemLogger.log("checked", e);
        onChange(e);
      }}
    >
      <Switch.Thumb
        css={{
          display: "block",
          width: "21px",
          height: "21px",
          backgroundColor: "white",
          borderRadius: "9999px",
          boxShadow: "0 2px 2px var(--black-a7)",
          transition: "transform 100ms",
          transform: "translateX(2px)",
          willChange: "transform",
          "&[data-state='checked']": {
            transform: "translateX(19px)",
          },
        }}
      />
    </Switch.Root>
  );
};
