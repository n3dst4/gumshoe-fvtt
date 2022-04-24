/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Stat } from "@lumphammer/investigator-fvtt-types";
import React, { useCallback, useContext } from "react";
import { useRefStash } from "../../hooks/useRefStash";
import { ThemeContext } from "../../themes/ThemeContext";
import { AsyncNumberInput } from "./AsyncNumberInput";
import { AsyncTextInput } from "./AsyncTextInput";
import { Checkbox } from "./Checkbox";

interface StatSettingsRowProps {
  id: string;
  stat: Stat;
  index: number;
  onChange: (stat: Stat, id: string) => void;
}

export const StatSettingsRow: React.FC<StatSettingsRowProps> = ({
  id,
  stat,
  index,
  onChange,
}: StatSettingsRowProps) => {
  const isEven = index % 2 === 0;
  const theme = useContext(ThemeContext);
  const statRef = useRefStash(stat);
  const idRef = useRefStash(id);

  const onChangeMinCheckbox = useCallback((checked: boolean) => {
    if (checked) {
      onChange({
        ...statRef.current,
        min: Math.min(statRef.current.default, statRef.current.max ?? 0),
      }, idRef.current);
    } else {
      onChange({
        ...statRef.current,
        min: undefined,
      }, idRef.current);
    }
  }, [onChange, statRef, idRef]);

  const onChangeMaxCheckbox = useCallback((checked: boolean) => {
    if (checked) {
      onChange({
        ...statRef.current,
        max: Math.max(statRef.current.default, statRef.current.min ?? 0),
      }, idRef.current);
    } else {
      onChange({
        ...statRef.current,
        max: undefined,
      }, idRef.current);
    }
  }, [onChange, statRef, idRef]);

  const onChangeDefault = useCallback((newDefault: number) => {
    onChange({
      ...statRef.current,
      default: newDefault,
    }, idRef.current);
  }, [onChange, statRef, idRef]);

  const onChangeMin = useCallback((min: number) => {
    onChange({
      ...statRef.current,
      min,
    }, idRef.current);
  }, [onChange, statRef, idRef]);

  const onChangeMax = useCallback((max: number) => {
    onChange({
      ...statRef.current,
      max,
    }, idRef.current);
  }, [onChange, statRef, idRef]);

  return (
    <div
      css={{
        backgroundColor: isEven ? theme.colors.backgroundPrimary : undefined,
        padding: "0.5em",
        ".flexRow": {
          display: "flex",
          flexDirection: "row",
          gap: "0.5em",
        },
      }}
    >
      <div
        className="flexRow"
        css={{ lineHeight: 1 }}
      >
        <span css={{ flex: 1 }}>id</span>
        <span css={{ flex: 1 }}>Name</span>
      </div>
      <div
        className="flexRow"
      >
        <AsyncTextInput
          css={{ flex: 1 }}
          onChange={() => {}}
          value={id}
        />
        <AsyncTextInput
          css={{ flex: 1 }}
          onChange={() => {}}
          value={stat.name}
        />
      </div>
      <div
        className="flexRow"
        css={{ lineHeight: 1 }}
      >
        <span css={{ flex: 1 }}>Default</span>
        <span css={{ flex: 1 }}>
          Min
          <Checkbox
            checked={stat.min !== undefined}
            onChange={onChangeMinCheckbox}
          />
        </span>
        <span css={{ flex: 1 }}>
          Max
          <Checkbox
            checked={stat.max !== undefined}
            onChange={onChangeMaxCheckbox}
          />
        </span>
      </div>
      <div
        className="flexRow"
      >
        {stat.default !== undefined &&
          <AsyncNumberInput
            onChange={onChangeDefault}
            value={stat.default}
            css={{
              flex: 1,
            }}
          />
        }
        {stat.min !== undefined
          ? <AsyncNumberInput
            onChange={onChangeMin}
            value={stat.min}
            css={{
              flex: 1,
            }}
          />
          : <span css={{ flex: 1 }} />
        }
        {stat.max !== undefined
          ? <AsyncNumberInput
            onChange={onChangeMax}
            value={stat.max}
            css={{
              flex: 1,
            }}
          />
          : <span css={{ flex: 1 }} />
        }
      </div>
    </div>
  );
};
