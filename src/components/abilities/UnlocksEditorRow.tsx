import React, { forwardRef, useCallback } from "react";

import { Unlock } from "../../types";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { AsyncTextInput } from "../inputs/AsyncTextInput";

interface UnlocksEditorRowProps {
  unlock: Unlock;
  index: number;
  onChangeRating: (index: number, rating: number) => void;
  onChangeDescription: (index: number, description: string) => void;
  onDelete: (index: number) => void;
}

export const UnlocksEditorRow = forwardRef<
  HTMLDivElement,
  UnlocksEditorRowProps
>(
  (
    {
      unlock: { rating, description },
      index,
      onChangeRating,
      onChangeDescription,
      onDelete,
    },
    ref,
  ) => {
    const onChangeRatingCallback = useCallback(
      (newVal: number) => {
        onChangeRating(index, newVal);
      },
      [index, onChangeRating],
    );
    const onChangeDescriptionCallback = useCallback(
      (newDescription: string) => {
        onChangeDescription(index, newDescription);
      },
      [index, onChangeDescription],
    );

    return (
      <div
        ref={ref}
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
            value={rating}
            onChange={onChangeRatingCallback}
          />
          <button
            css={{
              flexBasis: "min-content",
            }}
            onClick={() => {
              onDelete(index);
            }}
          >
            <i className="fas fa-trash" />
          </button>
        </div>
        <AsyncTextInput
          value={description}
          onChange={onChangeDescriptionCallback}
        />
      </div>
    );
  },
);

UnlocksEditorRow.displayName = "UnlocksEditorRow";
