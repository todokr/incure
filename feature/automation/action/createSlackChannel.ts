type CreationInput = {
	incidentName: string;
	declaredAt: Date;
	isChannelPublic: boolean;
};

type ChannelCreateCommand = {
	channelName: string;
	isPublic: boolean;
};

export type CreateSlackChannelAction = {
	type: "create_slack_channel";
	toCommand: (input: CreationInput) => ChannelCreateCommand;
};

export const CreateSlackChannelAction = {
	executor: (command: ChannelCreateCommand) => {
		console.log("executed!", command);
	},
};

const exampleAction: CreateSlackChannelAction = {
	type: "create_slack_channel",
	toCommand: (input: CreationInput) => {
		const channelName = `incident-${input.incidentName}-${Math.floor(input.declaredAt.getTime() / 1000)}`;
		return {
			channelName,
			isPublic: input.isChannelPublic,
		};
	},
};
