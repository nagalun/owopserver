import { RANK } from "../../util/util.js"
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: "banip",
		minRank: RANK.ADMIN,
		usage: 'banip <ip> <minutes (-1 for infinite)>',
		description: 'Bans a user by IP.',
		hidden: false,
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
		let target = await client.server.ips.fetch(args[0]);
		let expirationTime = time === -1 ? -1 : Date.now() + time * 60000;
		if(!client.destroyed) client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				message: `Banned ${target.ip} for ${time} minutes`
			}
		});
		target.ban(expirationTime);
	}
}