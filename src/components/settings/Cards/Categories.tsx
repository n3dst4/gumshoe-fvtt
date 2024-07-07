import { Link, Route, useNavigationContext } from "@lumphammer/minirouter";
import { nanoid } from "nanoid";
import React, { MouseEventHandler, useContext, useMemo } from "react";

import { irid } from "../../../irid/irid";
import { ThemeContext } from "../../../themes/ThemeContext";
import { absoluteCover } from "../../absoluteCover";
import { NestedPanel } from "../../nestedPanels/NestedPanel";
import { Translate } from "../../Translate";
import { DispatchContext, StateContext } from "../contexts";
import { store } from "../store";
import { Category } from "./Category";
import { cardCategory } from "./directions";

interface CategoriesProps {}

export const Categories: React.FC<CategoriesProps> = () => {
  const { settings } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const { navigate, currentStep } = useNavigationContext();
  const theme = useContext(ThemeContext);

  const activeChildId = cardCategory.match(currentStep)
    ? currentStep.params
    : null;

  const handleClickAddCategory: MouseEventHandler = (e) => {
    e.preventDefault();
    const id = nanoid();
    dispatch(store.creators.addCardCategory({ id }));
    navigate("here", cardCategory(id));
  };

  const { hoverBg, selectedBg, selectedHoverBg } = useMemo(() => {
    return {
      hoverBg: theme.colors.bgOpaquePrimary,
      selectedBg: irid(theme.colors.glow)
        .blend(theme.colors.bgOpaquePrimary, 0.8)
        .toString(),
      selectedHoverBg: irid(theme.colors.glow)
        .blend(theme.colors.bgOpaquePrimary, 0.9)
        .toString(),
    };
  }, [theme]);

  return (
    <div
      css={{
        ...absoluteCover,
        display: "flex",
        flexDirection: "column",
        // overflow: "auto",
        backgroundColor: theme.colors.backgroundPrimary,
        border: `1px solid ${theme.colors.controlBorder}`,
        padding: "0.5em",
        marginTop: "0.5em",
      }}
    >
      <h2>
        <Translate>Card categories</Translate>
      </h2>

      <p>
        <button css={{ width: "auto" }} onClick={handleClickAddCategory}>
          Add category
        </button>
      </p>
      {settings.cardCategories.length === 0 && (
        <p>No card categories have been added yet.</p>
      )}

      <div
        css={{
          flex: 1,
          overflow: "auto",
          display: "grid",
          gridTemplateColumns: "fit-content(50%) 1fr",
          columnGap: "0.5em",
          gridAutoRows: "2em",
        }}
      >
        {settings.cardCategories.map((category) => (
          <Link
            key={category.id}
            to={cardCategory(category.id)}
            css={{
              gridColumn: "1/-1",
              display: "grid",
              gridTemplateColumns: "subgrid",
              borderBottom: `1px solid ${theme.colors.controlBorder}`,
              "&:hover": {
                backgroundColor: hoverBg,
              },
              "&:last-child": {
                borderBottom: "none",
              },
              ...(activeChildId === category.id
                ? {
                    backgroundColor: selectedBg,
                    "&:hover": {
                      backgroundColor: selectedHoverBg,
                    },
                  }
                : {}),
            }}
          >
            <div
              css={{
                gridColumn: "1",
                padding: "0.3em",
                textShadow: "none",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {category.name}
            </div>

            <div
              css={{
                gridColumn: "2",
                padding: "0.3em",
                textShadow: "none",
                color: theme.colors.text,
                fontStyle: "italic",
                opacity: 0.7,
              }}
            >
              {category.cssClass}
            </div>
          </Link>
        ))}
      </div>

      <Route direction={cardCategory}>
        <NestedPanel margin="15em">
          <Category />
        </NestedPanel>
      </Route>
    </div>
  );
};

Categories.displayName = "Categories";
