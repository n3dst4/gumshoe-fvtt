import { Link, Route } from "@lumphammer/minirouter";
import React, { MouseEventHandler, useContext } from "react";
import { FaArrowRight } from "react-icons/fa";

import { DispatchContext, StateContext } from "../contexts";
import { NestedPanel } from "../router/NestedPanel";
import { SlideInNestedPanelRoute } from "../router/SlideInNestedPanelRoute";
import { store } from "../store";
import { Category } from "./Category";
import { cardCategory } from "./directions";

interface CategoriesProps {}

export const Categories: React.FC<CategoriesProps> = () => {
  const { settings } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const handleClickAddCategory: MouseEventHandler = (e) => {
    e.preventDefault();
    dispatch(store.creators.addCardCategory());
  };

  return (
    <>
      <p>
        <button css={{ width: "auto" }} onClick={handleClickAddCategory}>
          Add category
        </button>
      </p>
      {settings.cardCategories.length === 0 && (
        <p>No card categories have been added yet.</p>
      )}
      {settings.cardCategories.map((category) => (
        <p key={category.id}>
          <Link to={cardCategory(category.id)}>
            {category.name} <FaArrowRight css={{ verticalAlign: "middle" }} />
          </Link>
        </p>
      ))}
      <Route direction={cardCategory}>
        <NestedPanel>
          <Category />
        </NestedPanel>
      </Route>
    </>
  );
};

Categories.displayName = "Categories";
