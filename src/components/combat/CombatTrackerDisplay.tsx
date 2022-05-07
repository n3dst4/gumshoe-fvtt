/** @jsx jsx */
import { cx } from "@emotion/css";
import { jsx } from "@emotion/react";
import { ConfiguredObjectClassForName } from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";
import React, { Fragment, MouseEvent, ReactNode, useCallback, useEffect, useRef } from "react";
import { assertGame, assertNotNull } from "../../functions";
import { useRefStash } from "../../hooks/useRefStash";
import { InvestigatorCombatTrackerBase } from "../../module/InvestigatorCombatTracker";
import { getTurns } from "./getTurns";

const log = console.log.bind(console, "[CombatTrackerDisplay] ");

interface CombatTrackerProps {
  app: InvestigatorCombatTrackerBase;
}

export const CombatTrackerDisplay: React.FC<CombatTrackerProps> = ({
  app,
}: CombatTrackerProps) => {
  assertGame(game);
  const user = game.user;
  assertNotNull(user);

  // STATE & DERIVED DATA

  const combat = game.combats?.active;
  const combatId = combat?.data._id;

  const combatRef = useRefStash(combat);
  const combatCount = game.combats?.combats.length ?? 0;

  const combatIndex = combatId ? game.combats?.combats.findIndex((c) => c.data._id === combatId) : undefined;
  const previousId = (combatIndex !== undefined && combatIndex > 0)
    ? game.combats?.combats[combatIndex - 1].data._id
    : null;
  const nextId = (combatIndex !== undefined && combatIndex < (combatCount - 1))
    ? game.combats?.combats[combatIndex + 1].data._id
    : null;

  const linked = combat?.data.scene !== null;
  const turns = combat ? getTurns(combat) : [];
  const hasCombat = !!combat;

  const scopeLabel = game.i18n.localize(`COMBAT.${linked ? "Linked" : "Unlinked"}`);

  const hoveredToken = useRef<ConfiguredObjectClassForName<"Token"> | null>(null);

  // CALLBACKS

  const _onCombatCreate = useCallback(async (event: MouseEvent) => {
    assertGame(game);
    event.preventDefault();
    const scene = game.scenes?.current;
    const cls = getDocumentClass("Combat");
    const combat = await cls.create({ scene: scene?.id });
    await combat?.activate({ render: false });
  }, []);

  const showConfig = useCallback((ev: MouseEvent) => {
    ev.preventDefault();
    // @ts-expect-error CombatTrackerConfig is fine with no args
    new CombatTrackerConfig().render(true);
  }, []);

  const _onCombatCycle = useCallback(async (event) => {
    assertGame(game);
    event.preventDefault();
    const btn = event.currentTarget;
    const combat = game.combats?.get(btn.dataset.combatId);
    if (!combat) return;
    await combat.activate({ render: false });
  }, []);

  const _onCombatControl = useCallback(async (event: MouseEvent) => {
    event.preventDefault();
    const combat = combatRef.current;
    const ctrl = event.currentTarget;
    if (ctrl.getAttribute("disabled")) return;
    // @ts-expect-error wtf
    else ctrl.setAttribute("disabled", true);
    // @ts-expect-error this is waaay too funky
    const fn = combat?.[ctrl.dataset.control ?? ""];
    if (fn) await fn.bind(combat)();
    ctrl.removeAttribute("disabled");
  }, [combatRef]);

  const _onToggleDefeatedStatus = useCallback(async (combatant: Combatant) => {
    const isDefeated = !combatant.isDefeated;
    await combatant.update({ defeated: isDefeated });
    const token = combatant.token;
    if (!token) return;
    // Push the defeated status to the token
    const status = CONFIG.statusEffects.find(e => e.id === CONFIG.Combat.defeatedStatusId);
    if (!status && !token.object) return;
    const effect = token.actor && status ? status : CONFIG.controlIcons.defeated;
    // @ts-expect-error not sure if fvtt-types is wrong or what
    if (token.object) await token.object.toggleEffect(effect, { overlay: true, active: isDefeated });
    // @ts-expect-error not sure if fvtt-types is wrong or what
    else await token.toggleActiveEffect(effect, { overlay: true, active: isDefeated });
  }, []);

  const _onCombatantControl = useCallback(async (event: MouseEvent) => {
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
          return _onToggleDefeatedStatus(combatant);
        }
        break;
      // Roll combatant initiative
      case "rollInitiative":
        return combat?.rollInitiative([combatant?.id ?? ""]);
    }
  }, [_onToggleDefeatedStatus, combatRef]);

  const _onCombatantHoverIn = useCallback((event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (!canvas?.ready) return;
    const li = event.currentTarget;
    const combatant = combatRef.current?.combatants.get(li.dataset.combatantId ?? "");
    const token = combatant?.token?.object;
    // @ts-expect-error isVisible is legit?
    if (token?.isVisible) {
      // @ts-expect-error privacy means nothing
      if (!token._controlled) {
        // @ts-expect-error privacy means nothing
        token._onHoverIn(event);
      }
      hoveredToken.current = token as unknown as ConfiguredObjectClassForName<"Token">;
    }
  }, [combatRef]);

  const _onCombatantHoverOut = useCallback((event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (hoveredToken.current) {
      // @ts-expect-error privacy means nothing
      hoveredToken.current?._onHoverOut(event);
    }
    hoveredToken.current = null;
  }, []);

  const _onConfigureCombatant = useCallback((li: JQuery<HTMLLIElement>) => {
    const combatant = combatRef.current?.combatants.get(li.data("combatant-id"));
    if (!combatant) return;
    new CombatantConfig(combatant, {
      top: Math.min(li[0].offsetTop, window.innerHeight - 350),
      left: window.innerWidth - 720,
      width: 400,
    }).render(true);
  }, [combatRef]);

  const appRef = useRefStash(app);

  useEffect(() => {
    assertGame(game);
    if (!game.user?.isGM) {
      return;
    }
    const menuOptions = [
      {
        name: "COMBAT.CombatantUpdate",
        icon: '<i class="fas fa-edit"></i>',
        callback: _onConfigureCombatant,
      },
      {
        name: "COMBAT.CombatantClear",
        icon: '<i class="fas fa-undo"></i>',
        condition: (li: JQuery<HTMLLIElement>) => {
          const combatant = combatRef.current?.combatants.get(li.data("combatant-id"));
          return Number.isNumeric(combatant?.data?.initiative);
        },
        callback: (li: JQuery<HTMLLIElement>) => {
          const combatant = combatRef.current?.combatants.get(li.data("combatant-id"));
          if (combatant) return combatant.update({ initiative: null });
        },
      },
      {
        name: "COMBAT.CombatantReroll",
        icon: '<i class="fas fa-dice-d20"></i>',
        callback: (li: JQuery<HTMLLIElement>) => {
          const combatant = combatRef.current?.combatants.get(li.data("combatant-id"));
          if (combatant) return combatRef.current?.rollInitiative([combatant.id ?? ""]);
        },
      },
      {
        name: "COMBAT.CombatantRemove",
        icon: '<i class="fas fa-trash"></i>',
        callback: (li: JQuery<HTMLLIElement>) => {
          const combatant = combatRef.current?.combatants.get(li.data("combatant-id"));
          if (combatant) return combatant.delete();
        },
      },
    ];
    log("Creating context menu");
    // @ts-expect-error ContextMenu.create does exist
    ContextMenu.create(
      appRef.current, appRef.current.element, ".directory-item", menuOptions,
    );
  }, [_onConfigureCombatant, appRef, combatRef]);

  const localize = game.i18n.localize.bind(game.i18n);

  if (combat === null) {
    return null;
  }

  return (
    <Fragment>
      {/* TOP ROW: + < Encounter 2/3 > X */}
      <header id="combat-round">
        {user.isGM && (
          <nav className="encounters flexrow">
            <a
              className="combat-create"
              title={localize("COMBAT.Create")}
              onClick={_onCombatCreate}
            >
              <i className="fas fa-plus"></i>
            </a>
            {combatCount > 0 && (
              <Fragment>
                <a
                  className="combat-cycle"
                  title={localize("COMBAT.EncounterPrevious")}
                  {...(previousId
                    ? { "data-combat-id": previousId }
                    : { disabled: true })}
                  onClick={_onCombatCycle}
                >
                  <i className="fas fa-caret-left"></i>
                </a>
                <h4 className="encounter">
                  {localize("COMBAT.Encounter")} {(combatIndex ?? 0) + 1} /{" "}
                  {combatCount}
                </h4>
                <a
                  className="combat-cycle"
                  title={localize("COMBAT.EncounterNext")}
                  {...(nextId
                    ? { "data-combat-id": nextId }
                    : { disabled: true })}
                    onClick={_onCombatCycle}
                >
                  <i className="fas fa-caret-right"></i>
                </a>
              </Fragment>
            )}
            <a
              className="combat-control"
              title={localize("COMBAT.Delete")}
              data-control="endCombat"
              // @ts-expect-error foundry uses non-standard "disabled"
              disabled={
                !combatCount
              }
              onClick={_onCombatControl}
            >
              <i className="fas fa-trash"></i>
            </a>
          </nav>
        )}

        {/* SECOND ROW: Roll all, roll npcs, RoUnD 4, do-over, link, cog */}
        <nav className="encounters flexrow {{#if hasCombat}}combat{{/if}}">
          {user.isGM && (
            <Fragment>
              <a
                className="combat-control"
                title={localize("COMBAT.RollAll")}
                data-control="rollAll"
                // @ts-expect-error foundry uses non-standard "disabled"
                disabled={
                  !turns
                }
                onClick={_onCombatControl}
              >
                <i className="fas fa-users"></i>
              </a>
              <a
                className="combat-control"
                title={localize("COMBAT.RollNPC")}
                data-control="rollNPC"
                // @ts-expect-error foundry uses non-standard "disabled"
                disabled={
                  !turns
                }
                onClick={_onCombatControl}
              >
                <i className="fas fa-users-cog"></i>
              </a>
            </Fragment>
          )}

          {combatCount
            ? (
            <Fragment>
              {combat?.data.round
                ? (
                <h3 className="encounter-title">
                  {localize("COMBAT.Round")} {combat.data.round}
                </h3>
                  )
                : (
                <h3 className="encounter-title">
                  {localize("COMBAT.NotStarted")}
                </h3>
                  )}
            </Fragment>
              )
            : (
            <h3 className="encounter-title">{localize("COMBAT.None")}</h3>
              )}

          {user.isGM && (
            <Fragment>
              <a
                className="combat-control"
                title={localize("COMBAT.InitiativeReset")}
                data-control="resetAll"
                // @ts-expect-error foundry uses non-standard "disabled"
                disabled={
                  !hasCombat
                }
                onClick={_onCombatControl}
              >
                <i className="fas fa-undo"></i>
              </a>
              <a
                className="combat-control"
                // ts-expect-error it's scope not scoped
                title={scopeLabel}
                data-control="toggleSceneLink"
                // @ts-expect-error foundry uses non-standard "disabled"
                disabled={
                  !hasCombat
                }
                onClick={_onCombatControl}
              >
                <i
                  className={cx({
                    fas: true,
                    "fa-link": linked,
                    "fa-unlink": !linked,
                  })}
                />
              </a>
              <a
                className="combat-settings"
                title={localize("COMBAT.Settings")}
                data-control="trackerSettings"
                onClick={showConfig}
              >
                <i className="fas fa-cog"></i>
              </a>
            </Fragment>
          )}
        </nav>
      </header>

      {/* ACTUAL COMBATANTS, or "turns" in early-medieval foundry-speak */}
      <ol
        id="combat-tracker"
        className="directory-list"
      >
        {turns.map<ReactNode>((turn, i) => (
          <li
            key={i}
            className={`combatant actor directory-item flexrow ${turn.css}`}
            data-combatant-id={turn.id}
            onMouseEnter={_onCombatantHoverIn}
            onMouseLeave={_onCombatantHoverOut}
          >
            <img
              className="token-image"
              data-src={turn.img}
              title={turn.name}
            />
            <div className="token-name flexcol">
              <h4>{turn.name}</h4>
              <div className="combatant-controls flexrow">
                {user.isGM && (
                  <Fragment>
                    <a
                      className={cx({
                        "combatant-control": true,
                        active: turn.hidden,
                      })}
                      title={localize("COMBAT.ToggleVis")}
                      data-control="toggleHidden"
                      onClick={_onCombatantControl}
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
                      onClick={_onCombatantControl}
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
                  className="combatant-control roll"
                  title={localize("COMBAT.InitiativeRoll")}
                  data-control="rollInitiative"
                  onClick={_onCombatantControl}
                />
                  )}
            </div>
          </li>
        ))}
      </ol>

      {/* BOTTOM BITS: |< < End combat > >| */}
      <nav id="combat-controls" className="directory-footer flexrow">
        {hasCombat &&
          (user.isGM
            ? (
            <Fragment>
              {combat.data.round
                ? (
                <Fragment>
                  <a
                    className="combat-control"
                    title={localize("COMBAT.RoundPrev")}
                    data-control="previousRound"
                    onClick={_onCombatControl}
                  >
                    <i className="fas fa-step-backward"></i>
                  </a>
                  <a
                    className="combat-control"
                    title={localize("COMBAT.TurnPrev")}
                    data-control="previousTurn"
                    onClick={_onCombatControl}
                  >
                    <i className="fas fa-arrow-left"></i>
                  </a>
                  <a
                    className="combat-control center"
                    title={localize("COMBAT.End")}
                    data-control="endCombat"
                    onClick={_onCombatControl}
                  >
                    {localize("COMBAT.End")}
                  </a>
                  <a
                    className="combat-control"
                    title={localize("COMBAT.TurnNext")}
                    data-control="nextTurn"
                    onClick={_onCombatControl}
                  >
                    <i className="fas fa-arrow-right"></i>
                  </a>
                  <a
                    className="combat-control"
                    title={localize("COMBAT.RoundNext")}
                    data-control="nextRound"
                    onClick={_onCombatControl}
                  >
                    <i className="fas fa-step-forward"></i>
                  </a>
                </Fragment>
                  )
                : (
                <a
                  className="combat-control center"
                  title={localize("COMBAT.Begin")}
                  data-control="startCombat"
                  onClick={_onCombatControl}
                >
                  {localize("COMBAT.Begin")}
                </a>
                  )}
            </Fragment>
              )
            : (
                game.user && combat.combatant?.players?.includes(game.user) && (
              <Fragment>
                <a
                  className="combat-control"
                  title={localize("COMBAT.TurnPrev")}
                  data-control="previousTurn"
                  onClick={_onCombatControl}
                >
                  <i className="fas fa-arrow-left"></i>
                </a>
                <a
                  className="combat-control center"
                  title={localize("COMBAT.TurnEnd")}
                  data-control="nextTurn"
                  onClick={_onCombatControl}
                >
                  {localize("COMBAT.TurnEnd")}
                </a>
                <a
                  className="combat-control"
                  title={localize("COMBAT.TurnNext")}
                  data-control="nextTurn"
                  onClick={_onCombatControl}
                >
                  <i className="fas fa-arrow-right"></i>
                </a>
              </Fragment>
                )
              ))}
      </nav>
    </Fragment>
  );
};
