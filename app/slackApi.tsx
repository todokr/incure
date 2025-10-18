import { SlackApp } from "slack-edge";
import type { Route } from "./+types/slackApi";

export async function action({ request }: Route.ActionArgs) {
	const app = new SlackApp({
		env: {
			SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
			SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET!,
		},
	});
	app.message("hello", async ({ context: { say, userId } }) => {
		// do anything async here
		await say({
			blocks: [
				{
					type: "section",
					text: {
						type: "mrkdwn",
						text: `Hey there <@${userId}>!`,
					},
					accessory: {
						type: "button",
						text: {
							type: "plain_text",
							text: "Click Me",
						},
						action_id: "button_click",
					},
				},
			],
			text: `Hey there <@${userId}>!`,
		});
	});
	app.action(
		"button_click", // action_id
		async (x) => {
			// ack the request within 3 seconds
			console.log("Button on a modal clicked!");
		},
		async ({ payload, context }) => {
			const channelId = context.channelId;

			if (!channelId) {
				console.error("Channel ID not found");
				return;
			}

			try {
				// メッセージを投稿
				await context.client.chat.postMessage({
					channel: channelId,
					text: "ボタンがクリックされました！",
					blocks: [
						{
							type: "section",
							text: {
								type: "mrkdwn",
								text: `<@${payload.user.id}> がボタンをクリックしました`,
							},
						},
					],
				});
			} catch (error) {
				console.error("メッセージ送信エラー:", error);
			}
		},
	);

	return await app.run(request);
}
