import { EventPublisher, EventSubscriber } from "@/lib/event.server";
import { eventSchema } from "@/model/event.model";
import * as z from "zod";

const config = {
	channel: "events_channel",
	db: {
		host: process.env.DB_HOST || "localhost",
		port: parseInt(process.env.DB_PORT || "5432"),
		database: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		connectionTimeoutMillis: 2000,
	},
};

function handler(event: z.infer<typeof eventSchema>): PromiseLike<void> {
	switch (event.type) {
		case "incident:declared":
			console.log("Handling incident declared event:", event);
			break;
		case "incident:updated":
			console.log("Handling incident updated event:", event);
			break;
		case "probe:empty":
			console.log("Handling probe empty event:", event);
			break;
	}
	return Promise.resolve();
}

async function setupConsumer() {
	try {
		await eventSubscriber.connect(handler);
		console.log("Event consumer setup completed");
	} catch (error) {
		console.error("Failed to setup event consumer:", error);
		throw error; // 起動時なので失敗したら停止させる
	}
}

// HMR対応
declare global {
	var __eventSubscriber: EventSubscriber<typeof eventSchema> | undefined;
	var __eventPublisher: EventPublisher<typeof eventSchema> | undefined;
}
const eventSubscriber =
	globalThis.__eventSubscriber ?? new EventSubscriber(config, eventSchema);
if (!globalThis.__eventSubscriber) {
	globalThis.__eventSubscriber = eventSubscriber;
}

const eventPublisher =
	globalThis.__eventPublisher ?? new EventPublisher(config);
if (!globalThis.__eventPublisher) {
	globalThis.__eventPublisher = eventPublisher;
}

export { setupConsumer };
