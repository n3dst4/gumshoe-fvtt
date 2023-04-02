import React, { useContext } from "react";
import { getTranslated } from "../../../functions";
import { InvestigatorActor } from "../../../module/InvestigatorActor";
import { settings } from "../../../settings";
import { isEquipmentDataSource } from "../../../typeAssertions";
import { FoundryAppContext } from "../../FoundryAppContext";
import { EquipmentCategory } from "./EquipmentCategory";

type EquipmentAreaProps = {
  actor: InvestigatorActor;
};

export const EquipmentArea: React.FC<EquipmentAreaProps> = ({ actor }) => {
  const app = useContext(FoundryAppContext);

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
            app={app}
            fields={category.fields}
          />
        );
      })}
      {uncategorizedItems.length > 0 && (
        <EquipmentCategory
          actor={actor}
          categoryId={""}
          items={uncategorizedItems}
          name={getTranslated("Uncategorized equipment")}
          app={app}
          fields={{}}
        />
      )}
    </div>
  );
};
