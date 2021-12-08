/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useContext, useState } from "react";
import { mwNegateCost, mwWallopCost } from "../../constants";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { ThemeContext } from "../../themes/ThemeContext";
import { assertGeneralAbilityDataSource, MWDifficulty } from "../../types";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { Translate } from "../Translate";

type AbilityTestMWProps = {
  ability: InvestigatorItem,
};

export const AbilityTestMW: React.FC<AbilityTestMWProps> = ({ ability }) => {
  assertGeneralAbilityDataSource(ability.data);
  const theme = useContext(ThemeContext);
  const [difficulty, setDifficulty] = useState<MWDifficulty>(0);
  const [boonLevy, setBoonLevy] = useState(0);

  const onTest = useCallback(() => {
    ability.mwTestAbility(difficulty, boonLevy);
  }, [ability, boonLevy, difficulty]);

  const onWallop = useCallback(() => {
    ability.mWWallop();
  }, [ability]);

  const onNegateIllustrious = useCallback(() => {
    ability.mWNegateIllustrious();
  }, [ability]);

  const onChangeDifficulty = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.currentTarget.value;
    const diff = val === "easy" ? "easy" : Number(val);
    setDifficulty(diff);
  };

  const onChangeBoonLevy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.currentTarget.value;
    const newBoonLevy = Number(val);
    setBoonLevy(newBoonLevy);
  };

  return (
    <div
      css={{
        border: `1px solid ${theme.colors.text}`,
        padding: "0.5em",
        marginBottom: "1em",
        background: theme.colors.backgroundSecondary,
        display: "flex",
        flexDirection: "column",
        gap: "0.5em",
      }}
    >
      <InputGrid>
        <GridField label="Difficulty">
          <select
            css={{ display: "block", width: "100%" }}
            value={difficulty}
            onChange={onChangeDifficulty}
          >
            <option value="easy">Easy</option>
            <option value={0}>Normal</option>
            <option value={-1}>Hard (-1)</option>
            <option value={-2}>Very Hard (-2)</option>
          </select>
        </GridField>
        <GridField label="Boon/levy">
          <div css={{ position: "relative" }}>
            <select
              css={{ display: "block", width: "100%" }}
              value={boonLevy}
              onChange={onChangeBoonLevy}
            >
              <option value={+2}>Boon +2</option>
              <option value={+1}>Boon +1</option>
              <option value={0}>0</option>
              <option value={-1}>Levy (-1)</option>
              <option value={-2}>Levy (-2)</option>
            </select>
          </div>
        </GridField>
      </InputGrid>
      <div
        css={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <button disabled={ability.data.data.pool < mwNegateCost} css={{ flex: "1" }} onClick={onNegateIllustrious}>
          <Translate>Negate</Translate>
        </button>
        <button disabled={ability.data.data.pool < mwWallopCost} css={{ flex: "1" }} onClick={onWallop}>
          <Translate>Wallop</Translate>
        </button>
        <button css={{ flex: "2" }} onClick={onTest}>
          <Translate>Test</Translate>
        </button>
      </div>
    </div>
  );
};
