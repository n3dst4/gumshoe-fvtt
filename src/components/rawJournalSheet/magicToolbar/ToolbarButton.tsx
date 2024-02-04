import React, { useContext } from "react";

import { ThemeContext } from "../../../themes/ThemeContext";

type ToolbarButtonProps = {
  text?: React.ReactNode;
  icon?: React.ComponentType;
  onClick: () => void | Promise<void>;
  disabled?: boolean;
};

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  text,
  icon: Icon,
  disabled = false,
}) => {
  const theme = useContext(ThemeContext);

  // Use props in your component
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      onClick();
    },
    [onClick],
  );

  return (
    <button
      disabled={disabled}
      css={{
        padding: "0.3em",
        lineHeight: "1em",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        flexBasis: "max-content",
        minWidth: "4em",
        color: theme.colors.text,
        ":hover": {
          transform: disabled ? undefined : "scale(1.1)",
        },
        transition: "transform 0.1s ease",
      }}
      onClick={handleClick}
    >
      {Icon && (
        <div css={{ fontSize: "2em" }}>
          <Icon />
        </div>
      )}

      <div css={{}}>{text}</div>
    </button>
  );
};
