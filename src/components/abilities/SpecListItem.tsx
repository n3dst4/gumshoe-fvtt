/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { AsyncTextInput } from "../inputs/AsyncTextInput";

type SpecListItemProps = {
  onChange: (value: string, index: number) => void,
  index: number,
  value: string,
  disabled?: boolean,
};

export const SpecListItem: React.FC<SpecListItemProps> = ({
  onChange: onChangeProp,
  index,
  value,
  disabled = false,
}) => {
  const onChange = useCallback((newVal: string) => {
    onChangeProp(newVal, index);
  }, [index, onChangeProp]);

  return (
    <AsyncTextInput
      value={value}
      onChange={onChange}
      disabled={disabled}
      // css={{

      // }}
    />
  );
};
