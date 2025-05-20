import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'worlds',
		description: 'lists all loaded worlds',
		usage: 'worlds',
		aliases: [],
		minRank: RANK.ADMIN,
	}, async execute(client, args){
		client.sendMessage({
			sender: 'server',
			type: 'raw',
			data:{
				message: `Currently loaded worlds:`
			},
		});
		for(let world of client.server.worlds.map.values()){
			client.sendMessage({
				sender: 'server',
				type: 'raw',
				data:{
					classNameOverride: 'whisper',
					message: `-> ${world.name} [${world.clients.size}]`
				}
			})
		}
	}
}