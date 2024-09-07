import React from "react";

import { CardItem } from "../../v10Types";

interface EditCategoryMembershipsProps {
  card: CardItem;
}

export const EditCategoryMemberships: React.FC<
  EditCategoryMembershipsProps
> = ({ card }) => {
  return <div>memberships</div>;
};

EditCategoryMemberships.displayName = "EditCategoryMemberships";
