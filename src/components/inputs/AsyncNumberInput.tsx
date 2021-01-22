/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { useCallback, useContext } from "react";
import { useAsyncUpdate } from "../../hooks/useAsyncUpdate";
import { IdContext } from "../IdContext";

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
    setValue,
  } = useAsyncUpdate((value || 0).toString(), onChangeString);

  const onClickInc = useCallback(() => {
    setValue((Number(display) + 1).toString());
  }, [display, setValue]);

  const onClickDec = useCallback(() => {
    setValue((Number(display) - 1).toString());
  }, [display, setValue]);

  const result = validate(display);

  const id = useContext(IdContext);

  return (
    <div
      css={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <button
        css={{
          lineHeight: "inherit",
          flexBasis: "min-content",
          flex: 0,
        }}
        onClick={onClickInc}
      >
        <i className="fa fa-plus" />
      </button>
      <button
        css={{
          lineHeight: "inherit",
          flexBasis: "min-content",
          flex: 0,
        }}
        onClick={onClickDec}
      >
        <i className="fa fa-minus" />
      </button>
      <input
        id={id}
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

    </div>
  );
};
