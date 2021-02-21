/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";

type GumshoeSettingsProps = {
  foundryApplication: Application
};

export const GumshoeSettings: React.FC<GumshoeSettingsProps> = ({
  foundryApplication,
}) => {
  return (
    <div>Gumshoe settings go here</div>
  );
};
