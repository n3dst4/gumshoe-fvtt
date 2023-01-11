import React from "react";
type InputGridProps = {
  children: any;
  className?: string;
};

export const InputGrid: React.FC<InputGridProps> = ({
  children,
  className,
}) => {
  return (
    <div
      css={{
        display: "grid",
        gridTemplateRows: "auto",
        gridTemplateColumns:
          "[label] minmax(min-content, max-content) auto [control] 1fr [end]",
        gridAutoRows: "auto",
        rowGap: "0.2em",
        maxWidth: "100%",
      }}
      className={className}
    >
      {children}
    </div>
  );
};
