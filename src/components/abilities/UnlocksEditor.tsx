/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ReactNode, useCallback } from "react";
import { assertAbilityDataSource } from "../../types";
import { Translate } from "../Translate";
import { UnlocksEditorRow } from "./UnlocksEditorRow";

interface UnlocksEditorProps {
  ability: Item;
}

export const UnlocksEditor: React.FC<UnlocksEditorProps> = ({
  ability,
}: UnlocksEditorProps) => {
  assertAbilityDataSource(ability.data);
  const onClickAdd = useCallback(() => {
    assertAbilityDataSource(ability.data);
    ability.update({
      data: {
        unlocks: [...ability.data.data.unlocks, { rank: 8, description: "" }],
      },
    });
  }, [ability]);
  const onChangeDescription = useCallback((index: number, description: string) => {
    assertAbilityDataSource(ability.data);
    const unlocks = [...ability.data.data.unlocks];
    unlocks[index].description = description;
    ability.update({
      data: { unlocks },
    });
  }, [ability]);
  const onChangeRank = useCallback((index: number, rank: number) => {
    assertAbilityDataSource(ability.data);
    const unlocks = [...ability.data.data.unlocks];
    unlocks[index].rank = rank;
    ability.update({
      data: { unlocks },
    });
  }, [ability]);
  const onDelete = useCallback((index: number) => {
    assertAbilityDataSource(ability.data);
    const unlocks = [...ability.data.data.unlocks];
    unlocks.splice(index, 1);
    ability.update({
      data: { unlocks },
    });
  }, [ability]);
  return (
    <div
      css={{
        marginBottom: "1em",
      }}
    >
      {ability.data.data.unlocks.map<ReactNode>((unlock, i) => {
        return (
          <UnlocksEditorRow
            key={i}
            index={i}
            unlock={unlock}
            onChangeDescription={onChangeDescription}
            onChangeRank={onChangeRank}
            onDelete={onDelete}
          />
        );
      })}
      <button
        onClick={onClickAdd}
      >
        <i className="fas fa-plus"/> <Translate>Add item</Translate>
      </button>

    </div>
  );
};
