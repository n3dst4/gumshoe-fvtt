/** @jsx jsx */
import { CSSObject, jsx } from "@emotion/react";
import React, { Fragment } from "react";
import { CSSTransition } from "react-transition-group";
import { useHover } from "../../hooks/useHover";
import { Translate } from "../Translate";
import { fadeInOutClasses } from "./transitions";
import { MWResult } from "./types";

type MwButtonProps = {
  deets: MWResult,
  onClick?: () => void,
};

const basicShadow = "0 0 0.5em 0 #0007";

export const MwButton: React.FC<MwButtonProps> = ({
  onClick: onClickProp,
  deets,
}: MwButtonProps) => {
  const { hover, onMouseEnter, onMouseLeave } = useHover();

  const style: CSSObject = {
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
  };

  const content = (
    <Fragment>
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
          ].join(","),
          display: "grid",
          gridTemplateColumns: "1fr",
          gridTemplateRows: "1fr",
          gridTemplateAreas: "'area'",
        }}
      >
        <CSSTransition
          in={!hover}
          timeout={1000}
          classNames={{
            ...fadeInOutClasses,
          }}
          unmountOnExit
        >
          <span css={{ gridArea: "area" }}>{deets.text}</span>
        </CSSTransition>
        <CSSTransition
          in={hover}
          timeout={1000}
          classNames={{
            ...fadeInOutClasses,
          }}
          unmountOnExit
        >
          <span css={{ gridArea: "area" }}>
            <Translate>Re-Roll</Translate> <i className="fas fa-sync fa-spin" />
          </span>
        </CSSTransition>
      </div>
    </Fragment>
  );

  return onClickProp
    ? (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClickProp}
      css={style}
    >
      {content}
    </button>
      )
    : (
    <div css={style}>{content}</div>
      );
};
