/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";
import { MWResult } from "./types";

type MwButtonProps = {
  deets: MWResult,
};

const basicShadow = "0 0 0.5em 0 #0007";

export const MwButton: React.FC<MwButtonProps> = ({
  deets,
}: MwButtonProps) => {
  return (
    <button
    css={{
      textAlign: "center",
      padding: "0.2em",
      gridArea: "body",
      marginTop: "0.5em",
      borderRadius: "2em",
      borderStyle: "none",
      backgroundImage: [
        `radial-gradient(closest-side, ${deets.color}77 0%, ${deets.color}00 100%)`,
        "linear-gradient(to bottom, #999, #000)",
      ].join(", "),
      boxShadow: basicShadow,
      fontFamily: "'Longdon Decorative Regular', sans-serif",
      fontSize: "1.5em",
    }}
  >
    <div
      css={{
        color: "#fff",
        borderStyle: "solid",
        borderWidth: "2px",
        borderColor: "#fff",
        borderRadius: "1em",
        textShadow: [
          `0 0 0.5em ${deets.color}`,
          `0 0 0.2em ${deets.color}`,
          `0 0 1em ${deets.color}`,
          `0 0 2em ${deets.color}`,
        ].join(","),
        boxShadow: [
          `0 0 0.5em 0 inset ${deets.color}`,
          `0 0 0.5em 0 ${deets.color}`,
          // basicShadow,
        ].join(","),

      }}
    >
      {deets.text}
    </div>
  </button>
  );
};
