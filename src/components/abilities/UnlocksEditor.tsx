import React, { ReactNode } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { assertAbilityDataSource } from "../../typeAssertions";
import { Translate } from "../Translate";
import { UnlocksEditorRow } from "./UnlocksEditorRow";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { css } from "@emotion/css";
import { CSSTransitionClassNames } from "react-transition-group/CSSTransition";

interface UnlocksEditorProps {
  ability: InvestigatorItem;
}

export const opacityDuration = 400;
const opacityTransition = `opacity ${opacityDuration}ms`;

export const fadeInOutClasses: CSSTransitionClassNames = {
  enter: css({
    opacity: 0,
  }),
  enterActive: css({
    opacity: 1,
    maxHeight: "100%",
    transition: `${opacityTransition} ease-in-out`,
  }),
  exit: css({
    opacity: 1,
  }),
  exitActive: css({
    opacity: 0,
    transition: `${opacityTransition} ease-in-out`,
  }),
};

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
            <CSSTransition
              key={i}
              nodeRef={ref}
              timeout={500}
              classNames={fadeInOutClasses}
            >
              <UnlocksEditorRow
                key={i}
                ref={ref}
                index={i}
                unlock={unlock}
                onChangeDescription={ability.setUnlockDescription}
                onChangeRating={ability.setUnlockRating}
                onDelete={ability.deleteUnlock}
              />
            </CSSTransition>
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
