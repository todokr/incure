import type { EventType } from "@/model/event.model";
import type { ActionPlan } from "../action";
import type { ConditionGroup } from "../condition";

/** stored policy structure */
export type StoredPolicy = {
	id: string;
	name: string;
	triggerType: EventType; // e.g. "incident:declared"
	conditions: ConditionGroup;
	actionPlans: ActionPlan[];
	enabled: boolean;
	createdAt: Date;
	updatedAt: Date;
};
