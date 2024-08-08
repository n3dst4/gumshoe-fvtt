import React from "react";

import { InvestigatorActor } from "../../module/InvestigatorActor";
import { isCardItem } from "../../v10Types";
import { absoluteCover } from "../absoluteCover";
import { CardDisplay } from "./CardDisplay";

interface CardsAreaProps {
  actor: InvestigatorActor;
}

export const CardsArea: React.FC<CardsAreaProps> = ({ actor }) => {
  const cards = actor.items.filter((item) => isCardItem(item));

  return (
    <div
      css={{
        ...absoluteCover,
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridAutoRows: "auto",
        padding: "0.5em",
        columnGap: "0.5em",
        rowGap: "0.5em",
      }}
    >
      {cards.map((card) => (
        <CardDisplay key={card.id} card={card} />
      ))}
    </div>
  );
};
