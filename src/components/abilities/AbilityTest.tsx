import React, { useCallback, useContext, useState } from "react";

import { InvestigatorItem } from "../../module/InvestigatorItem";
import { ThemeContext } from "../../themes/ThemeContext";
import { assertAbilityItem, isGeneralAbilityItem } from "../../v10Types";
import { CheckButtons } from "../inputs/CheckButtons";
import { GridField } from "../inputs/GridField";
import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { InputGrid } from "../inputs/InputGrid";
import { Translate } from "../Translate";

type AbilityTestProps = {
  ability: InvestigatorItem;
};

const defaultSpendOptions = new Array(8).fill(null).map((_, i) => {
  const label = i.toString();
  return { label, value: Number(label), enabled: true };
});

export const AbilityTest: React.FC<AbilityTestProps> = ({ ability }) => {
  const theme = useContext(ThemeContext);
  const [spend, setSpend] = useState(0);

  const handleClickTest = useCallback(() => {
    void ability.testAbility(spend);
    setSpend(0);
  }, [ability, spend]);

  const handleClickSpend = useCallback(() => {
    void ability.spendAbility(spend);
    setSpend(0);
  }, [ability, spend]);

  const spendOptions = defaultSpendOptions.map((option) => {
    assertAbilityItem(ability);
    return {
      ...option,
      enabled: option.value <= ability.system.pool,
    };
  });

  const isGeneral = isGeneralAbilityItem(ability);

  return (
    <InputGrid
      className={theme.panelClass}
      css={{
        padding: "1em",
        marginBottom: "1em",
        ...theme.panelStyleSecondary,
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
          <button
            css={{ flex: 1 }}
            disabled={spend === 0}
            onClick={handleClickSpend}
          >
            <Translate>{isGeneral ? "Simple Spend" : "Spend"}</Translate>
          </button>
          {isGeneral && (
            <button css={{ flex: 1 }} onClick={handleClickTest}>
              <Translate>Test</Translate> <i className="fa fa-dice" />
            </button>
          )}
        </div>
      </GridFieldStacked>
    </InputGrid>
  );
};
