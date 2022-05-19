/** @jsx jsx */
import { cx } from "@emotion/css";
import { jsx } from "@emotion/react";
import React, { Fragment, PropsWithChildren, ReactNode } from "react";
import { assertGame } from "../../functions";
import { InvestigatorCombat } from "../../module/InvestigatorCombat";
import { InvestigatorTurn } from "./getTurns";
import { useCombatant } from "./useCombatant";

interface CombatantRowProps {
  turn: InvestigatorTurn;
  combat: StoredDocument<InvestigatorCombat> | undefined;
}

export const CombatantRow: React.FC<PropsWithChildren<CombatantRowProps>> = ({
  turn,
  combat,
  children,
}: PropsWithChildren<CombatantRowProps>) => {
  assertGame(game);
  const {
    onToggleDefeatedStatus,
    onToggleHidden,
    onCombatantHoverIn,
    onCombatantHoverOut,
    localize,
  } = useCombatant(combat, turn.id);

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
                onClick={onToggleHidden}
              >
                <i className="fas fa-eye-slash"></i>
              </a>
              <a
                className={cx({
                  "combatant-control": true,
                  active: turn.defeated,
                })}
                title={localize("COMBAT.ToggleDead")}
                onClick={onToggleDefeatedStatus}
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
          <span className="resource">{turn.resource}</span>
        </div>
      )}

      {children}
    </li>
  );
};
