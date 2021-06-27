/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useMemo } from "react";

import Case from "case";

type TranslateProps = {
  children: string,
  values?: {[key: string]: string},
};

const prefix = "Investigator";

export const Translate: React.FC<TranslateProps> = ({
  children,
  values,
}) => {
  const pascal = useMemo(() => Case.pascal(children), [children]);
  const prefixed = `${prefix}.${pascal}`;
  const local = useMemo(() => game.i18n.format(prefixed, values), [prefixed, values]);
  return (
    <span>{local}</span>
  );
};
