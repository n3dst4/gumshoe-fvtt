import React, { ReactNode, useMemo } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { assertAbilityDataSource } from "../../typeAssertions";
import { Translate } from "../Translate";
import { fadeInOutClasses } from "./fadeInOutClasses";
import { SituationalModifiersEditorRow } from "./SituationalModifiersEditorRow";

interface SituationalModifiersEditorProps {
  ability: InvestigatorItem;
}

export const SituationalModifiersEditor: React.FC<
  SituationalModifiersEditorProps
> = ({ ability }: SituationalModifiersEditorProps) => {
  assertAbilityDataSource(ability.data);
  const situationalModifiers = useMemo(() => {
    assertAbilityDataSource(ability.data);
    return ability.data.data.situationalModifiers.map((situationalModifier) => {
      return {
        situationalModifier,
        ref: React.createRef<HTMLDivElement>(),
      };
    });
  }, [ability.data]);

  return (
    <div
      css={{
        marginBottom: "1em",
      }}
    >
      <TransitionGroup>
        {situationalModifiers.map<ReactNode>(
          ({ situationalModifier, ref }, i) => {
            return (
              <CSSTransition
                key={situationalModifier.id}
                timeout={500}
                classNames={fadeInOutClasses}
                nodeRef={ref}
              >
                <SituationalModifiersEditorRow
                  index={i}
                  ref={ref}
                  situationalModifier={situationalModifier}
                  onChangeSituation={ability.setSituationalModifierSituation}
                  onChangeModifier={ability.setSituationalModifierModifier}
                  onDelete={ability.deleteSituationalModifier}
                />
              </CSSTransition>
            );
          },
        )}
      </TransitionGroup>
      <button
        onClick={ability.addSituationalModifier}
        css={{
          margin: 0,
        }}
      >
        <i className="fas fa-plus" /> <Translate>Add item</Translate>
      </button>
    </div>
  );
};
