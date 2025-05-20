import { RANK } from "../../util/util.js";
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: 'tellraw',
		description: 'sends a message as raw text to another user.',
		usage: 'tellraw <id> <message>',
		aliases: ["tr"],
		minRank: RANK.ADMIN,
	}, async execute(client, args){
		if(args.length < 2) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data:{
				message: usageString(this)
			}
		});
		let id = parseInt(args[0]);
		let target = client.world.clients.get(id);
		if(!target) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data:{
				message: 'No player with that ID.'
			}
		});
		client.sendMessage({
			sender: 'server',
			type: 'info',
			data:{
				message: 'Message sent.'
			}
		});
		target.sendMessage({
			sender: 'server',
			type: 'raw',
			data:{
				message: args.slice(1).join(" ")
			}
		});
	}
}