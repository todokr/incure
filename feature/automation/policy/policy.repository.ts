import type { EventType } from "@/model/event.model";
import type { StoredPolicy } from "./policy";

export function list({
	tenantId,
	eventType,
}: {
	tenantId: string;
	eventType: EventType;
}): Promise<StoredPolicy[]> {
	return Promise.resolve([]);
}
