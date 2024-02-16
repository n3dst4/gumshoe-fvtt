import React from "react";

import { settings } from "../../settings/settings";
import { createDocumentMemory } from "./documentMemory/createDocumentMemory";
import { getAccessibleEdits } from "./documentMemory/getAccessibleEdits";

interface HTMLHistoryProps {
  page: any;
  onDone: () => void;
}

export const HTMLHistory: React.FC<HTMLHistoryProps> = ({ page }) => {
  const memory =
    settings.journalMemories.get()?.[page.id] || createDocumentMemory(30);
  const revisions = getAccessibleEdits(memory);
  return (
    <div>
      <h3>Revisions</h3>
      {revisions.map((edit) => (
        <div key={edit.serial}>
          <div>
            {edit.serial}: {new Date(edit.timestamp * 1000).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

HTMLHistory.displayName = "HTMLHistory";
