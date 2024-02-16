import React, { useCallback, useMemo } from "react";
import { MdOutlineHistory } from "react-icons/md";

import { HTMLEditor } from "./HTMLEditor";
import { HTMLHistory } from "./HTMLHistory";
import { ToolbarButton, useToolbarContent } from "./magicToolbar";

interface HTMLPageProps {
  page: any;
}

enum Mode {
  Edit = "edit",
  History = "history",
}

export const HTMLPage: React.FC<HTMLPageProps> = ({ page }) => {
  const [mode, setMode] = React.useState(Mode.Edit);

  const setEdit = useCallback(() => setMode(Mode.Edit), []);
  const setHistory = useCallback(() => setMode(Mode.History), []);

  // When page id changes, reset to edit mode
  React.useEffect(() => {
    setEdit();
  }, [page.id, setEdit]);

  const historyButton = useMemo(
    () => (
      <ToolbarButton
        onClick={setHistory}
        text="History"
        icon={MdOutlineHistory}
        disabled={mode === Mode.History}
      />
    ),
    [mode, setHistory],
  );

  useToolbarContent("HTML", historyButton);

  if (mode === Mode.Edit) {
    return <HTMLEditor key={page.id} page={page} />;
  } else {
    return <HTMLHistory key={page.id} page={page} onDone={setEdit} />;
  }
};

HTMLPage.displayName = "HTMLPage";
