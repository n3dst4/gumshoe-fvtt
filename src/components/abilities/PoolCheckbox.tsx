import React, { useCallback, useContext } from "react";
import { ThemeContext } from "../../themes/ThemeContext";

type PoolCheckboxProps = {
  value: number,
  selected: boolean,
  onClick: (value: number) => void,
};

export const PoolCheckbox: React.FC<PoolCheckboxProps> = ({
  value,
  selected,
  onClick: onClickProp,
}) => {
  const onClick = useCallback(() => {
    onClickProp(value);
  }, [onClickProp, value]);

  const theme = useContext(ThemeContext);

  return (
    <a
      tabIndex={0}
      onClick={onClick}
      css={{
        width: "auto",
        height: "1.2em",
        background: selected ? theme.colors.accent : theme.colors.backgroundPrimary,
        color: `${selected ? theme.colors.accentContrast : undefined} !important`,
        textAlign: "center",
        display: "inline-block",
        position: "relative",
      }}
    >
      {value}
    </a>
  );
}
;
