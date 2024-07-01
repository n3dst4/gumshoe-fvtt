import { useParams } from "@lumphammer/minirouter";
import React, { useContext } from "react";

import { GridField } from "../../inputs/GridField";
import { StateContext } from "../contexts";
import { cardCategory } from "./directions";

export const Category: React.FC = () => {
  const id = useParams(cardCategory);
  const { settings } = useContext(StateContext);
  const category = settings.cardCategories.find((c) => c.id === id);
  return (
    <>
      <h3>{category?.name}</h3>
    </>
  );
};

Category.displayName = "Category";
