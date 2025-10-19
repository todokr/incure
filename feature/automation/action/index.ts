const actionType = {
	slackCreateChannel: "slack:create_channel",
	slackPostMessage: "slack:post_message",
	slackInviteUsers: "slack:invite_users",
} as const;

/** ActionPlan is a template for creating an action.
 * It contains placeholders that will be
 * filled in with actual data when the event is processed. */
export type ActionPlan =
	| SlackCreateChannelActionPlan
	| SlackPostMessageActionPlan
	| SlackInviteUsersActionPlan;

/** ExecutableAction is a concrete action.
 * Its execution details are determined based on
 *the content of the emitted event and the policy settings.*/
export type ExecutableAction =
	| SlackCreateChannelAction
	| SlackPostMessageAction
	| SlackInviteUsersAction;

/** Plan: create slack channel */
type SlackCreateChannelActionPlan = {
	type: typeof actionType.slackCreateChannel;
	channelNameTemplate: string;
	isPrivate: boolean;
};

/** Action: create slack channel */
type SlackCreateChannelAction = {
	type: typeof actionType.slackCreateChannel;
	channelName: string;
	slackWorkspaceId: string;
	isPrivate: boolean;
};

/** Plan: post message */
type SlackPostMessageActionPlan = {
	type: typeof actionType.slackPostMessage;
	channel: "headquater" | "warroom";
	contentTemplate: string;
};

/** Action: post message */
type SlackPostMessageAction = {
	type: typeof actionType.slackPostMessage;
	channelId: string;
	content: string;
};

/** Plan: invite users to channel */
type SlackInviteUsersActionPlan = {
	type: typeof actionType.slackInviteUsers;
	recipients: (
		| { type: "group"; groupId: string }
		| { type: "user"; userId: string }
	)[];
};

/** Action: invite users to channel */
type SlackInviteUsersAction = {
	type: typeof actionType.slackInviteUsers;
	channelId: string;
	userIds: string[];
};
