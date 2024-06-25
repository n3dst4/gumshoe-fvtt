import React, { useContext } from "react";

import { InputGrid } from "../../inputs/InputGrid";
import { StateContext } from "../contexts";
import { Category } from "./Category";

interface CategoriesProps {}

export const Categories: React.FC<CategoriesProps> = () => {
  const { settings } = useContext(StateContext);

  return (
    <InputGrid
      css={{
        flex: 1,
      }}
    >
      {settings.cardCategories.map((category) => (
        <Category key={category.id} category={category} />
      ))}
    </InputGrid>
  );
};

Categories.displayName = "Categories";
