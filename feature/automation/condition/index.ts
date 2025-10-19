import * as z from "zod";

/** basic condition operators */
export type ConditionOperator =
	| "equals"
	| "notEquals"
	| "anyOf"
	| "noneOf"
	| "greaterThan"
	| "lessThan"
	| "contains"
	| "startsWith"
	| "endsWith";

/** specific condition rule */
export type ConditionRule = {
	type: ConditionOperator;
	path: string; // JSON Path like "body.incident.severity"
	value?: unknown; // equals, notEquals, ...
	values?: unknown[]; // anyOf, noneOf, ..
};

/** condition group that can combine multiple rules with AND/OR */
export type ConditionGroup = {
	type: "and" | "or";
	rules: (ConditionRule | ConditionGroup)[];
};

export function getValueByPath<T>(
	obj: unknown,
	path: string,
	schema: z.ZodType<T>,
): T | undefined {
	if (typeof obj !== "object" || obj === null) {
		return undefined;
	}

	const keys = path.split(".");
	let current: any = obj;
	for (const key of keys) {
		if (current && typeof current === "object" && key in current) {
			current = current[key];
		} else {
			return undefined;
		}
	}

	const result = schema.safeParse(current);
	if (!result.success) {
		console.error(
			`the value at path "${path}" is invalid:`,
			current,
			result.error,
		);
		return undefined;
	}
	return result.data;
}
