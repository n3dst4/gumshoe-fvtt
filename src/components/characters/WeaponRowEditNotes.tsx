/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useContext } from "react";
import { ThemeContext } from "../../themes/ThemeContext";
interface WeaponRowEditNotesProps {
  className?: string;
  html: string;
}

export const WeaponRowEditNotes: React.FC<WeaponRowEditNotesProps> = ({
  className,
  html,
}: WeaponRowEditNotesProps) => {
  const theme = useContext(ThemeContext);
  return (
    <div
      className={className}
      css={{
        gridColumn: "1 / -1",
        padding: "0.5em 0.5em 0.5em 1em",
        maxHeight: "6em",
        overflow: "auto",
        whiteSpace: "normal",
        margin: "0.5em",
        border: `1px solid ${theme.colors.text}`,
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
