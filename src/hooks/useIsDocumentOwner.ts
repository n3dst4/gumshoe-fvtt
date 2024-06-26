import { FoundryAppContext } from "@lumphammer/shared-fvtt-bits/src/FoundryAppContext";
import { useContext, useMemo } from "react";

import { assertGame } from "../functions/utilities";

/**
 * Check if the current user is the owner of the document.
 *
 * If we ever need to use this in a non-document-sheet context, it would
 * probably be better to create a new react context
 */
export function useIsDocumentOwner() {
  assertGame(game);

  const application = useContext(FoundryAppContext);
  const user = game.user;

  const isOwner = useMemo(() => {
    let showSecrets = false;
    if (application instanceof DocumentSheet && user) {
      const myLevel = application.document.getUserLevel(user) ?? 0;
      // @ts-expect-error types still have DOCUMENT_PERMISSION_LEVELS
      if (myLevel === CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER) {
        showSecrets = true;
      }
    }

    return showSecrets;
  }, [application, user]);

  return isOwner;
}
