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

const transitionTime = 1000;

export const UnlocksEditor: React.FC<UnlocksEditorProps> = ({
  ability,
}: UnlocksEditorProps) => {
  assertAbilityDataSource(ability.data);

  // const unlocks = useMemo(() => {
  //   assertAbilityDataSource(ability.data);
  //   return ability.data.data.unlocks.map((unlock) => {
  //     return {
  //       unlock,
  //       ref: React.createRef<HTMLDivElement>(),
  //     };
  //   });
  // }, [ability.data]);

  const transitionedUnlocks = useListShowHideTransition(
    ability.data.data.unlocks,
    (unlock) => unlock.id,
    transitionTime,
  );

  console.log("rendering UnlocksEditor", transitionedUnlocks);

  return (
    <div
      css={{
        marginBottom: "1em",
      }}
    >
      {transitionedUnlocks.map<ReactNode>(({ item: unlock, isShowing }, i) => {
        return (
          <div
            key={unlock.id}
            style={{
              transition: `opacity ${transitionTime}ms ease-in-out`,
              opacity: isShowing ? 1 : 0,
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
      })}
      {/* <TransitionGroup>
        {unlocks.map<ReactNode>(({ unlock, ref }, i) => {
          return (
            <CSSTransition
              key={unlock.id}
              timeout={500}
              classNames={fadeInOutClasses}
              nodeRef={ref}
            >
              <UnlocksEditorRow
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
      </TransitionGroup> */}
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
