/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useEffect } from "react";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { getCombatAbilities } from "../../settingsHelpers";
import { assertActiveCharacterDataSource, ActiveCharacterDataSource } from "../../types";

type InitDropDownProps = {
  actor: InvestigatorActor,
};

export const InitDropDown: React.FC<InitDropDownProps> = ({
  actor,
}) => {
  assertActiveCharacterDataSource(actor.data);

  const [actorInitiativeAbility, setActorInitiativeAbility] = React.useState(
    actor.getInitiativeAbility(),
  );

  useEffect(() => {
    const callback = (actor: Actor, diff: {_id: string, data: DeepPartial<ActiveCharacterDataSource>}, options: unknown, id: string) => {
      assertActiveCharacterDataSource(actor?.data);
      setActorInitiativeAbility(actor?.data?.data?.initiativeAbility);
      console.log("hooked");
      console.log(actor);
    };
    Hooks.on("updateActor", callback);
    return () => {
      Hooks.off("updateActor", callback);
    };
  }, [actor?.data?.data?.initiativeAbility]);

  const onSelectInitiativeAbility = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedAbility = e.currentTarget.value;
      actor.setInitiativeAbility(selectedAbility);
    },
    [actor],
  );

  return (
    <select
      value={actorInitiativeAbility}
      onChange={onSelectInitiativeAbility}
      css={{ width: "9.5em" }}
    >
      {getCombatAbilities().sort().map<JSX.Element>((ability) => (
        <option key={ability} value={ability}>{ability}</option>
      ))}
    </select>
  );
};
