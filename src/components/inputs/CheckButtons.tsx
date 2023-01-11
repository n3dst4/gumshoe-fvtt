import React, { Fragment, useCallback, useContext, useMemo } from "react";
import { nanoid } from "nanoid";
import { ThemeContext } from "../../themes/ThemeContext";

type CheckButtonsProps = {
  options: Array<{
    label: string;
    value: number;
    enabled: boolean;
    hover?: string;
  }>;
  selected: number;
  size?: number;
  onChange: (newValue: number) => void;
};

export const CheckButtons: React.FC<CheckButtonsProps> = ({
  options,
  selected,
  size = 1.4,
  onChange: onChangeOrig,
}) => {
  const theme = useContext(ThemeContext);
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.currentTarget.value);
      onChangeOrig(newValue);
    },
    [onChangeOrig],
  );

  const radioGroup = useMemo(() => nanoid(), []);

  return (
    <div
      css={{
        display: "flex",
        flexDirection: "row",
        gap: "0.3em",
        lineHeight: size,
        "input[type=radio]": {
          display: "none",
          "+label": {
            padding: "0",
            flex: 1,
            textAlign: "center",
            fontSize: size.toString() + "em",
            fontWeight: "bold",
            border: "2px groove white",
            backgroundColor: theme.colors.backgroundPrimary,
            paddingBottom: "0.3em",
            borderRadius: "0.2em",
            ":hover": {
              textShadow: `0 0 0.3em ${theme.colors.glow}`,
            },
          },
          "&:checked+label": {
            border: "2px inset white",
            backgroundColor: theme.colors.accent,
            color: theme.colors.accentContrast,
            textShadow: `0 0 0.3em ${theme.colors.glow}`,
          },
          "&[disabled]+label": {
            opacity: 0.3, //
            ":hover": {
              textShadow: "none",
            },
          },
        },
      }}
    >
      {options.map<JSX.Element>(({ label, value, enabled, hover }) => {
        const id = nanoid();
        return (
          <Fragment key={value}>
            <input
              name={radioGroup}
              id={id}
              type="radio"
              value={value}
              checked={value === selected}
              onChange={onChange}
              disabled={!enabled} //
            />
            <label htmlFor={id} tabIndex={0} title={hover}>
              {label}
            </label>
          </Fragment>
        );
      })}
    </div>
  );
};
