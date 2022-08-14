import { Stat } from "@lumphammer/investigator-fvtt-types";
import React, { useCallback, useContext } from "react";
import { useRefStash } from "../../hooks/useRefStash";
import { ThemeContext } from "../../themes/ThemeContext";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { Checkbox } from "../inputs/Checkbox";

interface StatSettingsRowProps {
  id: string;
  stat: Stat;
  index: number;
  onChange: (stat: Stat, id: string) => void;
  onChangeId: (oldId: string, newId: string) => void;
  onDelete: (id: string) => void;
}

export const StatSettingsRow: React.FC<StatSettingsRowProps> = ({
  id,
  stat,
  index,
  onChange,
  onChangeId,
  onDelete,
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

  const onChangeIdCallback = useCallback((newId: string) => {
    onChangeId(idRef.current, newId);
  }, [idRef, onChangeId]);

  const onChangeName = useCallback((name:string) => {
    onChange({
      ...statRef.current,
      name,
    }, idRef.current);
  }, [onChange, statRef, idRef]);

  const onDeleteHandler = useCallback((ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    onDelete(idRef.current);
  }, [onDelete, idRef]);

  return (
    <div
      css={{
        backgroundColor: isEven ? theme.colors.backgroundPrimary : undefined,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 2em",
        gridTemplateRows: "max-content",
        gridTemplateAreas: `
          "idLbl  idLbl  idLbl  nameLbl nameLbl nameLbl delete"
          "id     id     id     name    name    name    delete" 
          "defLbl defLbl minLbl minLbl  maxLbl  maxLbl  delete"
          "def    def    min    min     max     max     delete"
        `,
        gap: "0.3em",
        padding: "0.5em",
      }}
    >
      <span css={{ gridArea: "idLbl" }}>id</span>
      <span css={{ gridArea: "nameLbl" }}>Name</span>
        <AsyncTextInput
          css={{ gridArea: "id" }}
          onChange={onChangeIdCallback}
          value={id}
        />
        <AsyncTextInput
          css={{ gridArea: "name" }}
          onChange={onChangeName}
          value={stat.name}
        />

        <span css={{ gridArea: "defLbl" }}>Default</span>

        <span css={{ gridArea: "minLbl" }}>
          Min
          <Checkbox
            checked={stat.min !== undefined}
            onChange={onChangeMinCheckbox}
          />
        </span>

        <span css={{ gridArea: "maxLbl" }}>
          Max
          <Checkbox
            checked={stat.max !== undefined}
            onChange={onChangeMaxCheckbox}
          />
        </span>

        {stat.default !== undefined &&
          <AsyncNumberInput
            onChange={onChangeDefault}
            value={stat.default}
            min={stat.min}
            max={stat.max}
            css={{
              gridArea: "def",
            }}
          />
        }
        {stat.min !== undefined
          ? <AsyncNumberInput
            onChange={onChangeMin}
            value={stat.min}
            max={stat.max}
            css={{
              gridArea: "min",
            }}
          />
          : <span css={{ gridArea: "min" }} />
        }
        {stat.max !== undefined
          ? <AsyncNumberInput
            onChange={onChangeMax}
            value={stat.max}
            min={stat.min}
            css={{
              gridArea: "max",
            }}
          />
          : <span css={{ gridArea: "max" }} />
        }
        <button
          css={{ gridArea: "delete" }}
          onClick={onDeleteHandler}
        >
          <i className="fas fa-trash" />
        </button>
    </div>
  );
};
