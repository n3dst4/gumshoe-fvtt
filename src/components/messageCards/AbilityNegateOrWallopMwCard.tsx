/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { Translate } from "../Translate";
import { MwButton } from "./MwButton";
import { MWResult } from "./types";
import * as constants from "../../constants";

type WallopNegateMode =
  | typeof constants.htmlDataModeMwNegate
  | typeof constants.htmlDataModeMwWallop;

interface AbilityNegateOrWallopMwCardProps {
  msg: ChatMessage;
  ability: InvestigatorItem;
  pool: number;
  mode: WallopNegateMode;
}

const deets: { [mode in WallopNegateMode]: MWResult } = {
  [constants.htmlDataModeMwNegate]: {
    color: "#7777ff",
    text: "Negate Illustrious",
  },
  [constants.htmlDataModeMwWallop]: {
    color: "#bbbbbb",
    text: "WALLOP",
  },
};

export const AbilityNegateOrWallopMwCard: React.FC<AbilityNegateOrWallopMwCardProps> =
  React.memo(({ msg, ability, pool, mode }) => {
    const onClickAbilityName = useCallback(() => {
      ability.sheet?.render(true);
    }, [ability.sheet]);

    return (
      <div
        className="dice-roll"
        css={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1fr",
          gridTemplateRows: "max-content minmax(0, max-content) max-content",
          gridTemplateAreas: '"headline" ' + '"pool" ' + '"body" ',
          alignItems: "center",
        }}
      >
        {/* HEADLINE */}
        <div
          css={{
            gridArea: "headline",
          }}
        >
          <b>
            <a onClick={onClickAbilityName}>{ability.data.name}</a>
          </b>
        </div>
        {/* POOL */}
        <div
          css={{
            gridArea: "pool",
          }}
        >
          <Translate>Pool</Translate>: {pool}
        </div>
        {/* RESULT */}
        <MwButton deets={deets[mode]} />
      </div>
    );
  });
