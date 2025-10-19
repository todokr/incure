import * as z from "zod";

/** when the incident is first declared */
const incidentDeclaredSchema = z.object({
	type: z.literal("incident:declared"),
	tenantId: z.string(),
	epochMills: z.number(),
	body: z.object({
		incident: z.object({
			id: z.string(),
		}),
	}),
});

/** when the incident is updated */
const incidentUpdatedSchema = z.object({
	type: z.literal("incident:updated"),
	tenantId: z.string(),
	epochMills: z.number(),
	body: z.object({
		incident: z.object({
			id: z.string(),
		}),
	}),
});

/** an empty probe event to maintenance */
const probeEmptySchema = z.object({
	type: z.literal("probe:empty"),
	epochMills: z.number(),
	body: z.object({}),
});

const eventSchema = z.discriminatedUnion("type", [
	incidentDeclaredSchema,
	incidentUpdatedSchema,
	probeEmptySchema,
]);

type Event = z.infer<typeof eventSchema>;

export { eventSchema, type Event };
