import { Link, Route, useNavigationContext } from "@lumphammer/minirouter";
import { nanoid } from "nanoid";
import React, { MouseEventHandler, useContext } from "react";
import { FaArrowRight } from "react-icons/fa";

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
  const { navigate } = useNavigationContext();
  const theme = useContext(ThemeContext);

  const handleClickAddCategory: MouseEventHandler = (e) => {
    e.preventDefault();
    const id = nanoid();
    dispatch(store.creators.addCardCategory({ id }));
    navigate("here", cardCategory(id));
  };

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
          gridTemplateColumns: "auto 1fr",
          columnGap: "0.5em",
          gridAutoRows: "2em",
        }}
      >
        {settings.cardCategories.map((category) => (
          <div
            key={category.id}
            css={{
              gridColumn: "1/-1",
              display: "grid",
              gridTemplateColumns: "subgrid",
            }}
          >
            <Link to={cardCategory(category.id)} css={{}}>
              {category.name} <FaArrowRight css={{ verticalAlign: "middle" }} />
            </Link>
            asdasdads
          </div>
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
