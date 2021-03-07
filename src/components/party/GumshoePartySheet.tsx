/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useEffect, useState } from "react";
import * as constants from "../../constants";
import { GumshoeActor } from "../../module/GumshoeActor";
import { getDefaultThemeName, getNewPCPacks } from "../../settingsHelpers";
import { themes } from "../../theme";
import { CSSReset } from "../CSSReset";
import { ActorSheetAppContext } from "../FoundryAppContext";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";

type GumshoePartySheetProps = {
  party: GumshoeActor,
  foundryApplication: ActorSheet,
};

type AbilityType = typeof constants.investigativeAbility| typeof constants.generalAbility;
type AbilityTuple = [AbilityType, string, string];
const typeHeaderString = "typeHeader" as const;
const categoryHeaderString = "categoryHeader" as const;
const abilityTupleString = "abilityTuple" as const;
type TypeHeader = {[typeHeaderString]: AbilityType};
type CategoryHeader = {[categoryHeaderString]: string};
type AbilityRow = {[abilityTupleString]: AbilityTuple};
type RowData = TypeHeader | CategoryHeader | AbilityRow;
const hasOwnProperty = (x: any, y: string) => Object.prototype.hasOwnProperty.call(x, y);
const isTypeHeader = (data: RowData): data is TypeHeader => hasOwnProperty(data, typeHeaderString);
const isCategoryHeader = (data: RowData): data is CategoryHeader => hasOwnProperty(data, categoryHeaderString);

const getSystemAbilities = async () => {
  const proms = getNewPCPacks().map(async (packId) => {
    const content = await (game.packs
      .find((p: any) => p.collection === packId)
      .getContent());
    const pairs: AbilityTuple[] = content.map((i: any) => [i.data.type, i.data.data.category, i.data.name]);
    return pairs;
  });
  const results = await Promise.all(proms);
  return results.flat();
};

const compareTypes = (a:AbilityType, b: AbilityType) => (
  a === constants.investigativeAbility && b === constants.generalAbility
    ? -1
    : a === constants.generalAbility && b === constants.investigativeAbility
      ? +1
      : 0
);

const compareStrings = (a: string, b: string) => {
  const a_ = a.toLowerCase();
  const b_ = b.toLowerCase();
  return (a_ < b_) ? -1 : (a_ > b_) ? +1 : 0;
};

const compareTuples = ([aType, aCategory, aName]: AbilityTuple, [bType, bCategory, bName]: AbilityTuple) => {
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

const buildRowData = (tuples: AbilityTuple[]): RowData[] => {
  const result: RowData[] = [];

  const sorted = tuples.sort(compareTuples);

  let lastType: AbilityType|null = null;
  let lastCategory: string|null = null;

  for (const [type, category, name] of sorted) {
    if (type !== lastType) {
      result.push({ typeHeader: type });
      lastType = type;
      lastCategory = null;
    }
    if (category !== lastCategory) {
      result.push({ categoryHeader: category });
      lastCategory = category;
    }
    result.push({ abilityTuple: [type, category, name] });
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

  useEffect(() => {
    const getAbs = async () => {
      const tuples = await getSystemAbilities();
      const rowData = buildRowData(tuples);
      setRowData(rowData);

      const actors = party.getActorIds().map((id) => game.actors.get(id) as GumshoeActor);
      setActors(actors);
    };
    getAbs();
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
        <InputGrid>
          <GridField label="Party Name">
            <AsyncTextInput
              value={party.getName()}
              onChange={party.setName}
              />
          </GridField>
        </InputGrid>
        <div
          css={{
            display: "grid",
            gridTemplateRows: "min-content max-content 1fr",
            gridTemplateColumns: "10em 1fr 10em",
            gap: "0.5em",
            gridTemplateAreas:
              "\"title title image\" " +
              "\"pools stats image\" " +
              "\"pools body  body\" ",
          }}
        >
        </div>
        <div
          css={{
            flex: 1,
            display: "grid",
            gridTemplateRows: "3em",
            gridAutoRows: "auto",
            gridTemplateColumns: "max-content",
            gridAutoColumns: "minmax(min-content, 6em)",
            gap: "0.5em",
            overflow: "auto",
          }}
        >
          {rowData.map((data, i) => {
            if (isTypeHeader(data)) {
              return (<h1 css={{ gridRow: i + 2 }}>
                {data[typeHeaderString] === constants.generalAbility ? "General" : "Investigative"}
              </h1>);
            } else if (isCategoryHeader(data)) {
              return (<h2 css={{ gridRow: i + 2 }}>
                {data[categoryHeaderString]}
              </h2>);
            } else {
              return (
                <Fragment>
                  <div css={{ gridRow: i + 2 }}>
                    {data[abilityTupleString][2]}
                  </div>
                  {actors.map((actor, j) => {
                    return (
                      <div
                        key={actor.id}
                        css={{
                          gridRow: i + 2,
                          gridCol: j + 2,
                        }}
                      >
                        {actor.name}
                      </div>
                    );
                  })
                  }
                </Fragment>
              );
            }
          })}
        </div>
      </CSSReset>
    </ActorSheetAppContext.Provider>
  );
};
