import { getTranslated } from "../../functions/getTranslated";
import { getById } from "../../functions/utilities";
import { settings } from "../../settings/settings";
import { CardCategoryMembership } from "../../types";

export function summarizeCategoryMemberships(
  memberships: CardCategoryMembership[],
) {
  if (memberships.length === 0) {
    return getTranslated("Uncategorized");
  }
  const allCategories = settings.cardCategories.get();
  const text = memberships
    .map((m) => {
      const name = getById(allCategories, m.categoryId)?.singleName;
      if (!name) {
        return "";
      }
      const nonlethal = m.nonlethal ? getTranslated("Nonlethal") : "";
      const worth = m.worth !== 1 ? `${m.worth}` : "";
      const annotation =
        worth && nonlethal
          ? ` (${worth} ${nonlethal})`
          : worth
            ? ` (${worth})`
            : nonlethal
              ? ` (${nonlethal})`
              : "";
      return `${name}${annotation}`;
    })
    .filter((c) => !!c)
    .join(", ");
  return text;
}
