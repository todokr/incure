import * as repo from "./incident.repository";
import type { Incident } from "@/model/incident.model";

export function listIncidents(): Promise<Incident[]> {
	return repo.list();
}
