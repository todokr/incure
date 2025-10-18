import { db } from "@/lib/db.server";
import type { Incident } from "./incident.type";

export async function list(): Promise<Incident[]> {
	const rows = await db
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
		.execute();

	return rows.map((row) => ({
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
	}));
}
