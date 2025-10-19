import { type Event } from "@/model/event.model";
import * as repo from "./policy.repository";
import type { StoredPolicy } from "./policy";

/** retrieves applicable policies for the given event */
export async function resolveActions(event: Event): Promise<StoredPolicy[]> {
	const { tenantId, type: eventType } = event;
	return await repo.list({ tenantId, eventType });
}
