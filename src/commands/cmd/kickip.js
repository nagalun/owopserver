import { RANK } from "../../util/util.js"
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: "kickip",
		minRank: RANK.NONE,
		usage: 'kickip <ip>',
		hidden: false,
		description: 'Kicks an IP from all connected instances.',
		aliases: ["k"],
	}, async execute(client, args){
		if(!args.length) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: usageString(this)
			}
		});
		let target = client.server.ips.map.get(args);
		if(!target) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: 'No player with that IP.'
			}
		});
		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				message: `Kicked IP ${target.ip}`
			}
		});
		target.kick();
		client.server.adminMessage(`DEVKicked IP: ${target.ip}`);
	}
}