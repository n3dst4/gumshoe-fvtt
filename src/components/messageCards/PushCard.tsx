import React, { useCallback } from "react";

import { InvestigatorItem } from "../../module/InvestigatorItem";
import { Translate } from "../Translate";
import { AbilityCardMode } from "./types";

interface PushCardProps {
  msg: ChatMessage;
  ability: InvestigatorItem | undefined;
  mode: AbilityCardMode;
  name: string | null;
  imageUrl: string | null;
}

const shadowOffset = "2px";
const shadowBlur = "2px";

export const PushCard: React.FC<PushCardProps> = React.memo(
  ({ msg, ability, mode, name, imageUrl }) => {
    const onClickAbilityName = useCallback(() => {
      ability?.sheet?.render(true);
    }, [ability?.sheet]);

    return (
      <div
        className="dice-roll"
        css={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "max-content 1fr",
          gridTemplateRows: "auto auto",
          gridTemplateAreas: '"image headline" ' + '"image terms" ',
          alignItems: "center",
        }}
      >
        {/* IMAGE */}
        <div
          css={{
            height: "4em",
            width: "4em",
            gridArea: "image",
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            justifyItems: "center",
            transform: "scale(0.9) rotate(-5deg)",
            boxShadow: "0 0 0.5em black",
            marginRight: "1em",
            // alignSelf: "start",
          }}
        />
        {/* TERMS */}
        <div
          css={{
            gridArea: "terms",
            fontSize: "2em",
            fontWeight: "bold",
            color: "#9b9",
            fontStyle: "italic",
            textShadow: `
            -${shadowOffset} -${shadowOffset} ${shadowBlur} #0007,
              ${shadowOffset} ${shadowOffset} ${shadowBlur} #fff
            `,
          }}
        >
          <Translate values={{ AbilityName: ability?.name ?? "" }}>
            AbilityNamePush
          </Translate>
        </div>
      </div>
    );
  },
);

PushCard.displayName = "AbilityTestCard";
