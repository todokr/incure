import { SlackApp } from "slack-edge";
import type { Route } from "./+types/slackApi";

export async function action({ request }: Route.ActionArgs) {
	const app = new SlackApp({
		env: {
			SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
			SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET!,
		},
	});
	// Add listeners here

	return await app.run(request);
}
