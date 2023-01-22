import React, { useCallback, useContext } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { ThemeContext } from "../../themes/ThemeContext";
import { assertPersonalDetailDataSource } from "../../typeAssertions";
import { FoundryAppContext } from "../FoundryAppContext";

interface PersonalDetailSlugProps {
  item: InvestigatorItem;
}

export const PersonalDetailSlug: React.FC<PersonalDetailSlugProps> = ({
  item,
}) => {
  assertPersonalDetailDataSource(item.data);
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
    <div
      key={item.id}
      css={{
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
      <a
        onClick={() => {
          item.sheet?.render(true);
        }}
        data-item-id={item.id}
        onDragStart={onDragStart}
        draggable="true"
      >
        {item.data.name}
      </a>
    </div>
  );
};

PersonalDetailSlug.displayName = "PersonalDetailSlug";
