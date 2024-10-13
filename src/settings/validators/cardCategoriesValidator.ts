import { z } from "zod";

const cardCategoryValidator = z.object({
  id: z.string(),
  singleName: z.string(),
  pluralName: z.string(),
  styleKey: z.string().optional(),
  threshold: z.number(),
  thresholdType: z.enum(["goal", "limit", "none"]),
});

export const cardCategoriesValidator = z
  .array(cardCategoryValidator)
  .optional();

export type ValidatorCardCategories = z.infer<typeof cardCategoriesValidator>;
