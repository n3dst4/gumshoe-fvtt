/** @jsx jsx */
import { cx } from "@emotion/css";
import { jsx } from "@emotion/react";
import { ConfiguredObjectClassForName } from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";
import React, { Fragment, useCallback, MouseEvent, useRef, ReactNode } from "react";
import { assertGame } from "../../functions";
import { useRefStash } from "../../hooks/useRefStash";
import { InvestigatorCombat } from "../../module/InvestigatorCombat";

interface CombatantDisplayProps {
  turn: CombatTracker.Turn;
  combat: StoredDocument<InvestigatorCombat> | undefined;
}

export const CombatantDisplay: React.FC<
  CombatantDisplayProps
> = ({
  turn,
  combat,
}: CombatantDisplayProps) => {
  assertGame(game);
  const combatRef = useRefStash(combat);

  const hoveredToken = useRef<ConfiguredObjectClassForName<"Token"> | null>(
    null,
  );

  const onToggleDefeatedStatus = useCallback(async (combatant: Combatant) => {
    const isDefeated = !combatant.isDefeated;
    await combatant.update({ defeated: isDefeated });
    const token = combatant.token;
    if (!token) return;
    // Push the defeated status to the token
    const status = CONFIG.statusEffects.find(
      (e) => e.id === CONFIG.Combat.defeatedStatusId,
    );
    if (!status && !token.object) return;
    const effect =
      token.actor && status ? status : CONFIG.controlIcons.defeated;
    if (token.object) {
      // @ts-expect-error not sure if fvtt-types is wrong or what
      await token.object.toggleEffect(effect, {
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
  }, []);

  const onCombatantControl = useCallback(
    async (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const btn = event.currentTarget;
      const li = btn.closest(".combatant");
      const combat = combatRef.current;
      // @ts-expect-error wtf
      const combatantId = li?.dataset.combatantId;
      const combatant = combat?.combatants.get(combatantId);

      // Switch control action
      // @ts-expect-error wtf
      switch (btn?.dataset.control) {
        // Toggle combatant visibility
        case "toggleHidden":
          return combatant?.update({ hidden: !combatant?.hidden });

        // Toggle combatant defeated flag
        case "toggleDefeated":
          if (combatant) {
            return onToggleDefeatedStatus(combatant);
          }
          break;
        // Roll combatant initiative
        case "rollInitiative":
          return combat?.rollInitiative([combatant?.id ?? ""]);
      }
    },
    [onToggleDefeatedStatus, combatRef],
  );

  const onCombatantHoverIn = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.preventDefault();
      if (!canvas?.ready) return;
      const li = event.currentTarget;
      const combatant = combatRef.current?.combatants.get(
        li.dataset.combatantId ?? "",
      );
      const token = combatant?.token?.object;
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
    [combatRef],
  );

  const onCombatantHoverOut = useCallback((event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (hoveredToken.current) {
      // @ts-expect-error privacy means nothing
      hoveredToken.current?._onHoverOut(event);
    }
    hoveredToken.current = null;
  }, []);

  const localize = game.i18n.localize.bind(game.i18n);

  return (
    <li
      className={`combatant actor directory-item flexrow ${turn.css}`}
      data-combatant-id={turn.id}
      onMouseEnter={onCombatantHoverIn}
      onMouseLeave={onCombatantHoverOut}
    >
      <img
        className="token-image"
        // the foundry original does some crazy stuff with
        // IntersectionObserver to load images on demand
        src={turn.img}
        title={turn.name}
      />
      <div className="token-name flexcol">
        <h4>{turn.name}</h4>
        <div className="combatant-controls flexrow">
          {game.user?.isGM && (
            <Fragment>
              <a
                className={cx({
                  "combatant-control": true,
                  active: turn.hidden,
                })}
                title={localize("COMBAT.ToggleVis")}
                data-control="toggleHidden"
                onClick={onCombatantControl}
              >
                <i className="fas fa-eye-slash"></i>
              </a>
              <a
                className={cx({
                  "combatant-control": true,
                  active: turn.defeated,
                })}
                title={localize("COMBAT.ToggleDead")}
                data-control="toggleDefeated"
                onClick={onCombatantControl}
              >
                <i className="fas fa-skull"></i>
              </a>
            </Fragment>
          )}
          <div className="token-effects">
            {Array.from(turn.effects).map<ReactNode>((effect, i) => (
              <img key={i} className="token-effect" src={effect} />
            ))}
          </div>
        </div>
      </div>

      {turn.hasResource && (
        <div className="token-resource">
          {/* @ts-expect-error resource not ressource */}
          <span className="resource">{turn.resource}</span>
        </div>
      )}

      <div className="token-initiative">
        {turn.hasRolled
          ? (
          <span className="initiative">{turn.initiative}</span>
            )
          : (
          <a
            className="combatant-control"
            css={{
              display: "block",
              width: "40px",
              height: "var(--sidebar-item-height)",
              fontSize: "calc(var(--sidebar-item-height) - 20px)",
              margin: "0 0.5em",
            }}
            title={localize("COMBAT.InitiativeRoll")}
            data-control="rollInitiative"
            onClick={onCombatantControl}
          >
            <i className="fas fa-dice-d6" />
          </a>
            )}
      </div>
    </li>
  );
};
