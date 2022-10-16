import React, { useContext } from "react";
import { getTranslated } from "../../../functions";
import { InvestigatorActor } from "../../../module/InvestigatorActor";
import { settings } from "../../../settings";
import { isEquipmentDataSource } from "../../../typeAssertions";
import { FoundryAppContext } from "../../FoundryAppContext";
import { EquipmentCategory } from "./EquipmentCategory";

type EquipmentAreaProps = {
  actor: InvestigatorActor,
};

export const EquipmentArea: React.FC<EquipmentAreaProps> = ({
  actor,
}) => {
  const app = useContext(FoundryAppContext);

  const items = actor.getEquipment();
  const categories = settings.equipmentCategories.get();

  const uncategorizedItems = items.filter((item) => isEquipmentDataSource(item.data) && Object.keys(categories).indexOf(item.data.data.category) === -1);

  return (
    <div>
      {Object.entries(categories).map<JSX.Element>(([categoryId, category]) => {
        return (
          <EquipmentCategory
            actor={actor}
            categoryId={categoryId}
            items={items.filter((item) => isEquipmentDataSource(item.data) && item.data.data.category === categoryId)}
            name={category.name}
            key={categoryId}
            app={app}
            fields={category.fields}
          />
        );
      })}
      <EquipmentCategory
        actor={actor}
        categoryId={""}
        items={uncategorizedItems}
        name={getTranslated("Uncategorized equipment")}
        app={app}
        fields={{}}
      />

      {/* <div
        css={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <h2
          css={{
            flex: 1,
            "&&": {
              margin: "0 0 0 0",
            },
          }}
        >
          <Translate>Equipment</Translate>
        </h2>
        <button
          css={{
            flexBasis: "max-content",
            alignSelf: "flex-start",
          }}
          onClick={async () => {
            await actor.createEmbeddedDocuments("Item", [{
              type: equipment,
              name: "New item",
            }], {
              renderSheet: true,
            });
          }}
        >
          <i className="fa fa-plus"/><Translate>Add Equipment</Translate>
        </button>
      </div>
      {items.length === 0 &&
        <i
          css={{
            display: "block",
            fontSize: "1.2em",
          }}
        >
          <Translate>No equipment yet.</Translate>
        </i>
      }

      <div
        css={{
          columns: "auto 12em",
        }}
      >
        {
          sortEntitiesByName(items).map<JSX.Element>((item) => (
            <a
              key={item.id}
              css={{
                display: "block",
                position: "relative",
              }}
              onClick={() => item.sheet?.render(true)}
              data-item-id={item.id}
              onDragStart={onDragStart}
              draggable="true"
            >
              {item.name}
            </a>
          ))
        }
      </div> */}
    </div>
  );
};
