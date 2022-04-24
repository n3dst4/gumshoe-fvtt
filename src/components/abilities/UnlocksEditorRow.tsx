/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { Unlock } from "../../types";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { AsyncTextInput } from "../inputs/AsyncTextInput";

interface UnlocksEditorRowProps {
  unlock: Unlock;
  index: number;
  onChangeRank: (index: number, rank: number) => void;
  onChangeDescription: (index: number, description: string) => void;
  onDelete: (index: number) => void;
}

export const UnlocksEditorRow: React.FC<UnlocksEditorRowProps> = ({
  unlock: { rank, description },
  index,
  onChangeRank,
  onChangeDescription,
  onDelete,
}: UnlocksEditorRowProps) => {
  const onChangeRankCallback = useCallback((newVal) => {
    onChangeRank(index, newVal);
  }, [index, onChangeRank]);
  const onChangeDescriptionCallback = useCallback((newDescription) => {
    onChangeDescription(index, newDescription);
  }, [index, onChangeDescription]);

  return (
    <div
      css={{
        marginBottom: "0.5em",
      }}
    >
      <div
        css={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <AsyncNumberInput
          css={{
            flex: 1,
          }}
          value={rank}
          onChange={onChangeRankCallback}
        />
        <button
          css={{
            flexBasis: "min-content",
          }}
          onClick={() => { onDelete(index); }}
        >
          <i className="fas fa-trash"/>
        </button>

      </div>
      <AsyncTextInput
        value={description}
        onChange={onChangeDescriptionCallback}
      />
    </div>
  );
};
