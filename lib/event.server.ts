import type { Assignment, Incident } from "@/feature/incident/incident.type";
import { Client, type ClientConfig } from "pg";

const channel = "event_channel";
const config = {
	host: process.env.DB_HOST || "localhost",
	port: parseInt(process.env.DB_PORT || "5432"),
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	connectionTimeoutMillis: 2000,
};

type Event = IncidentCreated | IncidentUpdated | RoleAssigned | EmptyEvent;

const isEvent = (e: unknown): e is Event => {
	return (
		typeof e === "object" &&
		e !== null &&
		"eventType" in e &&
		typeof (e as any).eventType === "string" &&
		"eventBody" in e &&
		typeof (e as any).eventBody === "object" &&
		(e as any).eventBody !== null
	);
};

type IncidentCreated = {
	eventType: "incident_created";
	eventBody: {
		incident: Incident;
	};
};
type IncidentUpdated = {
	eventType: "incident_updated";
	eventBody: {
		incident: Incident;
	};
};
type RoleAssigned = {
	eventType: "role_assigned";
	eventBody: {
		assignment: Assignment;
	};
};
type EmptyEvent = {
	eventType: "empty_event";
	eventBody: {
		now: Date;
	};
};

class EventPublisher {
	private client: Client;
	constructor(config: ClientConfig) {
		this.client = new Client(config);
		this.client.connect().catch((err) => {
			console.error("DB接続エラー:", err);
		});
	}

	async publish(event: Event) {
		await this.client.query(`SELECT pg_notify($1, $2)`, [
			channel,
			JSON.stringify(event),
		]);
	}
}
const eventPublisher = new EventPublisher(config);

class EventSubscriber {
	private client: Client;
	private handlers: Map<Event["eventType"], (event: Event) => void>;
	private isConnected = false;

	constructor(config: ClientConfig) {
		this.client = new Client(config);
		this.handlers = new Map();
	}

	async connect() {
		if (this.isConnected) {
			return;
		}
		
		await this.client.connect();
		await this.client.query(`LISTEN ${channel}`);
		this.isConnected = true;

		this.client.on("notification", (msg) => {
			const event = msg.payload ? JSON.parse(msg.payload) : {};
			if (!isEvent(event)) {
				console.error("malformed event payload:", msg.payload);
				return;
			}
			const handler = this.handlers.get(event.eventType);
			if (!handler) {
				console.error(`no handler for ${event.eventType}`);
				return;
			}
			handler(event);
		});

		// 接続エラー時の再接続処理
		this.client.on("error", async (err) => {
			console.error("error on DB event listening D:", err);
			this.isConnected = false;
			await this.reconnect();
		});
	}

	async subscribe(eventType: Event["eventType"], handler: (e: Event) => void) {
		this.handlers.set(eventType, handler);
		console.log(`subscribed to ${eventType}`);
	}

	async reconnect() {
		try {
			await this.client.end();
			this.client = new Client(config);
			this.isConnected = false;
			await this.connect();
		} catch (err) {
			console.error("再接続失敗:", err);
			setTimeout(() => this.reconnect(), 5000);
		}
	}
}

// HMR対応: グローバルに保存
declare global {
	var __eventSubscriber: EventSubscriber | undefined;
}

const eventSubscriber = globalThis.__eventSubscriber ?? new EventSubscriber(config);
if (!globalThis.__eventSubscriber) {
	globalThis.__eventSubscriber = eventSubscriber;
}

export { eventSubscriber, eventPublisher };
