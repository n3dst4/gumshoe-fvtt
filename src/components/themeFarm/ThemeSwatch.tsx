/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { Theme } from "../../theme";
import { CSSReset } from "../CSSReset";

type ThemeSwatchProps = {
  theme: Theme,
};

export const ThemeSwatch: React.FC<ThemeSwatchProps> = ({
  theme,
}: ThemeSwatchProps) => {
  return (
    <CSSReset
      theme={theme}
      css={{
        display: "flex",
        flexDirection: "column",
        gap: "1em",
      }}
    >
      <div
        css={{
          flex: 1,
          backgroundColor: "transparent",
        }}
      >
        {theme.displayName}<br/>
        transparent
      </div>
      <div
        css={{
          flex: 1,
          backgroundColor: theme.colors.bgTransPrimary,
        }}
      >
        {theme.displayName}<br/>
        bgTransPrimary
      </div>
      <div
        css={{
          flex: 1,
          backgroundColor: theme.colors.bgTransSecondary,
        }}
      >
        {theme.displayName}<br/>
        bgTransSecondary
      </div>
    </CSSReset>
  );
};
