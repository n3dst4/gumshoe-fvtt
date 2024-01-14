import React from "react";

import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { HTMLEditor } from "./HTMLEditor";

interface HTMLPageProps {
  page: any;
}

export const HTMLPage: React.FC<HTMLPageProps> = ({ page }) => {
  // return <div>{page.text.content}</div>;

  return (
    <div
      data-testid="editor"
      css={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "0.5em",
      }}
    >
      <div data-testid="name">
        <AsyncTextInput
          value={page.name}
          onChange={async (value) => {
            await page.parent.updateEmbeddedDocuments("JournalEntryPage", [
              {
                _id: page.id,
                name: value,
              },
            ]);
          }}
        />
      </div>
      <div
        data-testid="main-area"
        css={{
          flex: 1,
        }}
      >
        <HTMLEditor page={page} />
      </div>
    </div>
  );
};

HTMLPage.displayName = "Editor";
