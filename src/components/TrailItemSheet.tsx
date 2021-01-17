/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { TrailItem } from "../module/TrailItem";

type TrailItemSheetProps = {
  entity: TrailItem,
  foundryWindow: Application,
};

export const TrailItemSheet: React.FC<TrailItemSheetProps> = ({
  entity,
  foundryWindow,
}) => {
  return (
    <div>
      React item sheet!
    </div>
  );
};
