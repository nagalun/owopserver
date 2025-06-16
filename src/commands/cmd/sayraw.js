import { RANK } from "../../util/util.js";
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: 'sayraw',
		description: 'send a message as raw text.',
		usage: 'sayraw <message>',
		aliases: ["sr"],
		minRank: RANK.ADMIN,
	}, async execute(client, args){
		if(!args.length) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data:{
				message: usageString(this)
			}
		});
		client.world.broadcastJSON({
			sender: 'server',
			type: 'raw',
			data:{
				message: args.slice(1).join(" ")
			}
		});
	}
}