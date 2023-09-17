import { z } from "zod";

export const personalDetailsValidator = z.array(
  z.object({
    name: z.string(),
    type: z.enum(["text", "item"]),
  }),
);

export type PersonalDetails = z.infer<typeof personalDetailsValidator>;
