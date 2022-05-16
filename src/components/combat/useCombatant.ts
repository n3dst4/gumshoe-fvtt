import { ConfiguredObjectClassForName } from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";
import { useCallback, useRef } from "react";
import { assertGame } from "../../functions";
import { useRefStash } from "../../hooks/useRefStash";
import { InvestigatorCombat } from "../../module/InvestigatorCombat";

export const useCombatant = (
  combat: InvestigatorCombat | undefined,
  id: string,
) => {
  assertGame(game);
  const combatantStash = useRefStash(combat?.combatants.get(id));

  const hoveredToken = useRef<ConfiguredObjectClassForName<"Token"> | null>(
    null,
  );

  const onToggleDefeatedStatus = useCallback(async () => {
    if (combatantStash.current === undefined) return;
    const isDefeated = !combatantStash.current.isDefeated;
    await combatantStash.current.update({ defeated: isDefeated });
    const token = combatantStash.current.token;
    if (!token) return;
    // Push the defeated status to the token
    const status = CONFIG.statusEffects.find(
      (e) => e.id === CONFIG.Combat.defeatedStatusId,
    );
    if (!status && !token.object) return;
    const effect =
      token.actor && status ? status : CONFIG.controlIcons.defeated;
    if (token.object) {
      await (token.object as Token).toggleEffect(effect, {
        overlay: true,
        active: isDefeated,
      });
    } else {
      // @ts-expect-error not sure if fvtt-types is wrong or what
      await token.toggleActiveEffect(effect, {
        overlay: true,
        active: isDefeated,
      });
    }
  }, [combatantStash]);

  const onToggleHidden = () => {
    return combatantStash.current?.update({
      hidden: !combatantStash.current?.hidden,
    });
  };

  const onDoInitiative = () => {
    combatantStash.current?.doGumshoeInitiative();
  };

  const onCombatantHoverIn = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      if (!canvas?.ready) return;
      const token = combatantStash.current?.token?.object;
      // @ts-expect-error isVisible is legit?
      if (token?.isVisible) {
        // @ts-expect-error privacy means nothing
        if (!token._controlled) {
          // @ts-expect-error privacy means nothing
          token._onHoverIn(event);
        }
        hoveredToken.current =
          token as unknown as ConfiguredObjectClassForName<"Token">;
      }
    },
    [combatantStash],
  );

  const onCombatantHoverOut = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      if (hoveredToken.current) {
        // @ts-expect-error privacy means nothing
        hoveredToken.current?._onHoverOut(event);
      }
      hoveredToken.current = null;
    },
    [],
  );

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

  const onRefreshInitiative = useCallback(() => {
    combatantStash.current?.doGumshoeInitiative();
  }, [combatantStash]);

  const onRemoveCombatant = useCallback(() => {
    combatantStash.current?.delete();
  }, [combatantStash]);

  const localize = game.i18n.localize.bind(game.i18n);

  return {
    onToggleDefeatedStatus,
    onToggleHidden,
    onDoInitiative,
    onCombatantHoverIn,
    onCombatantHoverOut,
    onConfigureCombatant,
    onClearInitiative,
    onRefreshInitiative,
    onRemoveCombatant,
    localize,
  };
};
