/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useMemo } from "react";
import Case from "case";
import { systemName } from "../constants";
import { getDebugTranslations } from "../settingsHelpers";

type TranslateProps = {
  children: string,
  values?: {[key: string]: string},
};

export const Translate: React.FC<TranslateProps> = ({
  children,
  values,
}) => {
  const debug = getDebugTranslations();
  const pascal = useMemo(() => Case.pascal(children), [children]);
  const prefixed = `${systemName}.${pascal}`;
  const local = useMemo(() => game.i18n.format(prefixed, values), [prefixed, values]);
  const has = useMemo(() => (game.i18n as any).has(prefixed, false), [prefixed]);

  return (
    <span
      style={{
        background: debug ? (has ? "lightgreen" : "red") : "none",
      }}
    >
      {has ? local : children}
    </span>
  );
};
