import React, { ReactNode, useContext } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { ThemeContext } from "../../themes/ThemeContext";
import { assertAbilityDataSource } from "../../typeAssertions";

interface UnlockBadgesProps {
  ability: InvestigatorItem;
  className?: string;
}

export const UnlockBadges: React.FC<UnlockBadgesProps> = ({
  ability,
  className,
}: UnlockBadgesProps) => {
  assertAbilityDataSource(ability.data);
  const unlocks = ability.getActiveUnlocks();
  const situationalModifiers = ability.data.data.situationalModifiers;
  const theme = useContext(ThemeContext);
  return (
    <div
      className={className}
      css={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {/* Boost */}
      {ability.data.data.boost && (
        <span
          css={{
            background: theme.colors.accentContrast,
            color: theme.colors.accent,
            outline: `1px solid ${theme.colors.accent}`,
            fontSize: "0.9em",
            lineHeight: "1",
            borderRadius: "0.5em",
            padding: "0 0.5em",
            margin: "0 0.25em",
          }}
        >
          Boosted
        </span>
      )}
      {/* Unlocks */}
      {unlocks.map<ReactNode>(({ description }, i) => {
        return (
          <span
            key={i}
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
            {description}
          </span>
        );
      })}
      {/* Situational modifers */}
      {situationalModifiers.map<ReactNode>(({ situation, modifier }, i) => {
        return (
          <span
            key={i}
            css={{
              background: theme.colors.accentContrast,
              color: theme.colors.accent,
              border: `1px solid ${theme.colors.accent}`,
              fontSize: "0.9em",
              lineHeight: "1",
              borderRadius: "0.5em",
              padding: "0 0.5em",
              margin: "0 0.25em",
            }}
          >
            {situation}: {modifier >= 0 && "+"}
            {modifier}
          </span>
        );
      })}
    </div>
  );
};
