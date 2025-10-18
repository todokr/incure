import * as repo from "./incident.repository";
import type { Incident } from "./incident.type";

export function listIncidents(): Promise<Incident[]> {
	return repo.list();
}
