import React, { ReactNode } from "react";
import { runtimeConfig } from "../../runtime";
import { ThemeSwatch } from "./ThemeSwatch";

type ThemeFarmProps = {
  foundryApplication: Application,
};

export const ThemeFarm: React.FC<ThemeFarmProps> = ({
  foundryApplication,
}: ThemeFarmProps) => {
  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#111",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div
        css={{
          flex: 1,
          position: "relative",
          display: "grid",
          gridTemplateColumns: "repeat( auto-fit, minmax(250px, 1fr) )",
          gridAutoRows: "minmax(10em, max-content)",
          gap: "1em",
          padding: "1em",
        }}
      >
        {
          Object.keys(runtimeConfig.themes).map<ReactNode>((id) => (
            <ThemeSwatch key={id} theme={runtimeConfig.themes[id]} />
          ))
        }
      </div>
    </div>
  );
};
