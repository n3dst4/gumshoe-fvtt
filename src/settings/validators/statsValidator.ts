import { z } from "zod";

export const statsValidator = z.record(
  z.object({ name: z.string(), default: z.number() }),
);

export type Stats = z.infer<typeof statsValidator>;
