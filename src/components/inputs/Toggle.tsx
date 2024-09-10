import * as Switch from "@radix-ui/react-switch";
import React, { useContext } from "react";

import { systemLogger } from "../../functions/utilities";
import { ThemeContext } from "../../themes/ThemeContext";
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
  const theme = useContext(ThemeContext);
  return (
    <Switch.Root
      id={id}
      className={className}
      css={{
        fontSize: "0.9em",
        width: "3em",
        height: "1.5em",
        padding: 0,
        margin: 0,
        backgroundColor: theme.colors.backgroundButton,
        borderRadius: "9999px",
        position: "relative",
        top: "0.1em",
        boxShadow: `0 0 2px 0 ${theme.colors.text}`,
        "&:focus": {
          boxShadow: `0 0 4px 0 ${theme.colors.text}`,
        },
        "&[data-state='checked']": {
          backgroundColor: theme.colors.accent,
        },
        "&&": { border: "none" },
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
          width: "1em",
          height: "1em",
          backgroundColor: theme.colors.text,
          borderRadius: "9999px",
          boxShadow: `0 0 2px 0 ${theme.colors.text} inset`,
          transition: "transform 100ms",
          transform: "translateX(2px)",
          willChange: "transform",
          "&[data-state='checked']": {
            transform: "translateX(calc(2em - 5px))",
            backgroundColor: theme.colors.accentContrast,
          },
        }}
      />
    </Switch.Root>
  );
};
