import React, {
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { getById, isNullOrEmptyString } from "../../functions/utilities";
import { irid } from "../../irid/irid";
import { settings } from "../../settings/settings";
import { ThemeContext } from "../../themes/ThemeContext";
import { assertCardItem, CardItem } from "../../v10Types";
import { Button } from "../inputs/Button";

const checkIsOverflowing = (element: HTMLElement | null) => {
  const yes = !!element && element.scrollHeight > element.clientHeight;
  console.log(yes);
  return yes;
};

interface CardDisplayProps {
  card: CardItem;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({ card }) => {
  assertCardItem(card);
  const theme = useContext(ThemeContext);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) => {
      setOverflowing(checkIsOverflowing(ref.current));
    });
    resizeObserver.observe(ref.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleClick = useCallback(() => {
    card.sheet?.render(true);
  }, [card.sheet]);

  const handleClickExpand = useCallback(() => {
    setExpanded((expanded) => !expanded);
  }, []);

  const category = getById(
    settings.cardCategories.get(),
    card.system.categoryId,
  );

  const transparentBackground = useMemo(() => {
    return irid(theme.colors.backgroundPrimary).alpha(0).toString();
  }, [theme.colors.backgroundPrimary]);

  return (
    <div
      ref={ref}
      tabIndex={0}
      onClick={handleClick}
      className="card-display"
      css={{
        ...theme.cardStyles.backdropStyle,
        aspectRatio: expanded ? undefined : "3/4",
        overflow: "hidden",
        marginBottom: "0.5em",
        position: "relative",
      }}
    >
      <p css={theme.cardStyles.supertitleStyle}>
        {category ? category.name : ""}
        {"  "}
        {!isNullOrEmptyString(card.system.supertitle) && card.system.supertitle}
      </p>
      <h2 css={theme.cardStyles.titleStyle}>{card.name}</h2>
      {!isNullOrEmptyString(card.system.subtitle) && (
        <p css={theme.cardStyles.subtitleStyle}>{card.system.subtitle}</p>
      )}
      {!isNullOrEmptyString(card.system.description.html) && (
        <p
          css={theme.cardStyles.descriptionStyle}
          dangerouslySetInnerHTML={{ __html: card.system.description.html }}
        ></p>
      )}
      {!isNullOrEmptyString(card.system.effects.html) && (
        <p
          css={theme.cardStyles.effectStyle}
          dangerouslySetInnerHTML={{ __html: card.system.effects.html }}
        ></p>
      )}
      {overflowing && !expanded && (
        <div
          css={{
            position: "absolute",
            bottom: "0",
            right: "0",
            left: "0",
            background: `linear-gradient(to top, ${theme.colors.bgOpaquePrimary} 0.5em, ${transparentBackground} 100%)`,
            padding: "1.5em 0.5em 0.5em 0.5em",
            textAlign: "center",
          }}
        >
          <Button
            css={{ "&&": { background: theme.colors.bgOpaqueSecondary } }}
            onClick={handleClickExpand}
          >
            Expand
          </Button>
        </div>
      )}
    </div>
  );
};

CardDisplay.displayName = "CardDisplay";
