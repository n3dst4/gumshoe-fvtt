import React, { useContext, useLayoutEffect, useMemo, useRef } from "react";

import { FoundryAppContext } from "../../../subtrees/shared-fvtt-bits/src/FoundryAppContext";
import { getTranslated } from "../../functions/getTranslated";
import { assertGame, systemLogger } from "../../functions/utilities";

const secretToggleButtonClass = "investigator-secret-hide-reveal-button";

interface NotesDisplayProps {
  className?: string;
  html: string;
  toggleSecret?: (index: number) => void;
}

export const NotesDisplay: React.FC<NotesDisplayProps> = ({
  className,
  html,
  toggleSecret,
}) => {
  assertGame(game);
  const application = useContext(FoundryAppContext);
  const user = game.user;

  const isOwner = useMemo(() => {
    let showSecrets = false;
    if (application instanceof DocumentSheet && user) {
      const myLevel = application.document.getUserLevel(user) ?? 0;
      if (myLevel === CONST.DOCUMENT_PERMISSION_LEVELS.OWNER) {
        showSecrets = true;
      }
    }

    return showSecrets;
  }, [application, user]);

  systemLogger.log("NotesDisplay", { html, showSecrets: isOwner });

  const ref = useRef<HTMLDivElement>(null);

  // this layout effect deals with adding reveal/hide buttons to secrets
  useLayoutEffect(() => {
    if (!isOwner || !toggleSecret) {
      return;
    }
    // remove all existing buttons
    ref.current
      ?.querySelectorAll(`button.${secretToggleButtonClass}`)
      .forEach((button) => {
        button.remove();
      });

    // add buttons
    ref.current?.querySelectorAll("section.secret").forEach((section, i) => {
      systemLogger.log("Adding reveal button", i);
      const toggleSecretButton = document.createElement("button");
      toggleSecretButton.textContent = getTranslated(
        section.classList.contains("revealed")
          ? "Hide secret"
          : "Reveal secret",
      );
      toggleSecretButton.classList.add(secretToggleButtonClass);
      toggleSecretButton.addEventListener("click", () => {
        toggleSecret(i);
      });
      section.append(toggleSecretButton);
    });
  }, [isOwner, toggleSecret]);

  return (
    <div
      ref={ref}
      className={className}
      css={{
        minHeight: "100%",
        "section.secret": {
          display: isOwner ? "block" : "none",
          "&.revealed": {
            display: "block",
          },
        },
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

NotesDisplay.displayName = "NotesDisplay";
