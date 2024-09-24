import React, { useContext } from "react";

import { ThemeContext } from "../../themes/ThemeContext";
import { AbilityItem } from "../../v10Types";
import { Button } from "../inputs/Button";
import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { InputGrid } from "../inputs/InputGrid";
import { Translate } from "../Translate";

interface PushPoolButtonProps {
  ability: AbilityItem;
}

export const PushPoolButton = (
  {
    ability
  }: PushPoolButtonProps
) => {
  const theme = useContext(ThemeContext);

  const handleClickPush = React.useCallback(() => {
    void ability.push();
  }, [ability]);

  return (
    <InputGrid
      className={theme.panelClass}
      css={{
        padding: "1em",
        marginBottom: "1em",
        ...theme.panelStyleSecondary,
      }}
    >
      <GridFieldStacked>
        <div
          css={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Button css={{ flex: 1 }} onClick={handleClickPush}>
            <Translate>Push</Translate>
          </Button>
        </div>
      </GridFieldStacked>
    </InputGrid>
  );
};

PushPoolButton.displayName = "PushPoolButton";
