import React, { useCallback, useContext } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { ThemeContext } from "../../themes/ThemeContext";
import { FoundryAppContext } from "../FoundryAppContext";

interface SlugProps {
  onClick?: () => void;
  item?: InvestigatorItem;
  children?: React.ReactNode;
}

export const Slug: React.FC<SlugProps> = ({ onClick, item, children }) => {
  const app = useContext(FoundryAppContext);
  const theme = useContext(ThemeContext);
  const onDragStart = useCallback(
    (e: React.DragEvent<HTMLAnchorElement>) => {
      if (app !== null) {
        (app as any)._onDragStart(e);
      }
    },
    [app],
  );

  return (
    <a
      onClick={() => {
        onClick && onClick();
      }}
      data-item-id={item?.id}
      onDragStart={onDragStart}
      draggable="true"
      css={{
        display: "inline-block",
        borderRadius: "1em",
        padding: "0.1em 0.5em",
        margin: "0.1em",
        backgroundColor: theme.colors.backgroundSecondary,
        color: theme.colors.accent,
        lineHeight: "1em",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: "100%",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: theme.colors.accent,
      }}
    >
      {item && (
        <div
          css={{
            display: "inline-block",
            height: "1em",
            width: "1em",
            marginRight: "0.5em",

            backgroundImage: `url(${item.img})`,
            backgroundSize: "cover",
          }}
        />
      )}
      {children}
    </a>
  );
};

Slug.displayName = "Slug";
