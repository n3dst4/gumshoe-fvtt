/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ComponentProps, useContext } from "react";
import { ThemeContext } from "../../themes/ThemeContext";
import { GridField } from "./GridField";

type SettingsGridFieldProps = ComponentProps<typeof GridField> & {
  index?: number,
};

export const SettingsGridField: React.FC<SettingsGridFieldProps> = ({
  index = 0,
  ...props
}) => {
  const tint = index % 2 === 0;
  const theme = useContext(ThemeContext);
  return (
    <GridField
      {...props}
      css={{
        padding: "0.5em",
        background: tint ? theme.colors.backgroundSecondary : "none",
      }}

    />
  );
};
