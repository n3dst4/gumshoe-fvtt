/** @jsx jsx */
import { cx } from "@emotion/css";
import { jsx } from "@emotion/react";
import React, { Fragment, ReactNode } from "react";
import {
  FaEdit,
  FaEllipsisH,
  FaEraser,
  FaRecycle,
  FaTrash,
} from "react-icons/fa";
import { assertGame } from "../../functions";
import { InvestigatorCombat } from "../../module/InvestigatorCombat";
import { Dropdown } from "../inputs/Dropdown";
import { Menu, MenuItem } from "../inputs/Menu";
import { InvestigatorTurn } from "./getTurns";
import { useCombatant } from "./useCombatant";

interface StandardCombatantRowProps {
  turn: InvestigatorTurn;
  combat: StoredDocument<InvestigatorCombat> | undefined;
}

export const StandardCombatantRow: React.FC<StandardCombatantRowProps> = ({
  turn,
  combat,
}: StandardCombatantRowProps) => {
  assertGame(game);
  const {
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

      <div
        className="token-initiative"
        css={{
          flex: 0,
        }}
      >
        {turn.hasRolled
          ? (
            <span className="initiative">{turn.initiative}</span>
            )
          : (
            <a
              className="combatant-control"
              css={{
                display: "block",
                // width: "40px",
                height: "var(--sidebar-item-height)",
                fontSize: "calc(var(--sidebar-item-height) - 20px)",
                margin: "0 0.5em",
              }}
              title={localize("COMBAT.InitiativeRoll")}
              onClick={onDoInitiative}
            >
              <i className="fas fa-dice-d6" />
            </a>
            )
        }
      </div>

      {game.user?.isGM && (
        <Dropdown
          showArrow={false}
          label={<FaEllipsisH />}
          css={{
            flex: 0,
          }}
        >
          {
            <Menu>
              <MenuItem icon={<FaEdit />} onClick={onConfigureCombatant}>
                {localize("COMBAT.CombatantUpdate")}
              </MenuItem>
              <MenuItem icon={<FaEraser />} onClick={onClearInitiative}>
                {localize("COMBAT.CombatantClear")}
              </MenuItem>
              <MenuItem icon={<FaRecycle />} onClick={onRefreshInitiative}>
                {localize("investigator.RefreshInitiative")}
              </MenuItem>
              <MenuItem icon={<FaTrash />} onClick={onRemoveCombatant}>
                {localize("COMBAT.CombatantRemove")}
              </MenuItem>
            </Menu>
          }
        </Dropdown>
      )}
    </li>
  );
};
