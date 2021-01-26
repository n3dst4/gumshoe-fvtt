/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { TrailActor } from "../../module/TrailActor";

type EquipmentAreaProps = {
  actor: TrailActor,
};

export const EquipmentArea: React.FC<EquipmentAreaProps> = ({
  actor,
}) => {
  const items = actor.getEquipment();
  console.log("equipment rendering");
  return (
    <div>
      <h1>Equipment</h1>
      {
        items.map((item) => (
          <div key={item.id}>{item.name}</div>
        ))
      }
    </div>
  );
};
