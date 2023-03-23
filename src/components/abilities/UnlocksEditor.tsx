import React, { ReactNode } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { assertAbilityDataSource } from "../../typeAssertions";
import { Translate } from "../Translate";
import { UnlocksEditorRow } from "./UnlocksEditorRow";
// import { TransitionGroup, CSSTransition } from "react-transition-group";
// import { fadeInOutClasses } from "./fadeInOutClasses";
import { useListShowHideTransition } from "../transitions/useListShowHideTransition";

interface UnlocksEditorProps {
  ability: InvestigatorItem;
}

const transitionTime = 400;

export const UnlocksEditor: React.FC<UnlocksEditorProps> = ({
  ability,
}: UnlocksEditorProps) => {
  assertAbilityDataSource(ability.data);

  const transitionedUnlocks = useListShowHideTransition(
    ability.data.data.unlocks,
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
              style={{
                transition: `opacity ${transitionTime}ms ease-in-out, transform ${transitionTime}ms ease-in-out`,
                opacity: isShowing ? 1 : 0,
                transform: isShowing
                  ? "none"
                  : isEntering
                  ? "translateX(-40px)"
                  : "translateX(40px)",
              }}
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
