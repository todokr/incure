import type { EventType } from "@/model/event.model";
import type { StoredPolicy } from "./storedPolicy";
import type { Incident } from "@/model/incident.model";
import { db } from "@/lib/db.server";

export function listStoredPolicies({
	tenantId,
	eventType,
}: {
	tenantId: string;
	eventType: EventType;
}): Promise<StoredPolicy[]> {
	return Promise.resolve([]);
}

export async function resolveIncidentResource(
	incidentId: string,
): Promise<Incident | undefined> {
	const row = await db
		.selectFrom("incidents as i")
		.innerJoin("incidentStatuses as status", "latestStatusId", "status.id")
		.select([
			"i.id",
			"i.code",
			"i.title",
			"i.summary",
			"i.declaredAt",
			"i.tenantId",
			"status.id as statusId",
			"status.statusType",
			"status.color as statusColor",
		])
		.where("i.id", "=", incidentId)
		.executeTakeFirst();
	if (!row) {
		return;
	}

	return {
		id: row.id,
		code: row.code,
		title: row.title,
		summary: row.summary,
		declaredAt: row.declaredAt,
		tenantId: row.tenantId,
		latestStatus: {
			id: row.statusId,
			statusType: row.statusType,
			color: row.statusColor,
		},
	};
}
