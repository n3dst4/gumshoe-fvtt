import React, { ReactNode } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { Translate } from "../Translate";
import { UnlocksEditorRow } from "./UnlocksEditorRow";
import { useListShowHideTransition } from "../transitions/useListShowHideTransition";
import { getListTransitionStyles } from "./getListTransitionStyles";
import { assertAbilityItem } from "../../v10Types";

interface UnlocksEditorProps {
  ability: InvestigatorItem;
}

const transitionTime = 400;

export const UnlocksEditor: React.FC<UnlocksEditorProps> = ({
  ability,
}: UnlocksEditorProps) => {
  assertAbilityItem(ability);

  const transitionedUnlocks = useListShowHideTransition(
    ability.system.unlocks,
    (unlock) => unlock.id,
    transitionTime,
  );

  return (
    <div
      css={{
        marginBottom: "1em",
      }}
    >
      {transitionedUnlocks.map<ReactNode>(
        ({ item: unlock, isShowing, isEntering, key }, i) => {
          return (
            <div
              key={key}
              style={getListTransitionStyles(
                isShowing,
                isEntering,
                transitionTime,
              )}
            >
              <UnlocksEditorRow
                index={i}
                unlock={unlock}
                onChangeDescription={ability.setUnlockDescription}
                onChangeRating={ability.setUnlockRating}
                onDelete={ability.deleteUnlock}
              />
            </div>
          );
        },
      )}
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
