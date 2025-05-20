import { RANK } from "../../util/util.js"
import { usageString } from "../commandHandler.js"

export default {
	data: {
		name: "tell",
		minRank: RANK.NONE,
		usage: 'tell <id> <message>',
		hidden: false,
		description: 'Tells another user a message privately.',
		aliases: ["t","msg","whisper","w"],
	}, async execute(client, args){
		if(args.length < 2) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: usageString(this)
			}
		});
		let target = client.world.clients.get(parseInt[args[0]]);
		if(!target) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: '[Server]: User does not exist.'
			}
		});
		let message = args.slice(1).join(" ");
		target.sendMessage({
			sender: 'player',
			type: 'whisperReceived',
			data: {
				message,
				senderID: client.uid
			}
		});
		client.sendMessage({
			sender: 'server',
			type: 'whisperSent',
			data: {
				message,
				targetID: target.uid
			}
		});
	}
}