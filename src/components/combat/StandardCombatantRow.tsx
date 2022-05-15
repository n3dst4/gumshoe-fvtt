/** @jsx jsx */
import { cx } from "@emotion/css";
import { jsx } from "@emotion/react";
import { ConfiguredObjectClassForName } from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";
import React, { Fragment, useCallback, MouseEvent, useRef, ReactNode } from "react";
import { FaEdit, FaEllipsisH, FaEraser, FaRecycle, FaTrash } from "react-icons/fa";
import { assertGame } from "../../functions";
import { useRefStash } from "../../hooks/useRefStash";
import { InvestigatorCombat } from "../../module/InvestigatorCombat";
import { Dropdown } from "../inputs/Dropdown";
import { Menu, MenuItem } from "../inputs/Menu";
import { InvestigatorTurn } from "./getTurns";

interface StandardCombatantRowProps {
  turn: InvestigatorTurn;
  combat: StoredDocument<InvestigatorCombat> | undefined;
}

export const StandardCombatantRow: React.FC<
  StandardCombatantRowProps
> = ({
  turn,
  combat,
}: StandardCombatantRowProps) => {
  assertGame(game);
  const combatantStash = useRefStash(combat?.combatants.get(turn.id));

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
    return combatantStash.current?.update({ hidden: !combatantStash.current?.hidden });
  };

  const onDoInitiative = () => {
    combatantStash.current?.doGumshoeInitiative();
  };

  const onCombatantHoverIn = useCallback(
    (event: MouseEvent<HTMLElement>) => {
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

  const onCombatantHoverOut = useCallback((event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (hoveredToken.current) {
      // @ts-expect-error privacy means nothing
      hoveredToken.current?._onHoverOut(event);
    }
    hoveredToken.current = null;
  }, []);

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
            )}
      </div>

      {(game.user?.isGM) &&
        <Dropdown
          showArrow={false}
          label={<FaEllipsisH />}
          css={{
            flex: 0,
          }}
        >
          {
            <Menu>
              <MenuItem
                icon={<FaEdit/>}
                onClick={onConfigureCombatant}
              >
                {localize("COMBAT.CombatantUpdate")}
              </MenuItem>
              <MenuItem
                icon={<FaEraser/>}
                onClick={onClearInitiative}
              >
                {localize("COMBAT.CombatantClear")}
              </MenuItem>
              <MenuItem
                icon={<FaRecycle/>}
                onClick={onRefreshInitiative}
              >
                {localize("investigator.RefreshInitiative")}
              </MenuItem>
              <MenuItem
                icon={<FaTrash/>}
                onClick={onRemoveCombatant}
              >
                {localize("COMBAT.CombatantRemove")}
              </MenuItem>
            </Menu>
          }
        </Dropdown>
      }
    </li>
  );
};
