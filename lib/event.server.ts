import { Client, type ClientConfig } from "pg";
import * as z from "zod";

type Config = {
	channel: string;
	db: ClientConfig;
};

class EventPublisher<T extends z.ZodTypeAny> {
	private client: Client;

	constructor(
		private config: Config,
		private eventSchema: T,
	) {
		this.client = new Client(config.db);
		this.client.connect().catch((err) => {
			console.error("DB connection error:", err);
		});
	}

	async publish(event: z.infer<T>) {
		await this.client.query(`SELECT pg_notify($1, $2)`, [
			this.config.channel,
			JSON.stringify(event),
		]);
	}
}

class EventSubscriber<T extends z.ZodTypeAny> {
	private client: Client;
	private isConnected = false;
	private handler?: (event: z.infer<T>) => PromiseLike<void>;

	constructor(
		private config: Config,
		private eventSchema: T,
	) {
		this.client = new Client(config.db);
	}

	async connect(handler: (event: z.infer<T>) => PromiseLike<void>) {
		if (this.isConnected) {
			return;
		}
		this.handler = handler;

		await this.client.connect();
		await this.client.query(`LISTEN ${this.config.channel}`);
		console.log(`LISTEN ${this.config.channel}`);
		this.isConnected = true;

		this.client.on("notification", async (msg) => {
			const event = this.eventSchema.safeParse(JSON.parse(msg.payload || "{}"));
			if (!event.success) {
				console.error("malformed event payload:", msg.payload);
				return;
			}
			await handler(event.data);
		});

		// 接続エラー時の再接続処理
		this.client.on("error", async (err) => {
			console.error("error on DB event listening", err);
			this.isConnected = false;
			await this.reconnect();
		});
	}

	async reconnect() {
		try {
			await this.client.end();
			this.client = new Client(this.config.db);
			this.isConnected = false;
			if (!this.handler) {
				console.error("no handler registered. reconection skipped.");
				return;
			}
			await this.connect(this.handler);
		} catch (err) {
			console.error("failed to reconnect. retrying...", err);
			setTimeout(() => this.reconnect(), 5000);
		}
	}
}

export { EventPublisher, EventSubscriber };
