import React from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { assertPersonalDetailDataSource } from "../../typeAssertions";
import { Slug } from "./Slug";

interface PersonalDetailSlugProps {
  item: InvestigatorItem;
}

export const PersonalDetailSlug: React.FC<PersonalDetailSlugProps> = ({
  item,
}) => {
  assertPersonalDetailItem(item);

  return (
    <Slug
      item={item}
      key={item.id}
      onClick={() => {
        item.sheet?.render(true);
      }}
    >
      {item.data.name}
    </Slug>
  );
};

PersonalDetailSlug.displayName = "PersonalDetailSlug";
