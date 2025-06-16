import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'totalonline',
		description: 'gets the total number of connections to the server.',
		usage: 'totalonline',
		aliases: [],
		minRank: RANK.ADMIN,
	}, async execute(client, args){
		client.sendMessage({
			sender: 'server',
			type: 'info',
			data:{
				message: `Total connections to the server: ${client.server.clients.map.size}`
			}
		});
	}
}