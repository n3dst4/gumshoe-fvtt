import { getTranslated } from "../../../functions/getTranslated";
import { useActorSheetContext } from "../../../hooks/useSheetContexts";
import { settings } from "../../../settings/settings";
import { isEquipmentItem } from "../../../v10Types";
import { EquipmentCategory } from "./EquipmentCategory";

export const EquipmentArea = () => {
  const { actor } = useActorSheetContext();
  const items = actor.getEquipment();
  const categories = settings.equipmentCategories.get();

  const uncategorizedItems = items.filter(
    (item) =>
      isEquipmentItem(item) &&
      Object.keys(categories).indexOf(item.system.category) === -1,
  );

  return (
    <div>
      {Object.entries(categories).map<JSX.Element>(([categoryId, category]) => {
        return (
          <EquipmentCategory
            actor={actor}
            categoryId={categoryId}
            items={items.filter(
              (item) =>
                isEquipmentItem(item) && item.system.category === categoryId,
            )}
            name={category.name}
            key={categoryId}
            fields={category.fields}
          />
        );
      })}
      {uncategorizedItems.length > 0 && (
        <EquipmentCategory
          actor={actor}
          categoryId={""}
          items={uncategorizedItems}
          name={getTranslated("Uncategorized")}
          fields={{}}
        />
      )}
    </div>
  );
};
