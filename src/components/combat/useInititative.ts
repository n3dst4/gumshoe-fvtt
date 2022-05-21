import { useCallback } from "react";
import { assertGame } from "../../functions";
import { useRefStash } from "../../hooks/useRefStash";
import { InvestigatorCombat } from "../../module/InvestigatorCombat";
import { assertActiveCharacterDataSource } from "../../types";

export const useInititative = (
  combat: InvestigatorCombat | undefined,
  id: string,
) => {
  assertGame(game);
  const combatantStash = useRefStash(combat?.combatants.get(id));

  const onConfigureCombatant = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (combatantStash.current === undefined) return;
      const rect = event.currentTarget.getBoundingClientRect();
      new CombatantConfig(combatantStash.current, {
        top: Math.min(rect.top, window.innerHeight - 350),
        left: window.innerWidth - 720,
        width: 400,
      }).render(true);
    },
    [combatantStash],
  );

  const onClearInitiative = useCallback(() => {
    combatantStash.current?.update({ initiative: null });
  }, [combatantStash]);

  const onDoInitiative = useCallback(() => {
    combatantStash.current?.doGumshoeInitiative();
  }, [combatantStash]);

  const onRemoveCombatant = useCallback(() => {
    combatantStash.current?.delete();
  }, [combatantStash]);

  const localize = game.i18n.localize.bind(game.i18n);

  const onTakeTurn = useCallback(() => {
    const combatant = combatantStash.current;
    const actor = combatant?.actor;
    if (actor && combat && combatant && combatant.passingTurnsRemaining > 0 && combat.activeTurnPassingCombatant !== combatant.data._id) {
      assertActiveCharacterDataSource(actor?.data);
      combat.activeTurnPassingCombatant = combatant.data._id;
      combatant.passingTurnsRemaining -= 1;
    }
  }, [combat, combatantStash]);

  return {
    onDoInitiative,
    onConfigureCombatant,
    onClearInitiative,
    onRemoveCombatant,
    onTakeTurn,
    localize,
  };
};
