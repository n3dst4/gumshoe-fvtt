/** @jsx jsx */
import { cx } from "@emotion/css";
import { jsx } from "@emotion/react";
import React, {
  Fragment,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { assertGame, assertNotNull } from "../../functions";
import { useRefStash } from "../../hooks/useRefStash";
import { CombatantDisplay } from "./CombatantDisplay";
import { getTurns } from "./getTurns";

interface CombatTrackerDisplayInvestigatorProps {
  app: Application;
}

/**
 * React component for standard Investigator combat tracker.
 */
export const CombatTrackerDisplayInvestigator: React.FC<CombatTrackerDisplayInvestigatorProps> = ({
  app,
}: CombatTrackerDisplayInvestigatorProps) => {
  assertGame(game);
  assertNotNull(game.user);

  // STATE & DERIVED DATA

  const combat = game.combats?.active;
  const combatId = combat?.data._id;

  const combatRef = useRefStash(combat);
  const combatCount = game.combats?.combats.length ?? 0;

  const combatIndex = combatId
    ? game.combats?.combats.findIndex((c) => c.data._id === combatId)
    : undefined;
  const previousId =
    combatIndex !== undefined && combatIndex > 0
      ? game.combats?.combats[combatIndex - 1].data._id
      : null;
  const nextId =
    combatIndex !== undefined && combatIndex < combatCount - 1
      ? game.combats?.combats[combatIndex + 1].data._id
      : null;

  const linked = combat?.data.scene !== null;
  const turns = combat ? getTurns(combat) : [];
  const hasCombat = !!combat;

  const scopeLabel = game.i18n.localize(
    `COMBAT.${linked ? "Linked" : "Unlinked"}`,
  );

  // CALLBACKS

  const onCombatCreate = useCallback(async (event: MouseEvent) => {
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

  const onCombatCycle = useCallback(async (event) => {
    assertGame(game);
    event.preventDefault();
    const btn = event.currentTarget;
    const combat = game.combats?.get(btn.dataset.combatId);
    if (!combat) return;
    await combat.activate({ render: false });
  }, []);

  const onDeleteCombat = useCallback(
    async (event: MouseEvent) => {
      event.preventDefault();
      combatRef.current?.delete();
    },
    [combatRef],
  );

  const onToggleSceneLink = useCallback(
    async (event: MouseEvent) => {
      event.preventDefault();
      combatRef.current?.toggleSceneLink();
    },
    [combatRef],
  );

  const onPreviousRound = useCallback((event: MouseEvent) => {
    event.preventDefault();
    combatRef.current?.previousRound();
  }, [combatRef]);

  const onPreviousTurn = useCallback((event: MouseEvent) => {
    event.preventDefault();
    combatRef.current?.previousTurn();
  }, [combatRef]);

  const onEndCombat = useCallback((event: MouseEvent) => {
    event.preventDefault();
    combatRef.current?.endCombat();
  }, [combatRef]);

  const onNextTurn = useCallback((event: MouseEvent) => {
    event.preventDefault();
    combatRef.current?.nextTurn();
  }, [combatRef]);

  const onNextRound = useCallback((event: MouseEvent) => {
    event.preventDefault();
    combatRef.current?.nextRound();
  }, [combatRef]);

  const onStartCombat = useCallback((event: MouseEvent) => {
    event.preventDefault();
    combatRef.current?.startCombat();
  }, [combatRef]);

  const onConfigureCombatant = useCallback(
    (li: JQuery<HTMLLIElement>) => {
      const combatant = combatRef.current?.combatants.get(
        li.data("combatant-id"),
      );
      if (!combatant) return;
      new CombatantConfig(combatant, {
        top: Math.min(li[0].offsetTop, window.innerHeight - 350),
        left: window.innerWidth - 720,
        width: 400,
      }).render(true);
    },
    [combatRef],
  );

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
        callback: onConfigureCombatant,
      },
      {
        name: "COMBAT.CombatantClear",
        icon: '<i class="fas fa-eraser"></i>',
        condition: (li: JQuery<HTMLLIElement>) => {
          const combatant = combatRef.current?.combatants.get(
            li.data("combatant-id"),
          );
          return Number.isNumeric(combatant?.data?.initiative);
        },
        callback: (li: JQuery<HTMLLIElement>) => {
          const combatant = combatRef.current?.combatants.get(
            li.data("combatant-id"),
          );
          if (combatant) return combatant.update({ initiative: null });
        },
      },
      {
        name: "INVESTIGATOR.RefreshInitiative",
        icon: '<i class="fas fa-recycle"></i>',
        callback: (li: JQuery<HTMLLIElement>) => {
          const combatant = combatRef.current?.combatants.get(
            li.data("combatant-id"),
          );
          if (combatant) return combatant.doGumshoeInitiative();
        },
      },
      {
        name: "COMBAT.CombatantRemove",
        icon: '<i class="fas fa-trash"></i>',
        callback: (li: JQuery<HTMLLIElement>) => {
          const combatant = combatRef.current?.combatants.get(
            li.data("combatant-id"),
          );
          if (combatant) return combatant.delete();
        },
      },
    ];
    // @ts-expect-error ContextMenu.create does exist
    ContextMenu.create(
      appRef.current,
      appRef.current.element,
      ".directory-item",
      menuOptions,
    );
  }, [onConfigureCombatant, appRef, combatRef]);

  const localize = game.i18n.localize.bind(game.i18n);

  if (combat === null) {
    return null;
  }

  return (
    <Fragment>
      {/* TOP ROW: + < Encounter 2/3 > X */}
      <header id="combat-round">
        {game.user.isGM && (
          <nav className="encounters flexrow">
            <a
              className="combat-create"
              title={localize("COMBAT.Create")}
              onClick={onCombatCreate}
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
                  onClick={onCombatCycle}
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
                    onClick={onCombatCycle}
                    >
                  <i className="fas fa-caret-right"></i>
                </a>
              </Fragment>
            )}
            {
              combatCount > 0 &&
              <a
                className="combat-control"
                title={localize("COMBAT.Delete")}
                onClick={onDeleteCombat}
              >
                <i className="fas fa-trash"></i>
              </a>
            }
          </nav>
        )}

        {/* SECOND ROW: RoUnD 4, link, cog */}
        <nav className="encounters flexrow {{#if hasCombat}}combat{{/if}}">
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

          {game.user.isGM && (
            <Fragment>
              {hasCombat &&
                <a
                  className="combat-control"
                  title={scopeLabel}
                  onClick={onToggleSceneLink}
                >
                  <i
                    className={cx({
                      fas: true,
                      "fa-link": linked,
                      "fa-unlink": !linked,
                    })}
                  />
                </a>
              }
              <a
                className="combat-settings"
                title={localize("COMBAT.Settings")}
                // data-control="trackerSettings"
                onClick={showConfig}
              >
                <i className="fas fa-cog"></i>
              </a>
            </Fragment>
          )}
        </nav>
      </header>

      {/* ACTUAL COMBATANTS, or "turns" in early-medieval foundry-speak */}
      <ol id="combat-tracker" className="directory-list">
        {turns.map<ReactNode>((turn, i) => (
          <CombatantDisplay key={i} turn={turn} combat={combat} />
        ))}
      </ol>

      {/* BOTTOM BITS: |< < End combat > >| */}
      <nav id="combat-controls" className="directory-footer flexrow">
        {hasCombat &&
          (game.user.isGM
            ? (
            <Fragment>
              {combat.data.round
                ? (
                <Fragment>
                  <a
                    className="combat-control"
                    title={localize("COMBAT.RoundPrev")}
                    onClick={onPreviousRound}
                  >
                    <i className="fas fa-step-backward"></i>
                  </a>
                  <a
                    className="combat-control"
                    title={localize("COMBAT.TurnPrev")}
                    onClick={onPreviousTurn}
                  >
                    <i className="fas fa-arrow-left"></i>
                  </a>
                  <a
                    className="combat-control center"
                    title={localize("COMBAT.End")}
                    onClick={onEndCombat}
                  >
                    {localize("COMBAT.End")}
                  </a>
                  <a
                    className="combat-control"
                    title={localize("COMBAT.TurnNext")}
                    onClick={onNextTurn}
                  >
                    <i className="fas fa-arrow-right"></i>
                  </a>
                  <a
                    className="combat-control"
                    title={localize("COMBAT.RoundNext")}
                    onClick={onNextRound}
                  >
                    <i className="fas fa-step-forward"></i>
                  </a>
                </Fragment>
                  )
                : (
                <a
                  className="combat-control center"
                  title={localize("COMBAT.Begin")}
                  onClick={onStartCombat}
                >
                  {localize("COMBAT.Begin")}
                </a>
                  )}
            </Fragment>
              )
            : (
                game.user &&
            combat.combatant?.players?.includes(game.user) && (
              <Fragment>
                <a
                  className="combat-control"
                  title={localize("COMBAT.TurnPrev")}
                  onClick={onPreviousTurn}
                >
                  <i className="fas fa-arrow-left"></i>
                </a>
                <a
                  className="combat-control center"
                  title={localize("COMBAT.TurnEnd")}
                  onClick={onNextTurn}
                >
                  {localize("COMBAT.TurnEnd")}
                </a>
                <a
                  className="combat-control"
                  title={localize("COMBAT.TurnNext")}
                  onClick={onNextTurn}
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
