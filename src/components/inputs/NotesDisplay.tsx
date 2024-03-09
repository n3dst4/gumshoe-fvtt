import React, { useContext, useLayoutEffect, useMemo, useRef } from "react";

import { FoundryAppContext } from "../../../subtrees/shared-fvtt-bits/src/FoundryAppContext";
import { assertGame, systemLogger } from "../../functions/utilities";

interface NotesDisplayProps {
  className?: string;
  html: string;
  toggleSecret: (index: number) => void;
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

  // this layout effect deals with adding reveal/hiode buttons to secrets
  useLayoutEffect(() => {
    if (!isOwner) {
      return;
    }
    // remove all existing buttons
    ref.current?.querySelectorAll("section.secret").forEach((section, i) => {
      section
        .querySelectorAll("button[aria-label='Reveal secret']")
        .forEach((button) => {
          button.remove();
        });

      systemLogger.log("Adding reveal button", i);
      const revealButton = document.createElement("button");
      // add aria-label to reveal button
      revealButton.setAttribute("aria-label", "Reveal secret");
      revealButton.textContent = section.classList.contains("revealed")
        ? "Hide secret"
        : "Reveal secret";
      revealButton.classList.add("investigator-secret-reveal-button");
      revealButton.addEventListener("click", () => {
        toggleSecret(i);
      });
      section.append(revealButton);
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
