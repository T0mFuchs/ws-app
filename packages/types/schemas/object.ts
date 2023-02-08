import { z } from "zod";

const baseSchema = z.object({
  _id: z.string().length(24).nullish(),
  name: z.string().nullish(),
  desc: z.string().nullish(),
  parent: z.array(z.string().length(24)).nullish(),
  iat: z.number().nullish(),
  eat: z.number().nullish(),
});

type BaseSchema = z.infer<typeof baseSchema> & {
  children: BaseSchema[] | undefined;
};

const ObjectSchema: z.ZodType<BaseSchema> = baseSchema.extend({
  children: z.lazy(() => ObjectSchema.array()),
});

export type ObjectType = z.infer<typeof ObjectSchema>;
