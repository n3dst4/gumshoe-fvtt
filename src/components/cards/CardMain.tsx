import { InvestigatorItem } from "../../module/InvestigatorItem";
import { assertCardItem } from "../../v10Types";
import { absoluteCover } from "../absoluteCover";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { NotesEditorWithControls } from "../inputs/NotesEditorWithControls";
import { Toggle } from "../inputs/Toggle";
import { ArrowLink } from "../nestedPanels/ArrowLink";
import { SlideInNestedPanelRoute } from "../nestedPanels/SlideInNestedPanelRoute";
import { TabContainer } from "../TabContainer";
import { editCategoryMemberships } from "./directions";
import { EditCategoryMemberships } from "./EditCategoryMemberships";
import { summarizeCategoryMemberships } from "./functions";

interface CardMainProps {
  card: InvestigatorItem;
}

export const CardMain = ({ card }: CardMainProps) => {
  assertCardItem(card);

  const categoryText = summarizeCategoryMemberships(
    card.system.cardCategoryMemberships,
  );

  return (
    <>
      <InputGrid>
        <GridField label="Categories">
          <ArrowLink to={editCategoryMemberships()}>
            {categoryText}
            {"  "}
          </ArrowLink>
        </GridField>
        <GridField label="Item Name">
          <AsyncTextInput value={card.name ?? ""} onChange={card.setName} />
        </GridField>
        <GridField label="Supertitle">
          <AsyncTextInput
            value={card.system.supertitle}
            onChange={card.setSupertitle}
          />
        </GridField>
        <GridField label="Subtitle">
          <AsyncTextInput
            value={card.system.subtitle}
            onChange={card.setSubtitle}
          />
        </GridField>

        <GridField label="Continuity">
          <Toggle
            checked={card.system.continuity}
            onChange={card.setContinuity}
          />
        </GridField>
      </InputGrid>
      <div
        className="notes-container"
        css={{
          flex: 1,
          position: "relative",
          marginTop: "0.5em",
        }}
      >
        <TabContainer
          defaultTab="description"
          tabs={[
            {
              id: "description",
              label: "Description",
              content: (
                <InputGrid
                  css={{
                    ...absoluteCover,
                    gridTemplateRows: "1fr",
                    margin: "0.5em",
                  }}
                >
                  <NotesEditorWithControls
                    allowChangeFormat
                    format={card.system.description.format}
                    html={card.system.description.html}
                    source={card.system.description.source}
                    onSave={card.setDescription}
                  />
                </InputGrid>
              ),
            },
            {
              id: "effects",
              label: "Effects",
              content: (
                <InputGrid
                  css={{
                    ...absoluteCover,
                    gridTemplateRows: "1fr",
                    margin: "0.5em",
                  }}
                >
                  <NotesEditorWithControls
                    allowChangeFormat
                    format={card.system.effects.format}
                    html={card.system.effects.html}
                    source={card.system.effects.source}
                    onSave={card.setEffects}
                  />
                </InputGrid>
              ),
            },
          ]}
        />
      </div>
      <SlideInNestedPanelRoute direction={editCategoryMemberships}>
        <EditCategoryMemberships card={card} />
      </SlideInNestedPanelRoute>
    </>
  );
};
