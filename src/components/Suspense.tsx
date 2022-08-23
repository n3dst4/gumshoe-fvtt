import React from "react";
import { runtimeConfig } from "../runtime";
import { settings } from "../settings";
import { absoluteCover } from "./absoluteCover";
import { CSSReset, CSSResetMode } from "./CSSReset";

const Fallback: React.FC = () => {
  const theme = runtimeConfig.themes[settings.defaultThemeName.get()] || runtimeConfig.themes.tealTheme;
  return (
    <CSSReset theme={theme} mode={CSSResetMode.large}
      css={{
        ...absoluteCover,
        backgroundColor: theme.colors.backgroundPrimary,
      }}
    >
      <i
        className="fas fa-spinner fa-spin"
        css={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "3em",
          color: theme.colors.text,
        }}
      />
    </CSSReset>
  );
};

export const Suspense: React.FC = ({ children }) => (
  <React.Suspense fallback={<Fallback/>}>{children}</React.Suspense>
);
