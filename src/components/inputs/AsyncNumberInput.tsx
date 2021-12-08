/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { TextInput } from "./TextInput";

type AsyncNumberInputProps = {
  value: undefined|number,
  onChange: (newValue: number) => void,
  className?: string,
  min?: number,
  max?: number,
  disabled?: boolean,
  noPlusMinus?: boolean,
};

export type ValidationResult = {
  validation: "failed",
  reasons: string[],
} | {
  validation: "succeeded",
  value: number,
}

const adjust = (display: string, by: number, min?: number, max?: number) => {
  let result = Number(display) + by;
  if (Number.isNaN(result)) {
    result = 0;
  }
  if (max !== undefined) {
    result = Math.min(max, result);
  }
  if (min !== undefined) {
    result = Math.max(min, result);
  }
  return result.toString();
};

export const AsyncNumberInput: React.FC<AsyncNumberInputProps> = ({
  value,
  onChange: onChangeOrig,
  className,
  min,
  max,
  disabled,
  noPlusMinus,
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

  const onClickInc = useCallback(() => {
    onChange(adjust(display, +1, min, max));
  }, [display, max, min, onChange]);

  const onClickDec = useCallback(() => {
    onChange(adjust(display, -1, min, max));
  }, [display, max, min, onChange]);

  const result = validate(display);

  return (
    <div
      css={{
        display: "flex",
        flexDirection: "row",
      }}
      className={className}
    >
      {(noPlusMinus === undefined || !noPlusMinus) &&
        <button
          css={{
            lineHeight: "inherit",
            flexBasis: "min-content",
            flex: 0,
          }}
          onClick={onClickDec}
          disabled={disabled}
        >
          <i className="fa fa-minus" />
        </button>
      }
      {(noPlusMinus === undefined || !noPlusMinus) &&
        <button
          css={{
            lineHeight: "inherit",
            flexBasis: "min-content",
            flex: 0,
          }}
          onClick={onClickInc}
          disabled={disabled}
        >
          <i className="fa fa-plus" />
        </button>
      }
      <TextInput
        css={css`
          flex: 1;
          flex-basis: min-content;
          color: ${result.validation === "failed" ? "red" : undefined};
          user-select: "text";
        `}
        value={display}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
      />

    </div>
  );
};
