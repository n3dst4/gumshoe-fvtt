import React, { useContext } from "react";

import { useItemSheetContext } from "../../hooks/useSheetContexts";
import { ThemeContext } from "../../themes/ThemeContext";
import { Button } from "../inputs/Button";
import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { InputGrid } from "../inputs/InputGrid";
import { Translate } from "../Translate";

export const PushPoolButton = () => {
  const { item } = useItemSheetContext();
  const theme = useContext(ThemeContext);

  const handleClickPush = React.useCallback(() => {
    void item.push();
  }, [item]);

  return (
    <InputGrid
      className={theme.panelClass}
      css={{
        padding: "0.5em",
        marginBottom: "0.5em",
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
