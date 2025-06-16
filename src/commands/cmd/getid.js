import { RANK } from "../../util/util.js"
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: "getid",
		minRank: RANK.MODERATOR,
		usage: 'getid <nickname>',
		description: 'Gets all user IDs that use a given nickname.',
		hidden: false,
	}, async execute(client, args) {
		if (!args) {
			client.sendMessage({
				sender: 'server',
				type: 'error',
				data: {
					message: 'Gets the id by nick. Make sure to include everything before the : in chat.'
				}
			});
			return client.sendMessage({
				sender: 'server',
				type: 'error',
				data: {
					message: usageString(this)
				}
			});
		}
		let results = [];
		for(let c of client.world.clients.values()){
			if(c.nick === args.join(' ')) results.push(c.uid);
		}
		if(results.length === 0) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: 'No users found with that nickname.'
			}
		});
		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				message: `ID's with the nick ${args.join(' ')}: ${results.join(", ")}`
			}
		});
	}
}