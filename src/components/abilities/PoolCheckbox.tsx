/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";

type PoolCheckboxProps = {
  value: number,
  selected: boolean,
  disabled: boolean,
  onClick: (value: number) => void,
};

export const PoolCheckbox: React.FC<PoolCheckboxProps> = ({
  value,
  selected,
  disabled,
  onClick: onClickProp,
}) => {
  const onClick = useCallback(() => {
    if (!disabled) {
      onClickProp(value);
    }
  }, [disabled, onClickProp, value]);

  return (
    <a
      tabIndex={disabled ? undefined : 0}
      onClick={onClick}
      css={{
        width: "auto",
        height: "1.5em",
        background: selected ? "#d44" : "#fff",
        textAlign: "center",
        display: "inline-block",
        position: "relative",
        opacity: disabled ? 0.3 : 1,
      }}
    >
      {value}
      {disabled &&
        <i
          className="fa fa-times"
          css={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      }
    </a>
  );
}
;
