import { CardCategory } from "@lumphammer/investigator-fvtt-types";
import React from "react";

import { GridField } from "../../inputs/GridField";

interface CategoryProps {
  category: CardCategory;
}

export const Category: React.FC<CategoryProps> = ({ category }) => {
  return <GridField label={category.name}></GridField>;
};

Category.displayName = "Category";
