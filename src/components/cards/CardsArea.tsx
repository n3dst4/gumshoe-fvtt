import React from "react";

import { InvestigatorActor } from "../../module/InvestigatorActor";
import { Translate } from "../Translate";

interface CardsAreaProps {
  actor: InvestigatorActor;
}

const CardsArea: React.FC<CardsAreaProps> = ({ actor }) => {
  return (
    <div>
      <h2>
        <Translate>Good</Translate>
      </h2>
      <ul></ul>
    </div>
  );
};

export default CardsArea;
