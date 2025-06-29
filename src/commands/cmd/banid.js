import { RANK } from "../../util/util.js"
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: "banid",
		minRank: RANK.ADMIN,
		usage: 'banid <id> <minutes (-1 for infinite)>',
		description: 'Bans a user.'
	}, async execute(client, args){
		if(args.length < 2) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: usageString(this)
			}
		});
		let time = parseInt(args[1]);
		if (time <= 0 && time !== -1) return client.sendMessage({
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
				message: 'No player with that ID.'
			}
		});
		let expirationTime = time === -1 ? -1 : Date.now() + time * 60000;
		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				message: `Banned ${target.uid} (${target.ip.ip}) for ${time} minutes`
			}
		});
		target.ip.ban(expirationTime);
		client.server.adminMessage(`DEVBanned ${target.ip.ip} for ${time} minutes`);
	}
}