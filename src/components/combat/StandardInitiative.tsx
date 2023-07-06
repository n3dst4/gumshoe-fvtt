import React, { Fragment } from "react";
import {
  FaEdit,
  FaEllipsisH,
  FaEraser,
  FaRecycle,
  FaTrash,
  FaAngleDoubleUp,
  FaAngleDoubleDown,
} from "react-icons/fa";
import { HiDocumentText } from "react-icons/hi";
import { assertGame } from "../../functions";
import { InvestigatorCombat } from "../../module/InvestigatorCombat";
import { Dropdown } from "../inputs/Dropdown";
import { Menu, MenuItem } from "../inputs/Menu";
import { Translate } from "../Translate";
import { InvestigatorTurn } from "./getTurns";
import { useInititative } from "./useInititative";

interface StandardInitiativeProps {
  turn: InvestigatorTurn;
  combat: InvestigatorCombat;
}

export const StandardInitiative: React.FC<StandardInitiativeProps> = ({
  turn,
  combat,
}: StandardInitiativeProps) => {
  assertGame(game);
  const {
    onDoInitiative,
    onConfigureCombatant,
    onClearInitiative,
    onRemoveCombatant,
    localize,
    openSheet,
    onJumpIn,
    onDropToLast,
  } = useInititative(combat, turn.id);

  return (
    <Fragment>
      <div
        className="token-initiative"
        css={{
          flex: 0,
        }}
      >
        {turn.hasRolled ? (
          <span className="initiative">{turn.initiative}</span>
        ) : (
          <a
            css={{
              display: "block",
              height: "var(--sidebar-item-height)",
              fontSize: "calc(var(--sidebar-item-height) - 20px)",
              margin: "0 0.5em",
            }}
            title={localize("COMBAT.InitiativeRoll")}
            onClick={onDoInitiative}
          >
            <i className="fas fa-dice-d6" />
          </a>
        )}
      </div>

      <Dropdown
        showArrow={false}
        label={<FaEllipsisH />}
        css={{
          flex: 0,
        }}
      >
        {
          <Menu>
            {game.user?.isGM && (
              <Fragment>
                <MenuItem icon={<FaEdit />} onClick={onConfigureCombatant}>
                  {localize("COMBAT.CombatantUpdate")}
                </MenuItem>
                <MenuItem icon={<FaEraser />} onClick={onClearInitiative}>
                  {localize("COMBAT.CombatantClear")}
                </MenuItem>
                <MenuItem icon={<FaRecycle />} onClick={onDoInitiative}>
                  {localize("investigator.RefreshInitiative")}
                </MenuItem>
                <MenuItem icon={<HiDocumentText />} onClick={openSheet}>
                  {localize("investigator.OpenCharacterSheet")}
                </MenuItem>
                <MenuItem icon={<FaTrash />} onClick={onRemoveCombatant}>
                  {localize("COMBAT.CombatantRemove")}
                </MenuItem>
              </Fragment>
            )}
            <MenuItem icon={<FaAngleDoubleUp />} onClick={onJumpIn}>
              <Translate>Jump In</Translate>
            </MenuItem>
            <MenuItem icon={<FaAngleDoubleDown />} onClick={onDropToLast}>
              <Translate>Drop to last</Translate>
            </MenuItem>
          </Menu>
        }
      </Dropdown>
    </Fragment>
  );
};
