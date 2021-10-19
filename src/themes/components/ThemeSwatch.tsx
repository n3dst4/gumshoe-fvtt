/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { Theme } from "../types";
import { CSSReset, CSSResetMode } from "../../components/CSSReset";

type ThemeSwatchProps = {
  theme: Theme,
};

export const ThemeSwatch: React.FC<ThemeSwatchProps> = ({
  theme,
}: ThemeSwatchProps) => {
  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        gap: "1em",
      }}
    >
      <CSSReset
        noStyleAppWindow
        mode={CSSResetMode.small}
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
            backgroundColor: theme.colors.backgroundPrimary,
          }}
        >
          {theme.displayName}<br/>
          bgTransPrimary
        </div>
        <div
          css={{
            flex: 1,
            backgroundColor: theme.colors.backgroundSecondary,
          }}
        >
          {theme.displayName}<br/>
          bgTransSecondary
        </div>
      </CSSReset>
    </div>
  );
};
