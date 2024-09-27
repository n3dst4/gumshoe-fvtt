import { useActorSheetContext } from "../../hooks/useSheetContexts";
import { settings } from "../../settings/settings";
import { assertActiveCharacterActor } from "../../v10Types";
import { OtherableDropDown } from "../inputs/OtherableDropDown";
import { Translate } from "../Translate";

export const CharacterCombatAbilityPicker = () => {
  const { actor } = useActorSheetContext();
  assertActiveCharacterActor(actor);
  return (
    <>
      <h3 css={{ gridColumn: "start / end" }}>
        <Translate>Initiative</Translate>
      </h3>
      <OtherableDropDown
        value={actor.system.initiativeAbility}
        onChange={actor.setInitiativeAbility}
        pickerValues={settings.combatAbilities.get().toSorted()}
        validValues={actor.getGeneralAbilityNames()}
      />
    </>
  );
};

CharacterCombatAbilityPicker.displayName = "CharacterCombatAbilityPicker";
