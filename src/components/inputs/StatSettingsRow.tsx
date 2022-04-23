/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Stat } from "@lumphammer/investigator-fvtt-types";
import React, { Fragment } from "react";
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
  return (
    <Fragment>
      <AsyncTextInput
        css={{
          gridColumn: "name",
          gridRow: index + 1,
        }}
        onChange={() => {}}
        value={stat.name}
      />
      <AsyncNumberInput
        onChange={() => {}}
        value={stat.default}
        css={{
          gridColumn: "default",
          gridRow: index + 1,
        }}
      />
    </Fragment>
  );
};
