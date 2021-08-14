/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useContext, useState } from "react";
import * as constants from "../../constants";
import { assertGame, isGeneralAbility } from "../../functions";
import { GumshoeItem } from "../../module/GumshoeItem";
import { ThemeContext } from "../../theme";
import { assertAbilityDataSource } from "../../types";
import { CheckButtons } from "../inputs/CheckButtons";
import { GridField } from "../inputs/GridField";
import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { InputGrid } from "../inputs/InputGrid";
import { Translate } from "../Translate";

type AbilityTestProps = {
  ability: GumshoeItem,

};

const defaultSpendOptions = new Array(8).fill(null).map((_, i) => {
  const label = i.toString();
  return { label, value: Number(label), enabled: true };
});

export const AbilityTest: React.FC<AbilityTestProps> = ({
  ability,
}) => {
  const theme = useContext(ThemeContext);
  const [spend, setSpend] = useState(0);

  const onTest = useCallback(() => {
    assertGame(game);
    assertAbilityDataSource(ability.data);
    if (ability.actor === null) { return; }
    const useBoost = game.settings.get(constants.systemName, constants.useBoost);
    const isBoosted = useBoost && ability.getBoost();
    const boost = isBoosted ? 1 : 0;
    const roll = useBoost
      ? new Roll("1d6 + @spend + @boost", { spend, boost })
      : new Roll("1d6 + @spend", { spend });
    const label = `Rolling ${ability.name}`;
    roll.roll().toMessage({
      speaker: ChatMessage.getSpeaker({ actor: ability.actor }),
      flavor: label,
    });
    ability.update({ data: { pool: ability.data.data.pool - Number(spend) || 0 } });
    setSpend(0);
  }, [ability, spend]);

  const onSpend = useCallback(() => {
    assertAbilityDataSource(ability.data);
    if (ability.actor === null) { return; }
    const roll = new Roll("@spend", { spend });
    const label = `Ability pool spend for ${ability.name}`;
    roll.roll().toMessage({
      speaker: ChatMessage.getSpeaker({ actor: ability.actor }),
      flavor: label,
    });
    ability.update({ data: { pool: ability.data.data.pool - Number(spend) || 0 } });
    setSpend(0);
  }, [ability, spend]);

  const spendOptions = defaultSpendOptions.map((option) => {
    assertAbilityDataSource(ability.data);
    return ({
      ...option,
      enabled: option.value <= ability.data.data.pool,
    });
  });

  const isGeneral = isGeneralAbility(ability);

  return (
    <InputGrid
      css={{
        border: `1px solid ${theme.colors.text}`,
        padding: "1em",
        marginBottom: "1em",
        background: theme.colors.bgTransSecondary,
      }}
    >
      <GridField label="Spend">
        <CheckButtons
          onChange={setSpend}
          selected={spend}
          options={spendOptions}
        />
      </GridField>
      <GridFieldStacked>
        <div
          css={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <button css={{ flex: 1 }} disabled={spend === 0} onClick={onSpend}>
            <Translate>{isGeneral ? "Simple Spend" : "Spend"}</Translate>
          </button>
          {isGeneral && (
            <button css={{ flex: 1 }} onClick={onTest}>
              <Translate>Test</Translate> <i className="fa fa-dice" />
            </button>
          )}
        </div>
      </GridFieldStacked>
    </InputGrid>
  );
};
