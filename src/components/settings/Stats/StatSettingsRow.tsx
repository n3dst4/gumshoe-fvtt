import { Stat } from "@lumphammer/investigator-fvtt-types";
import React, { useCallback, useContext } from "react";
import { useRefStash } from "../../../hooks/useRefStash";
import { ThemeContext } from "../../../themes/ThemeContext";
import { AsyncNumberInput } from "../../inputs/AsyncNumberInput";
import { AsyncTextInput } from "../../inputs/AsyncTextInput";
import { Checkbox } from "../../inputs/Checkbox";
import { DispatchContext } from "../contexts";
import { slice } from "../reducer";
import { PcOrNpc } from "../types";

interface StatSettingsRowProps {
  index: number;
  which: PcOrNpc;
  id: string;
  stat: Stat;
}

export const StatSettingsRow: React.FC<StatSettingsRowProps> = ({
  id,
  stat,
  index,
  which,
}: StatSettingsRowProps) => {
  const dispatch = useContext(DispatchContext);
  const isEven = index % 2 === 0;
  const theme = useContext(ThemeContext);
  const statRef = useRefStash(stat);
  const idRef = useRefStash(id);

  const handleChangeMinCheckbox = useCallback((checked: boolean) => {
    const value = checked
      ? Math.min(statRef.current.default, statRef.current.max ?? 0)
      : undefined;
    dispatch(slice.creators.setStatMin({ which, id: idRef.current, value }));
  }, [dispatch, which, idRef, statRef]);

  const handleChangeMaxCheckbox = useCallback((checked: boolean) => {
    const value = checked
      ? Math.max(statRef.current.default, statRef.current.min ?? 0)
      : undefined;
    dispatch(slice.creators.setStatMax({ which, id: idRef.current, value }));
  }, [statRef, dispatch, which, idRef]);

  const handleChangeDefault = useCallback((value: number) => {
    dispatch(slice.creators.setStatDefault({ which, id: idRef.current, value }));
  }, [dispatch, which, idRef]);

  const handleChangeMin = useCallback((value: number) => {
    dispatch(slice.creators.setStatMin({ which, id: idRef.current, value }));
  }, [dispatch, which, idRef]);

  const handleChangeMax = useCallback((value: number) => {
    dispatch(slice.creators.setStatMax({ which, id: idRef.current, value }));
  }, [dispatch, which, idRef]);

  const handleChangeIdCallback = useCallback((newId: string) => {
    dispatch(slice.creators.setStatId({ which, oldId: idRef.current, newId }));
  }, [dispatch, idRef, which]);

  const handleChangeName = useCallback((name:string) => {
    dispatch(slice.creators.setStatName({ which, id: idRef.current, name }));
  }, [dispatch, idRef, which]);

  const handleDelete = useCallback((ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    dispatch(slice.creators.deleteStat({ which, id: idRef.current }));
  }, [dispatch, which, idRef]);

  return (
    <div
      css={{
        backgroundColor: isEven ? theme.colors.backgroundPrimary : undefined,
        display: "grid",
        gridTemplateRows: "max-content",
        gridTemplateColumns:
          "1fr    1fr    1fr    1fr     1fr     1fr     2em",
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
          onChange={handleChangeIdCallback}
          value={id}
        />
        <AsyncTextInput
          css={{ gridArea: "name" }}
          onChange={handleChangeName}
          value={stat.name}
        />

        <span css={{ gridArea: "defLbl" }}>Default</span>

        <span css={{ gridArea: "minLbl" }}>
          Min
          <Checkbox
            checked={stat.min !== undefined}
            onChange={handleChangeMinCheckbox}
          />
        </span>

        <span css={{ gridArea: "maxLbl" }}>
          Max
          <Checkbox
            checked={stat.max !== undefined}
            onChange={handleChangeMaxCheckbox}
          />
        </span>

        {stat.default !== undefined &&
          <AsyncNumberInput
            onChange={handleChangeDefault}
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
            onChange={handleChangeMin}
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
            onChange={handleChangeMax}
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
          onClick={handleDelete}
        >
          <i className="fas fa-trash" />
        </button>
    </div>
  );
};
