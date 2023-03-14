import React, { ReactNode } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { assertAbilityDataSource } from "../../typeAssertions";
import { Translate } from "../Translate";
import { UnlocksEditorRow } from "./UnlocksEditorRow";

interface UnlocksEditorProps {
  ability: InvestigatorItem;
}

export const UnlocksEditor: React.FC<UnlocksEditorProps> = ({
  ability,
}: UnlocksEditorProps) => {
  assertAbilityDataSource(ability.data);
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
            onChangeDescription={ability.setUnlockDescription}
            onChangeRating={ability.setUnlockRating}
            onDelete={ability.deleteUnlock}
          />
        );
      })}
      <button
        onClick={ability.addUnlock}
        css={{
          margin: 0,
        }}
      >
        <i className="fas fa-plus" /> <Translate>Add item</Translate>
      </button>
    </div>
  );
};
