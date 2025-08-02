import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'setdmemos',
		description: 'Enables or disables showing the user specified memo when receiving a donation',
		usage: 'setdmemos true/false',
		aliases: [],
		minRank: RANK.ADMIN,
		hidden: false,
	},
	async execute(client, args){
		if(!args.length) {
			client.sendMessage({
				sender: 'server',
				type: 'info',
				data: {
					message: "Enables or disables showing the user specified memo when receiving a donation.\nUsage: /setdmemos true/false"
				}
			});
			return;
		}

		const newState = args[0].toLowerCase() === 'true';
		client.server.setDonMemos(newState);

		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				message: newState ? "Showing donation memos." : "Not showing donation memos."
			}
		});
	}
}
