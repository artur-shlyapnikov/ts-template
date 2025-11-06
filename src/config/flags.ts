import { z } from "zod";

const FlagSchema = z.object({
  FEATURE_EXAMPLE: z.coerce.boolean().default(false),
});

export type Flags = {
  readonly exampleFeature: boolean;
};

export const loadFlags = (): Flags => {
  const parsed = FlagSchema.parse(process.env);

  return {
    exampleFeature: parsed.FEATURE_EXAMPLE,
  };
};
