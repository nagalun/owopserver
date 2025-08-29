import { RANK } from "../../util/util.js"
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: "wkick",
		minRank: RANK.MODERATOR,
		usage: 'wkick <property> <value>',
		description: 'Kicks users by property (ip, continent, country, asn) in the current world.'
	}, async execute(client, args){
		if(args.length < 2) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: usageString(this)
			}
		});

		const propertyType = args[0].toLowerCase();
		const value = args[1];

		if (!['ip', 'continent', 'country', 'asn'].includes(propertyType)) {
			return client.sendMessage({
				sender: 'server',
				type: 'error',
				data: {
					message: 'Invalid property type. Use ip, continent, country, or asn.'
				}
			});
		}

		const count = client.world.kickByProperty(propertyType, value);

		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				message: `Kicked ${count} user(s) by ${propertyType} ${value} in this world.`
			}
		});

		client.server.adminMessage(`DEVWkick ${propertyType} ${value} in ${client.world.name} by ${client.getNick()} (${client.uid}) - Kicked ${count} users`);
	}
}
