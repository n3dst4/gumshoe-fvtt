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
      css={{
        width: "max-content",
      }}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
