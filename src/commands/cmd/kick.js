import { RANK } from "../../util/util.js";
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: "kick",
		minRank: RANK.MODERATOR,
		usage: 'kick <id>',
		description: 'Kicks a user from the world.',
		hidden: false,
		aliases: ["k"],
	}, async execute(client, args){
		if(client.rank < RANK.ADMIN && client.world.simpleMods.value) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: 'No kick for you.'
			}
		});
		if(args.length < 1) return client.sendMessage({
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
		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				message: `Kicked user ${target.uid}`
			}
		});
		target.teleport(0, 0); // idk why u do this but sure
		target.destroy();
	}
}