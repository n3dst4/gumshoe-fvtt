/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Stat } from "@lumphammer/investigator-fvtt-types";
import React, { useContext } from "react";
import { ThemeContext } from "../../themes/ThemeContext";
import { AsyncNumberInput } from "./AsyncNumberInput";
import { AsyncTextInput } from "./AsyncTextInput";

interface StatSettingsRowProps {
  id: string;
  stat: Stat;
  index: number;
}

export const StatSettingsRow: React.FC<StatSettingsRowProps> = ({
  id,
  stat,
  index,
}: StatSettingsRowProps) => {
  const isEven = index % 2 === 0;
  const theme = useContext(ThemeContext);
  return (
    <div
      css={{
        backgroundColor: isEven ? theme.colors.backgroundPrimary : undefined,
        padding: "0.5em",
        ".flexRow": {
          display: "flex",
          flexDirection: "row",
          gap: "0.5em",
        },
      }}
    >
      <div
        className="flexRow"
      >
        <span>Name:</span>
        <AsyncTextInput
          css={{
            flex: 1,
          }}
          onChange={() => {}}
          value={stat.name}
        />
      </div>
      <div
        className="flexRow"
        css={{ lineHeight: 1 }}
      >
        <span css={{ flex: 1 }}>Default</span>
        <span css={{ flex: 1 }}>Min</span>
        <span css={{ flex: 1 }}>Max</span>
      </div>
      <div
        className="flexRow"
      >
        <AsyncNumberInput
          onChange={() => {}}
          value={stat.default}
          css={{
            flex: 1,
          }}
        />
        <AsyncNumberInput
          onChange={() => {}}
          value={stat.default}
          css={{
            flex: 1,
          }}
        />
        <AsyncNumberInput
          onChange={() => {}}
          value={stat.default}
          css={{
            flex: 1,
          }}
        />
      </div>
    </div>
  );
};
