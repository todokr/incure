import { eventPublisher, eventSubscriber } from "@/lib/event.server";

async function setupConsumer() {
	try {
		await eventSubscriber.connect();
		await eventSubscriber.subscribe("empty_event", (e) => {
			console.log("empty_event emitted\n", e);
		});

		// 起動時の動作確認用
		await eventPublisher.publish({
			eventType: "empty_event",
			eventBody: { now: new Date() },
		});

		console.log("Event consumer setup completed");
	} catch (error) {
		console.error("Failed to setup event consumer:", error);
		throw error; // 起動時なので失敗したら停止させる
	}
}

export { setupConsumer };
