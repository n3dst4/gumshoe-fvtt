import React, { useContext, useLayoutEffect, useMemo, useRef } from "react";

import { FoundryAppContext } from "../../../subtrees/shared-fvtt-bits/src/FoundryAppContext";
import { assertGame, systemLogger } from "../../functions/utilities";

interface NotesDisplayProps {
  className?: string;
  html: string;
  revealSecret: (index: number) => void;
}

export const NotesDisplay: React.FC<NotesDisplayProps> = ({
  className,
  html,
  revealSecret,
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

  useLayoutEffect(() => {
    ref.current?.querySelectorAll("section.secret").forEach((section, i) => {
      if (section.querySelector("button[aria-label='Reveal secret']")) {
        systemLogger.log("Reveal button already exists", i);
        return;
      }

      systemLogger.log("Adding reveal button", i);
      section.classList.contains("revealed");
      const revealButton = document.createElement("button");
      // add aria-label to reveal button
      revealButton.setAttribute("aria-label", "Reveal secret");
      revealButton.textContent = "Reveal secret";
      revealButton.addEventListener("click", () => {
        revealSecret(i);
      });
      section.append(revealButton);
    });
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      css={{
        minHeight: "100%",
        "section.secret": {
          display: isOwner ? "block" : "none",
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
