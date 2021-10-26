/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ReactNode } from "react";

type DiceTermsProps = {
  terms: RollTerm[]|undefined,
  className?: string,
  parp?: DiceTerm,
};

export const DiceTerms: React.FC<DiceTermsProps> = ({
  terms = [],
  className,
}: DiceTermsProps) => {
  logger.log("terms: ", terms);
  return (
    <div
      className={className}
    >
      {terms.map<ReactNode>((term, i) => {
        if ((term as DiceTerm).results) {
          const results = (term as DiceTerm).results.map((result, j) => {
            return (
              <span
                key={j}
                css={{
                  width: "1.5em",
                  display: "inline-block",
                  height: "1.5em",
                  textAlign: "center",
                  background: "white",
                  borderWidth: "3px",
                  borderRadius: "0.2em",
                  boxShadow: "0.2em 0.2em 0.2em #0007",
                  borderStyle: "outset",
                  borderColor: "#bbb",
                  marginRight: "0.2em",
                  marginBottom: "0.3em",
                  transform: `rotate(${(Math.random() * 12) - 6}deg)`,
                }}
              >
                {result.result}
              </span>
            );
          });
          return results;
        } else if ((term as OperatorTerm).operator) {
          return <span key={i}>{(term as OperatorTerm).operator}</span>;
        } else if ((term as NumericTerm).number) {
          return <span key={i}>{(term as NumericTerm).number}</span>;
        } else {
          return null;
        }
      })
      }
    </div>
  );
};
