import { RANK } from "../../util/util.js"
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: "wunban",
		minRank: RANK.MOD,
		usage: 'wunban <property> <value> [reason]',
		description: 'Unbans a user by property in the current world.'
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
		const reason = args.slice(2).join(' ') || '';

		// Validate property type
		if (!['ip', 'continent', 'country', 'asn'].includes(propertyType)) {
			return client.sendMessage({
				sender: 'server',
				type: 'error',
				data: {
					message: 'Invalid property type. Use ip, continent, country, or asn.'
				}
			});
		}

		let log = `Unbanned by ${client.getNick()} (${client.uid})`;
		if (reason) log += `, reason: ${reason}`

		await client.world.unbanByProperty(propertyType, value, log);

		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				message: `Unbanned ${propertyType} ${value} in this world`
			}
		});

		client.server.adminMessage(`DEVWunban ${propertyType} ${value} in ${client.world.name} by ${client.getNick()} (${client.uid})`);
	}
}
