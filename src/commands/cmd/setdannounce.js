import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'setdannounce',
		description: 'Enables or disables showing the announcement when receiving a donation',
		usage: 'setdannounce true/false',
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
					message: "Enables or disables showing the announcement when receiving a donation.\nUsage: /setdannounce true/false"
				}
			});
			return;
		}

		const newState = args[0].toLowerCase() === 'true';
		client.server.setDonAnnounce(newState);

		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				message: newState ? "Showing donation announcements." : "Not showing donation announcements."
			}
		});
	}
}
