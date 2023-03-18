import React, { ReactNode } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { assertAbilityDataSource } from "../../typeAssertions";
import { Translate } from "../Translate";
import { UnlocksEditorRow } from "./UnlocksEditorRow";
import { TransitionGroup } from "react-transition-group";
import { FadeInOutCSSTransition } from "./FadeInOutCSSTransition";

interface UnlocksEditorProps {
  ability: InvestigatorItem;
}

export const UnlocksEditor: React.FC<UnlocksEditorProps> = ({
  ability,
}: UnlocksEditorProps) => {
  assertAbilityDataSource(ability.data);
  const unlocks = ability.data.data.unlocks.map((unlock) => {
    return {
      unlock,
      ref: React.createRef<HTMLDivElement>(),
    };
  });

  return (
    <div
      css={{
        marginBottom: "1em",
      }}
    >
      <TransitionGroup>
        {unlocks.map<ReactNode>(({ unlock, ref }, i) => {
          return (
            <FadeInOutCSSTransition key={unlock.id} nodeRef={ref}>
              <UnlocksEditorRow
                key={i}
                ref={ref}
                index={i}
                unlock={unlock}
                onChangeDescription={ability.setUnlockDescription}
                onChangeRating={ability.setUnlockRating}
                onDelete={ability.deleteUnlock}
              />
            </FadeInOutCSSTransition>
          );
        })}
      </TransitionGroup>
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
