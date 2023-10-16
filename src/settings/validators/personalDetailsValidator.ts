import { z } from "zod";

export const personalDetailsValidator = z
  .array(
    z.object({
      name: z.string(),
      type: z.enum(["text", "item"]),
    }),
  )
  .optional();

export type ValidatorPersonalDetails = z.infer<typeof personalDetailsValidator>;
