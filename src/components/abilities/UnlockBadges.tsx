/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ReactNode, useContext } from "react";
import { ThemeContext } from "../../themes/ThemeContext";
import { assertAbilityDataSource } from "../../types";

interface UnlockBadgesProps {
  ability: Item;
  className?: string;
}

export const UnlockBadges: React.FC<UnlockBadgesProps> = ({
  ability,
  className,
}: UnlockBadgesProps) => {
  assertAbilityDataSource(ability.data);
  const unlocks = ability.data.data.unlocks;
  const actualRating = ability.data.data.rating;
  const theme = useContext(ThemeContext);
  return (
    <div
      className={className}
      css={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      {unlocks.map<ReactNode>(({ description, rating: targetRating }, i) => {
        if (actualRating >= targetRating) {
          return (
            <span
              css={{
                background: theme.colors.accent,
                color: theme.colors.accentContrast,
                fontSize: "0.9em",
                lineHeight: "1",
                borderRadius: "0.5em",
                padding: "0 0.5em",
                margin: "0 0.25em",
              }}
            >
              {targetRating}: {description}
            </span>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};
