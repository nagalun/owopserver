import { RANK } from "../../util/util.js"
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: "setrank",
		minRank: RANK.MODERATOR,
		usage: 'setrank <id> <rank [0: NONE, 1: USER, 2: MODERATOR, 3: ADMIN]>',
		hidden: false,
		aliases: ["sr"],
	}, async execute(client, args){
		if(client.rank < RANK.ADMIN && client.world.simpleMods.value) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: 'No setrank for you.'
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
		let rank = parseInt(args[1]);
		if(!(rank >= 0 && rank <= 3)) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: usageString(this)
			}
		});
		if(client.rank < RANK.ADMIN){
			if(target.rank >= client.rank) return client.sendMessage({
				sender: 'server',
				type: 'error',
				data: {
					message: 'Error: Target\'s rank must be less than yours.'
				}
			});
			if(rank >= client.rank) return client.sendMessage({
				sender: 'server',
				type: 'error',
				data: {
					message: `Error: Rank set must be less than your current rank. (${rank} >= ${client.rank})`
				}
			});
		}
		if(target.rank === rank) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: `Error: Client's rank is already ${rank}.`
			}
		});
		target.setRank(rank);
		if(rank === RANK.ADMIN) client.server.adminMessage(`DEV${target.uid} (${target.world.name}, ${target.ip.ip}) Got admin from setrank`);
		else if(rank === RANK.MODERATOR) client.server.adminMessage(`DEV${target.uid} (${target.world.name}, ${target.ip.ip}) Got mod from setrank`);
		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				message: `Set user's (${target.uid}) rank to: ${rank}`
			}
		});
	}
}