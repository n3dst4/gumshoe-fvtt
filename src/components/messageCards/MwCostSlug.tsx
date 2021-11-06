/** @jsx jsx */
import { jsx } from "@emotion/react";
import { ReactNode } from "react";
type MwCostSlugProps = {
  children: ReactNode,
};

export const MwCostSlug: React.FC<MwCostSlugProps> = ({
  children,
}: MwCostSlugProps) => {
  return (
    <span
      css={{
        backgroundColor: "#0007",
        color: "#fff",
        borderRadius: "2em",
        padding: "0 0.3em",
        fontSize: "0.9em",
        marginLeft: "0.5em",
      }}
    >
      {children}
    </span>
  );
};
