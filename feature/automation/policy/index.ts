import { type Event, type EventType } from "@/model/event.model";
import type { Incident } from "@/model/incident.model";
import * as repo from "./policy.repository";
import type { StoredPolicy } from "./storedPolicy";

type EventResourceMap = {
	[K in EventType]: K extends "incident:declared" | "incident:updated"
		? Incident | undefined
		: K extends "probe:empty"
			? undefined
			: never;
};

// Event => Resource
type ResourceFromEvent<T extends Event> = T extends { type: infer K }
	? K extends keyof EventResourceMap
		? EventResourceMap[K]
		: never
	: never;

// EventResourceMapから逆引きでEventTypeを取得
type EventTypesReturning<T> = {
	[K in EventType]: EventResourceMap[K] extends T ? K : never;
}[EventType];

type IncidentEventTypes = EventTypesReturning<Incident>;
type EmptyEventTypes = EventTypesReturning<undefined>;

async function resolveResource(
	event: Extract<Event, { type: IncidentEventTypes }>,
): Promise<Incident>;
async function resolveResource(
	event: Extract<Event, { type: EmptyEventTypes }>,
): Promise<undefined>;
async function resolveResource(event: Event): Promise<Incident | undefined> {
	switch (event.type) {
		case "incident:declared":
		case "incident:updated":
			const incidentId = event.metadata.incident.id;
			return await repo.resolveIncidentResource(incidentId);

		case "probe:empty":
			return undefined;

		default:
			throw new Error(`Unsupported event type: ${(event as any).type}`);
	}
}

/** retrieves applicable policies for the given event */
export async function resolveActions(event: Event): Promise<StoredPolicy[]> {
	const { tenantId, type: eventType } = event;
	return await repo.listStoredPolicies({ tenantId, eventType });
}
