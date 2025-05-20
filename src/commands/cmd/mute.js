import { RANK } from "../../util/util.js";
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: "mute",
		minRank: RANK.MODERATOR,
		usage: 'mute <id> <1/0>',
		description: 'Mutes a user.',
		hidden: false,
		aliases: ["m"],
	}, async execute(client, args){
		if(client.rank < RANK.MODERATOR && client.world.simpleMods.value) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: 'No mute for you.'
			}
		});
		if(args.length < 2) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: usageString(this)
			}
		});
		let id = parseInt(args[0]);
		let target = client.world.clients.get(id);
		if(!target) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: `No player with ID ${id}.`
			}
		});
		if(client.rank < RANK.ADMIN && target.rank >= client.rank) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: 'Error: Target\'s rank must be less than yours.'
			}
		});
		let willMute = args[1] === "1";
		target.mute = willMute;
		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				message: `${willMute ? "Muted" : "Unmuted"} ${target.uid}`
			}
		});
	}
}