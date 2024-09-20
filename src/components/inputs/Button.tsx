import React, { ComponentProps, PropsWithChildren } from "react";

type ButtonProps = ComponentProps<"button"> &
  PropsWithChildren<{
    onClick: () => void;
    className?: string;
  }>;

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className,
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClick();
  };

  return (
    <button
      {...rest}
      className={className}
      onClick={handleClick}
      css={{
        padding: "0.1em 0.3em",
      }}
    >
      {children}
    </button>
  );
};

export const ToolbarButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  className,
  ...rest
}) => {
  return (
    <Button
      {...rest}
      className={className}
      css={{
        display: "block",
        width: "max-content",
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
