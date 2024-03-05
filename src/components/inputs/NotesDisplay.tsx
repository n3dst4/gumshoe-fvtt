import React, { useContext, useMemo } from "react";

import { FoundryAppContext } from "../../../subtrees/shared-fvtt-bits/src/FoundryAppContext";
import { assertGame, systemLogger } from "../../functions/utilities";

interface NotesDisplayProps {
  className?: string;
  html: string;
}

export const NotesDisplay: React.FC<NotesDisplayProps> = ({
  className,
  html,
}) => {
  assertGame(game);
  const application = useContext(FoundryAppContext);
  const user = game.user;

  const showSecrets = useMemo(() => {
    let showSecrets = false;
    if (application instanceof DocumentSheet && user) {
      const myLevel = application.document.getUserLevel(user) ?? 0;
      if (myLevel === CONST.DOCUMENT_PERMISSION_LEVELS.OWNER) {
        showSecrets = true;
      }
    }

    return showSecrets;
  }, [application, user]);

  systemLogger.log("NotesDisplay", { html, showSecrets });

  return (
    <div
      className={className}
      css={{
        minHeight: "100%",
        "section.secret": {
          display: showSecrets ? "block" : "none",
          ".revealed": {
            display: "block",
          },
        },
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

NotesDisplay.displayName = "NotesDisplay";
