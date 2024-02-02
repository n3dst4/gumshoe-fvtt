import React from "react";

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
        display: "block",
        width: "4em",
        // flex: 1,
        // maxWidth: "33%",
      }}
      onClick={handleClick}
    >
      {Icon && (
        <div css={{ fontSize: "2em" }}>
          <Icon />
        </div>
      )}

      <div>{text}</div>
    </button>
  );
};
