import React, { ChangeEvent, useCallback } from "react";

import { getTranslated } from "../../functions/getTranslated";
import { getById } from "../../functions/utilities";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { settings } from "../../settings/settings";
import { assertCardItem } from "../../v10Types";
import { absoluteCover } from "../absoluteCover";
import { AsyncTextInput } from "../inputs/AsyncTextInput";
import { Checkbox } from "../inputs/Checkbox";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { NotesEditorWithControls } from "../inputs/NotesEditorWithControls";
import { ArrowLink } from "../nestedPanels/ArrowLink";
import { SlideInNestedPanelRoute } from "../nestedPanels/SlideInNestedPanelRoute";
import { TabContainer } from "../TabContainer";
import { Translate } from "../Translate";
import { editCategoryMemberships } from "./directions";
import { EditCategoryMemberships } from "./EditCategoryMemberships";

interface CardMainProps {
  card: InvestigatorItem;
}

export const CardMain: React.FC<CardMainProps> = ({ card }) => {
  assertCardItem(card);

  const categories = settings.cardCategories.get();

  return (
    <>
      <InputGrid>
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

        <GridField label="Categories">
          <ArrowLink to={editCategoryMemberships()}>
            <Translate>Edit</Translate>
          </ArrowLink>
        </GridField>
        <GridField label="Continuity">
          <Checkbox
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
                    css={{
                      "&&": {
                        resize: "none",
                      },
                    }}
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
