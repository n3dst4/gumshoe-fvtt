/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { TrailItem } from "../module/TrailItem";
type EquipmentSheetProps = {
  entity: TrailItem,
  foundryWindow: Application,
};

export const EquipmentSheet: React.FC<EquipmentSheetProps> = ({
  entity,
  foundryWindow,
}) => {
  return (
    <div>equiptiment</div>
  );
};
