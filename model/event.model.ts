import * as z from "zod";

export const eventType = {
	incidentDeclared: "incident:declared",
	incidentUpdated: "incident:updated",
	probeEmpty: "probe:empty",
} as const;

export type EventType = (typeof eventType)[keyof typeof eventType];

/** when the incident is first declared */
const incidentDeclaredSchema = z.object({
	type: z.literal(eventType.incidentDeclared),
	tenantId: z.string(),
	epochMills: z.number(),
	body: z.object({
		incident: z.object({
			id: z.string(),
		}),
	}),
});
type IncidentDeclaredEvent = z.infer<typeof incidentDeclaredSchema>;

/** when the incident is updated */
const incidentUpdatedSchema = z.object({
	type: z.literal(eventType.incidentUpdated),
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
	type: z.literal(eventType.probeEmpty),
	tenantId: z.string(),
	epochMills: z.number(),
	body: z.object({}),
});

const eventSchema = z.discriminatedUnion("type", [
	incidentDeclaredSchema,
	incidentUpdatedSchema,
	probeEmptySchema,
]);

type Event = z.infer<typeof eventSchema>;

export { eventSchema, type Event, type IncidentDeclaredEvent };
