/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useEffect, useState } from "react";
import * as constants from "../../constants";
import { sortEntitiesByName } from "../../functions";
import { GumshoeActor } from "../../module/GumshoeActor";
import { getDefaultThemeName } from "../../settingsHelpers";
import { themes } from "../../theme";
import { CSSReset } from "../CSSReset";
import { ActorSheetAppContext } from "../FoundryAppContext";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { AbilityRow } from "./AbilityRow";
import { buildRowData, getSystemAbilities } from "./functions";
import { AbilityTuple, isCategoryHeader, isTypeHeader, RowData } from "./types";

type GumshoePartySheetProps = {
  party: GumshoeActor,
  foundryApplication: ActorSheet,
};

export const GumshoePartySheet: React.FC<GumshoePartySheetProps> = ({
  foundryApplication,
  party,
}) => {
  const theme = themes[getDefaultThemeName()] || themes.trailTheme;
  const [abilityTuples, setAbilityTuples] = useState<AbilityTuple[]>([]);
  const [actors, setActors] = useState<GumshoeActor[]>([]);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const actorIds = party.getActorIds();

  // effect 1: keep our "abilityTuples" in sync with system setting for
  // "newPCPacks"
  useEffect(() => {
    getSystemAbilities().then(setAbilityTuples);
    const onNewPCPacksUpdated = async (newPacks: string[]) => {
      setAbilityTuples(await getSystemAbilities());
    };
    Hooks.on(constants.newPCPacksUpdated, onNewPCPacksUpdated);
    return () => {
      Hooks.off(constants.newPCPacksUpdated, onNewPCPacksUpdated);
    };
  }, []);

  // effect 2: keep our row data in sync with abilityTuples and actors
  useEffect(() => {
    const getAbs = async () => {
      // getting actors is fast
      const actors = actorIds.map((id) => game.actors.get(id) as GumshoeActor);
      setActors(sortEntitiesByName(actors));
      const rowData = buildRowData(abilityTuples, actors);
      // setting row data is slow - presumably this includes rendering time
      setRowData(rowData);
    };
    getAbs();
  }, [abilityTuples, actorIds]);

  // callback for removing an actor
  const onClickRemoveActor = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const actorId = e.currentTarget.dataset.actorId;
    if (actorId !== undefined) {
      party.removeActorId(actorId);
    }
  }, [party]);

  return (
    <ActorSheetAppContext.Provider value={foundryApplication}>
      <CSSReset
        theme={theme}
        css={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Name field */}
        <InputGrid
          css={{
            paddingBottom: "0.5em",
          }}
        >
          <GridField label="Party Name">
            <AsyncTextInput value={party.getName()} onChange={party.setName} />
          </GridField>
        </InputGrid>

        {/* Grid */}
        <div
          css={{
            flex: 1,
            display: "grid",
            gridTemplateRows: "min-content",
            gridAutoRows: "auto",
            gridTemplateColumns: "max-content",
            gridAutoColumns: "minmax(min-content, auto)",
            overflow: "auto",
            position: "relative",
          }}
        >
          {/* Top left block */}
          <div
            css={{
              gridRow: 1,
              gridColumn: 1,
              position: "sticky",
              top: 0,
              left: 0,
              background: theme.colors.bgOpaquePrimary,
              padding: "0.5em",
              textAlign: "center",
              zIndex: 3,
            }}
          ></div>

          {/* Actor names */}
          {actors.map((actor, j) => {
            return (
              <div
                key={actor.id}
                css={{
                  gridRow: 1,
                  gridColumn: j + 2,
                  position: "sticky",
                  top: 0,
                  backgroundColor: theme.colors.bgOpaqueSecondary,
                  padding: "0.5em",
                  zIndex: 2,
                  lineHeight: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                }}
                >
                <a
                  css={{
                    webkitLineClamp: "2",
                    textAlign: "center",
                    display: "-webkit-box",
                    webkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    actor.sheet.render(true);
                  }}
                >
                  {actor.name}
                </a>
                <div>
                  <button
                    css={{
                      "&&": {
                        fontSize: "0.7em",
                        padding: "0.1em 0.3em",
                        border: `1px solid ${theme.colors.textMuted}`,
                        width: "auto",
                      },
                    }}
                    data-actor-id={actor.id}
                    onClick={onClickRemoveActor}
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            );
          })}

          {/* TOTAL header */}
          <div
            css={{
              gridRow: 1,
              gridColumn: actors.length + 2,
              position: "sticky",
              top: 0,
              right: 0,
              background: theme.colors.bgOpaquePrimary,
              padding: "0.5em",
              textAlign: "center",
              zIndex: 3,
              lineHeight: 1,
            }}
          >
            GRAND TURTLE
          </div>
          {/* WORKAROUND - when the entire right-hand column is `sticky`, FF
          (as of FF86) doesn't allocate space for it, so the penultimate column
          doesn't scroll past it properly. by including this "invisible",
          non-sticky copy of the top-right cell, we force FF to allocate space
          properly. On Chrome this has no effect because the space was allocated
          correctly anyway. */}
          <div
            css={{
              visibility: "hidden",
              gridRow: 1,
              gridColumn: actors.length + 2,
              top: 0,
              right: 0,
              background: theme.colors.bgOpaquePrimary,
              padding: "0.5em",
              textAlign: "center",
              lineHeight: 1,
            }}
          >
            GRAND TURTLE
          </div>

          {/* Rows */}
          {rowData.map((data, i) => {
            if (isTypeHeader(data)) {
              // Investigative or general
              return (
                <h1
                  key={data.abilityType}
                  css={{
                    "&&": {
                      gridRow: i + 2,
                      padding: "0.5em",
                      textAlign: "left",
                      position: "sticky",
                      left: 0,
                    },
                  }}
                >
                  {data.abilityType === constants.generalAbility
                    ? "General"
                    : "Investigative"}
                </h1>
              );
            } else if (isCategoryHeader(data)) {
              // Category
              return (
                <h2
                  key={data.category + i}
                  css={{
                    "&&": {
                      gridRow: i + 2,
                      padding: "0.5em",
                      textAlign: "left",
                      position: "sticky",
                      left: 0,
                    },
                  }}
                >
                  {data.category}
                </h2>
              );
            } else {
              // Actual Abilities
              return (
                <AbilityRow
                  data={data}
                  index={i}
                  actors={actors}
                />
              );
            }
          })}
        </div>
      </CSSReset>
    </ActorSheetAppContext.Provider>
  );
};
