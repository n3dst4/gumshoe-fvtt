import { useCallback } from "react";
import { assertGame, broadcastHook, systemLogger } from "../../functions";
import { useRefStash } from "../../hooks/useRefStash";
import { InvestigatorCombat } from "../../module/InvestigatorCombat";
import * as constants from "../../constants";

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
    assertGame(game);
    systemLogger.log("turnPassingHandler - calling hook");
    const payload = {
      combatantId: combatantStash.current?.id,
    };
    broadcastHook(constants.requestTurnPass, payload);
  }, [combatantStash]);

  const onJumpIn = useCallback(() => {
    const payload = {
      combatantId: combatantStash.current?.id,
    };
    broadcastHook(constants.jumpInInitiative, payload);
  }, [combatantStash]);

  const onDropToLast = useCallback(() => {
    const payload = {
      combatantId: combatantStash.current?.id,
    };
    broadcastHook(constants.dropToLastInitiative, payload);
  }, [combatantStash]);

  const onAddTurn = useCallback(() => {
    combatantStash.current?.addPassingTurn();
  }, [combatantStash]);

  const onRemoveTurn = useCallback(() => {
    combatantStash.current?.removePassingTurn();
  }, [combatantStash]);

  const openSheet = useCallback(() => {
    combatantStash.current?.token?.actor?.sheet?.render(true);
  }, [combatantStash]);

  return {
    onDoInitiative,
    onConfigureCombatant,
    onClearInitiative,
    onRemoveCombatant,
    onTakeTurn,
    localize,
    onAddTurn,
    onRemoveTurn,
    openSheet,
    onJumpIn,
    onDropToLast,
  };
};
