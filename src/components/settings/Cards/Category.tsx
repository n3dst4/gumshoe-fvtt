import { Link, useParams } from "@lumphammer/minirouter";
import React, { useContext } from "react";
import { FaArrowRight } from "react-icons/fa6";

import { ThemeContext } from "../../../themes/ThemeContext";
import { AsyncNumberInput } from "../../inputs/AsyncNumberInput";
import { AsyncTextInput } from "../../inputs/AsyncTextInput";
import { GridField } from "../../inputs/GridField";
import { InputGrid } from "../../inputs/InputGrid";
import { ArrowLink } from "../../nestedPanels/ArrowLink";
import { SlideInNestedPanelRoute } from "../../nestedPanels/SlideInNestedPanelRoute";
import { Translate } from "../../Translate";
import { ModifyContext } from "../contexts";
import { useStateSelector } from "../hooks";
import { CategoryDangerZone } from "./CategoryDangerZone";
import { cardCategory, categoryDangerZone } from "./directions";

export const Category: React.FC = () => {
  const id = useParams(cardCategory);
  const { value: category } = useStateSelector((s) =>
    s.settings.cardCategories.find((c) => c.id === id),
  );
  const modify = useContext(ModifyContext);
  const theme = useContext(ThemeContext);

  const handleSingleNameChange = (newName: string) => {
    modify((s) => {
      const category = s.cardCategories.find((c) => c.id === id);
      if (category) {
        category.singleName = newName;
      }
    });
  };

  const handlePluralNameChange = (newName: string) => {
    modify((s) => {
      const category = s.cardCategories.find((c) => c.id === id);
      if (category) {
        category.pluralName = newName;
      }
    });
  };

  const handleStyleKeyChange = (newStyleKey: string) => {
    modify((s) => {
      const category = s.cardCategories.find((c) => c.id === id);
      if (category) {
        category.styleKey = newStyleKey;
      }
    });
  };

  const handleSoftLimitChange = (newSoftLimit: number) => {
    modify((s) => {
      const category = s.cardCategories.find((c) => c.id === id);
      if (category) {
        category.threshold = newSoftLimit;
      }
    });
  };

  const handleGoalOrLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGoalOrLimit = e.currentTarget.value as "goal" | "limit";
    modify((s) => {
      const category = s.cardCategories.find((c) => c.id === id);
      if (category) {
        category.thresholdType = newGoalOrLimit;
      }
    });
  };

  const shade1 = "#f002";
  const shade2 = "#f001";

  // const goalEnabled = category?.goalEnabled ?? false;

  const limitType = category?.thresholdType ?? "none";

  return (
    <>
      <h2>Card category</h2>
      <InputGrid>
        <GridField label="ItemNameSingle">
          <AsyncTextInput
            value={category?.singleName}
            onChange={handleSingleNameChange}
          />
        </GridField>
        <GridField label="ItemNamePlural">
          <AsyncTextInput
            value={category?.pluralName}
            onChange={handlePluralNameChange}
          />
        </GridField>
        <GridField label="StyleKey">
          <AsyncTextInput
            value={category?.styleKey ?? ""}
            onChange={handleStyleKeyChange}
          />
        </GridField>
        <GridField label="GoalOrLimit">
          <select
            value={category?.thresholdType ?? "none"}
            onChange={handleGoalOrLimitChange}
          >
            <option value="none">
              <Translate>None</Translate>
            </option>
            <option value="goal">
              <Translate>Goal</Translate>
            </option>
            <option value="limit">
              <Translate>Limit</Translate>
            </option>
          </select>
        </GridField>

        {limitType !== "none" && (
          <GridField label={limitType === "goal" ? "Goal" : "Limit"}>
            <AsyncNumberInput
              value={category?.threshold ?? 3}
              onChange={handleSoftLimitChange}
            />
          </GridField>
        )}
      </InputGrid>
      <p css={{ textAlign: "right" }}>
        <ArrowLink danger to={categoryDangerZone()}>
          Danger Zone
        </ArrowLink>
      </p>
      <SlideInNestedPanelRoute
        direction={categoryDangerZone}
        css={{
          background: `
          repeating-linear-gradient(135deg, ${shade1}, ${shade1} 30px, ${shade2} 10px, ${shade2} 60px),
          linear-gradient(135deg, ${theme.colors.bgOpaquePrimary}, ${theme.colors.bgOpaquePrimary} )
          `,
        }}
      >
        <CategoryDangerZone id={id} />
      </SlideInNestedPanelRoute>
    </>
  );
};

Category.displayName = "Category";
