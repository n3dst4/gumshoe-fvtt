/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ReactNode } from "react";
import { themes } from "../../theme";

type ThemeFarmProps = {
  foundryApplication: Application,
};

export const ThemeFarm: React.FC<ThemeFarmProps> = ({
  foundryApplication,
}: ThemeFarmProps) => {
  console.info("THEMES!", Object.values(themes));
  return (
    <div>
      <h1>Theme Farm</h1>
      {
        Object.keys(themes).map<ReactNode>((id) => (
          <div key={id}>
            {themes[id].displayName}
          </div>
        ))
      }
    </div>
  );
};
