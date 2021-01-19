/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { useAsyncUpdate } from "../hooks/useAsyncUpdate";

type AsyncNumberInputProps = {
  value: undefined|number,
  onChange: (newValue: number) => void,
  className?: string,
  min?: number,
  max?: number,
};

export type ValidationResult = {
  validation: "failed",
  reasons: string[],
} | {
  validation: "succeeded",
  value: number,
}

export const AsyncNumberInput: React.FC<AsyncNumberInputProps> = ({
  value,
  onChange: onChangeOrig,
  className,
  min,
  max,
}) => {
  const validate = useCallback((text: string): ValidationResult => {
    const num = Number(text);
    if (Number.isNaN(num)) {
      return ({
        validation: "failed",
        reasons: ["Not a number"],
      });
    } else if (min !== undefined && num < min) {
      return ({
        validation: "failed",
        reasons: ["Too low"],
      });
    } else if (max !== undefined && num > max) {
      return ({
        validation: "failed",
        reasons: ["Too high"],
      });
    } else {
      return ({
        validation: "succeeded",
        value: num,
      });
    }
  }, [max, min]);

  const onChangeString = useCallback((text: string) => {
    const result = validate(text);
    if (result.validation === "succeeded") {
      onChangeOrig(result.value);
    }
  }, [onChangeOrig, validate]);

  const {
    display,
    onBlur,
    onChange,
    onFocus,
  } = useAsyncUpdate((value || 0).toString(), onChangeString);

  const result = validate(display);

  return (
    <input
      css={css`
        flex: 1;
        width: 100%;
        color: ${result.validation === "failed" ? "red" : undefined};
        user-select: "text";
      `}
      className={className}
      data-lpignore="true"
      value={display}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};
