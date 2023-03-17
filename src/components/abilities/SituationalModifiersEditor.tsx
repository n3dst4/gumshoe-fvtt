import React, { ReactNode } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { assertAbilityDataSource } from "../../typeAssertions";
import { Translate } from "../Translate";
import { SituationalModifiersEditorRow } from "./SituationalModifiersEditorRow";

interface SituationalModifiersEditorProps {
  ability: InvestigatorItem;
}

export const SituationalModifiersEditor: React.FC<
  SituationalModifiersEditorProps
> = ({ ability }: SituationalModifiersEditorProps) => {
  assertAbilityDataSource(ability.data);
  return (
    <div
      css={{
        marginBottom: "1em",
      }}
    >
      {ability.data.data.situationalModifiers.map<ReactNode>(
        (situationalModifier, i) => {
          return (
            <SituationalModifiersEditorRow
              key={i}
              index={i}
              situationalModifier={situationalModifier}
              onChangeSituation={ability.setSituationalModifierSituation}
              onChangeModifier={ability.setSituationalModifierModifier}
              onDelete={ability.deleteSituationalModifier}
            />
          );
        },
      )}
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
