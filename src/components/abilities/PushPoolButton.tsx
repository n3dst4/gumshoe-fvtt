import React, { useContext } from "react";

import { ThemeContext } from "../../themes/ThemeContext";
import { GeneralAbilityItem } from "../../v10Types";
import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { InputGrid } from "../inputs/InputGrid";
import { Translate } from "../Translate";

interface PushPoolButtonProps {
  ability: GeneralAbilityItem;
}

export const PushPoolButton: React.FC<PushPoolButtonProps> = ({ ability }) => {
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
          <button
            css={{ flex: 1 }}
            // disabled={spend === 0}
            onClick={handleClickPush}
          >
            <Translate>Push</Translate>
          </button>
        </div>
      </GridFieldStacked>
    </InputGrid>
  );
};

PushPoolButton.displayName = "PushPoolButton";
