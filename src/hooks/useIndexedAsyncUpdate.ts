import { useCallback } from "react";
import { useAsyncUpdate } from "./useAsyncUpdate";

// this is probably surplus to requirement

export const useIndexedAsyncUpdate = (
  value: string,
  onChangeOrig: (newValue: string, index: number) => void,
  index: number,
) => {
  const handleChange = useCallback(
    (newValue: string) => {
      onChangeOrig(newValue, index);
    },
    [index, onChangeOrig],
  );
  useAsyncUpdate(value, handleChange);
};
