import Case from "case";
import React, { useMemo } from "react";

import { systemId } from "../constants";
import { assertGame, getDevMode } from "../functions";
import { settings } from "../settings";

type TranslateProps = {
  children: string;
  values?: { [key: string]: string };
  title?: string;
};

export const Translate: React.FC<TranslateProps> = ({
  children,
  values,
  title,
}) => {
  assertGame(game);
  const debug = settings.debugTranslations.get() && getDevMode();
  const pascal = useMemo(() => Case.pascal(children), [children]);
  const prefixed = `${systemId}.${pascal}`;
  const local = useMemo(() => {
    assertGame(game);
    return game.i18n.format(prefixed, values);
  }, [prefixed, values]);
  const has = useMemo(() => {
    assertGame(game);
    return game.i18n.has(prefixed, false);
  }, [prefixed]);

  return (
    <span
      title={title ?? (debug ? prefixed : local)}
      style={{
        background: debug ? (has ? "lightgreen" : "red") : "none",
      }}
    >
      {local}
    </span>
  );
};
