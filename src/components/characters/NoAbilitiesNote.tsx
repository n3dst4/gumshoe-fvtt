import React from "react";
import { Translate } from "../Translate";

export const NoAbilitiesNote: React.FC = () => {
  return (
    <i style={{ gridColumn: "1/-1" }}><Translate>No abilities in this category</Translate></i>
  );
};
