/** @jsx jsx */
import { cx } from "@emotion/css";
import { jsx } from "@emotion/react";
import { ConfiguredObjectClassForName } from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";
import React, { Fragment, useCallback, MouseEvent, useRef, ReactNode } from "react";
import { FaEdit, FaEraser, FaRecycle, FaTrash } from "react-icons/fa";
import { assertGame } from "../../functions";
import { useRefStash } from "../../hooks/useRefStash";
import { InvestigatorCombat } from "../../module/InvestigatorCombat";
import { Dropdown } from "../inputs/Dropdown";
import { Menu, MenuItem } from "../inputs/Menu";

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

  const onConfigureCombatant = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const combatant = combatRef.current?.combatants.get(
        turn.id,
      );
      if (!combatant) return;
      const rect = event.currentTarget.getBoundingClientRect();
      new CombatantConfig(combatant, {
        top: Math.min(rect.top, window.innerHeight - 350),
        left: window.innerWidth - 720,
        width: 400,
      }).render(true);
    },
    [combatRef, turn.id],
  );

  const onClearInitiative = useCallback(() => {
    const combatant = combatRef.current?.combatants.get(turn.id);
    combatant?.update({ initiative: null });
  }, [combatRef, turn.id]);

  const onRefreshInitiative = useCallback(() => {
    const combatant = combatRef.current?.combatants.get(turn.id);
    combatant?.doGumshoeInitiative();
  }, [combatRef, turn.id]);

  const onRemoveCombatant = useCallback(() => {
    const combatant = combatRef.current?.combatants.get(turn.id);
    combatant?.delete();
  }, [combatRef, turn.id]);

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
            data-control="rollInitiative"
            onClick={onCombatantControl}
          >
            <i className="fas fa-dice-d6" />
          </a>
            )}
      </div>

      <Dropdown
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

      {/* <a
        css={{
          display: "block",
          // width: "40px",
          flex: 0,
          // height: "var(--sidebar-item-height)",
          // fontSize: "calc(var(--sidebar-item-height) - 20px)",
          // margin: "0 0.5em",
        }}
        title={localize("COMBAT.InitiativeRoll")}
        data-control="rollInitiative"
        onClick={onCombatantControl}
      >
        <i className="fas fa-caret-square-down" />
      </a> */}
    </li>
  );
};
