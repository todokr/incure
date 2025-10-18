import { Client, type ClientConfig } from "pg";

const config = {
	host: process.env.DB_HOST || "localhost",
	port: parseInt(process.env.DB_PORT || "5432"),
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	connectionTimeoutMillis: 2000,
};

export type DBEventHandler = (payload: unknown) => void;
class DBListener {
	private client: Client;
	private handlers: Map<string, DBEventHandler>;
	constructor(config: ClientConfig) {
		this.client = new Client(config);
		this.handlers = new Map();
	}

	async connect() {
		await this.client.connect();

		this.client.on("notification", (msg) => {
			const handler = this.handlers.get(msg.channel);
			if (!handler) {
				console.error(
					`message handler not found for channel: ${msg.channel}, payload: ${msg.payload}`,
				);
				return;
			}
			const payload = msg.payload ? JSON.parse(msg.payload) : {};
			handler(payload);
		});

		// 接続エラー時の再接続処理
		this.client.on("error", async (err) => {
			console.error("error on DB event listening D:", err);
			await this.reconnect();
		});
	}

	async listen(channel: string, handler: DBEventHandler) {
		await this.client.query(`LISTEN ${channel}`);
		this.handlers.set(channel, handler);
		console.log(`${channel}チャンネルをLISTEN開始`);
	}

	async unlisten(channel: string) {
		await this.client.query(`UNLISTEN ${channel}`);
		this.handlers.delete(channel);
	}

	async reconnect() {
		try {
			await this.client.end();
			this.client = new Client(config);
			await this.connect();

			// 再接続後、全チャンネルを再登録
			for (const channel of this.handlers.keys()) {
				await this.client.query(`LISTEN ${channel}`);
			}
		} catch (err) {
			console.error("再接続失敗:", err);
			setTimeout(() => this.reconnect(), 5000);
		}
	}
}
const dbListener = new DBListener(config);

export { dbListener };
