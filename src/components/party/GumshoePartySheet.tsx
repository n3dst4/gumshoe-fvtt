/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useEffect, useState } from "react";
import * as constants from "../../constants";
import { sortEntitiesByName } from "../../functions";
import { GumshoeActor } from "../../module/GumshoeActor";
import { getDefaultThemeName, getNewPCPacks } from "../../settingsHelpers";
import { themes } from "../../theme";
import { AbilityType } from "../../types";
import { CSSReset } from "../CSSReset";
import { ActorSheetAppContext } from "../FoundryAppContext";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";

type GumshoePartySheetProps = {
  party: GumshoeActor,
  foundryApplication: ActorSheet,
};

type AbilityTuple = [AbilityType, string, string];
const typeHeaderKey = "typeHeader" as const;
const categoryHeaderKey = "categoryHeader" as const;
const abilityRowkey = "abilityRowString" as const;
type TypeHeader = {
  rowType: typeof typeHeaderKey,
  abilityType: AbilityType,
};
type CategoryHeader = {
  rowType: typeof categoryHeaderKey,
  category: string,
};
type ActorAbilityInfo = {
  actorId: string,
  abilityId: string,
  rating: number,
};
type AbilityRow = {
  rowType: typeof abilityRowkey,
  name: string,
  abilityType: AbilityType,
  actorInfo: {
    [actorId: string]: ActorAbilityInfo,
  },
  total: number,
};
type RowData = TypeHeader | CategoryHeader | AbilityRow;
const isTypeHeader = (data: RowData): data is TypeHeader =>
  data.rowType === typeHeaderKey;
const isCategoryHeader = (data: RowData): data is CategoryHeader =>
  data.rowType === categoryHeaderKey;

const getSystemAbilities = async () => {
  const proms = getNewPCPacks().map(async (packId) => {
    const content = await game.packs
      .find((p: any) => p.collection === packId)
      .getContent();
    const pairs: AbilityTuple[] = content.map((i: any) => [
      i.data.type,
      i.data.data.category,
      i.data.name,
    ]);
    return pairs;
  });
  const results = await Promise.all(proms);
  return results.flat();
};

const compareTypes = (a: AbilityType, b: AbilityType) =>
  a === constants.investigativeAbility && b === constants.generalAbility
    ? -1
    : a === constants.generalAbility && b === constants.investigativeAbility
      ? +1
      : 0;

const compareStrings = (a: string, b: string) => {
  const a_ = a.toLowerCase();
  const b_ = b.toLowerCase();
  return a_ < b_ ? -1 : a_ > b_ ? +1 : 0;
};

const compareTuples = (
  [aType, aCategory, aName]: AbilityTuple,
  [bType, bCategory, bName]: AbilityTuple,
) => {
  const typeComparison = compareTypes(aType, bType);
  if (typeComparison !== 0) {
    return typeComparison;
  }
  const categoryComparison = compareStrings(aCategory, bCategory);
  if (categoryComparison !== 0) {
    return categoryComparison;
  }
  const nameComparison = compareStrings(aName, bName);
  return nameComparison;
};

const buildRowData = (
  tuples: AbilityTuple[],
  actors: GumshoeActor[],
): RowData[] => {
  const result: RowData[] = [];

  const sorted = tuples.sort(compareTuples);

  let lastType: AbilityType | null = null;
  let lastCategory: string | null = null;

  for (const [abilityType, category, name] of sorted) {
    if (abilityType !== lastType) {
      result.push({ rowType: typeHeaderKey, abilityType });
      lastType = abilityType;
      lastCategory = null;
    }
    if (category !== lastCategory) {
      result.push({ rowType: categoryHeaderKey, category });
      lastCategory = category;
    }
    const actorInfo: { [actorId: string]: ActorAbilityInfo } = {};
    let total = 0;

    for (const actor of actors) {
      const ability = actor.getAbilityByName(name, abilityType);
      if (ability) {
        const rating = ability.getRating();
        actorInfo[actor.id] = {
          abilityId: ability.id,
          actorId: actor.id,
          rating,
        };
        total += rating;
      }
    }

    result.push({
      rowType: abilityRowkey,
      name,
      abilityType,
      actorInfo,
      total,
    });
  }
  return result;
};

export const GumshoePartySheet: React.FC<GumshoePartySheetProps> = ({
  foundryApplication,
  party,
}) => {
  const theme = themes[getDefaultThemeName()] || themes.trailTheme;
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [actors, setActors] = useState<GumshoeActor[]>([]);
  const actorIds = party.getActorIds();

  useEffect(() => {
    const getAbs = async () => {
      const actors = actorIds.map((id) => game.actors.get(id) as GumshoeActor);
      setActors(sortEntitiesByName(actors));

      const tuples = await getSystemAbilities();
      const rowData = buildRowData(tuples, actors);
      setRowData(rowData);
    };
    getAbs();
  }, [actorIds]);

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
            gridTemplateRows: "minmax(auto, 4em)",
            gridAutoRows: "auto",
            gridTemplateColumns: "max-content",
            gridAutoColumns: "minmax(min-content, auto)",
            overflow: "auto",
            // gap: "0.5em",
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
                  textAlign: "center",
                  zIndex: 2,
                  lineHeight: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <a
                  css={{
                    "-webkit-line-clamp": "2",
                    display: "-webkit-box",
                    "-webkit-box-orient": "vertical",
                    overflow: "hidden",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    actor.sheet.render(true);
                  }}
                >
                  {actor.name}
                </a>
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
          (as of 86) doesn't allocate space for it so the last mobile column
          doesn't scroll past it properly. by including this "invisible",
          non-sticky copy of the top-right cell, we force FF to allocate space
          properly. On Chrome this has no effect because the space was allocated
          right anyway. */}
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
              const bg = i % 2 === 0 ? theme.colors.bgTransPrimary : theme.colors.bgTransSecondary;
              const headerBg = i % 2 === 0 ? theme.colors.bgOpaquePrimary : theme.colors.bgOpaqueSecondary;
              return (
                <Fragment>

                  {/* Ability name */}
                  <div css={{
                    gridRow: i + 2,
                    backgroundColor: headerBg,
                    padding: "0.5em",
                    textAlign: "left",
                    position: "sticky",
                    left: 0,
                  }}>
                    {data.name}
                  </div>

                  {/* Ability scores */}
                  {actors.map((actor, j) => {
                    const actorInfo = data.actorInfo[actor.id];
                    return (
                      <a
                        key={actor.id}
                        onClick={(e) => {
                          e.preventDefault();
                          actor.getOwnedItem(actorInfo.abilityId)?.sheet?.render(true);
                        }}
                        css={{
                          background: bg,
                          display: "block",
                          gridRow: i + 2,
                          gridColumn: j + 2,
                          padding: "0.5em",
                          textAlign: "center",
                        }}
                      >
                        {actorInfo?.rating ?? "--"}
                      </a>
                    );
                  })}

                  {/* Total */}
                  <div
                    css={{
                      background: headerBg,
                      gridRow: i + 2,
                      gridColumn: actors.length + 2,
                      position: "sticky",
                      right: 0,
                      padding: "0.5em",
                      textAlign: "center",
                    }}
                  >
                    {data.total}
                  </div>
                </Fragment>
              ); //
            }
          })}
        </div>
      </CSSReset>
    </ActorSheetAppContext.Provider>
  );
};
