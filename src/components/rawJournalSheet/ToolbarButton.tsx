import React, { useContext } from "react";

import { ThemeContext } from "../../themes/ThemeContext";

type ToolbarButtonProps = {
  text?: React.ReactNode;
  icon?: React.ComponentType;
  onClick: () => void | Promise<void>;
};

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  text,
  icon: Icon,
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
      css={{
        padding: "0.3em",
        lineHeight: "1em",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        flexBasis: "max-content",
        minWidth: "4em",
        color: theme.colors.text,
        // aspectRatio: "1",
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
