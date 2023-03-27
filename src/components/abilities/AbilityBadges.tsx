import React, { ReactNode, useContext } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { ThemeContext } from "../../themes/ThemeContext";
import { assertAbilityDataSource } from "../../typeAssertions";
import { SituationalModifierBadge } from "./SituationalModifierBadge";

interface UnlockBadgesProps {
  ability: InvestigatorItem;
  className?: string;
}

export const AbilityBadges: React.FC<UnlockBadgesProps> = ({
  ability,
  className,
}: UnlockBadgesProps) => {
  assertAbilityDataSource(ability.data);
  const situationalModifiers = ability.getVisibleSituationalModifiers();
  const unlocks = ability.getActiveUnlocks();
  const theme = useContext(ThemeContext);
  return (
    <div className={className}>
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
      {/* Situational modifers */}
      <div
        css={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "0.1em",
        }}
      >
        {situationalModifiers.map<ReactNode>((situationalModifer) => {
          return (
            <SituationalModifierBadge
              key={situationalModifer.id}
              situationalModifier={situationalModifer}
              ability={ability}
            />
          );
        })}
      </div>
      <div
        css={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "0.25em",
        }}
      >
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
      </div>
    </div>
  );
};

AbilityBadges.displayName = "AbilityBadges";
