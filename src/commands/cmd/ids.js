import { RANK } from "../../util/util.js"

export default {
	data: {
		name: "ids",
		minRank: RANK.ADMIN,
		description: 'List of all IDs present in the world.',
		usage: 'ids',
		hidden: false,
	},
	async execute(client, args) {
		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				message: `Total: ${client.world.clients.size}; ${Array.from(client.world.clients.keys()).join(", ")}`
			}
		});
	}
}