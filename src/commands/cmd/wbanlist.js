import { RANK } from "../../util/util.js"
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: "wbanlist",
		minRank: RANK.MOD,
		usage: 'wbanlist [property] [startKey]',
		description: 'Shows the list of bans in the current world.'
	}, async execute(client, args){

		const propertyType = (args[0] || "ip").toLowerCase();

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

		const startKey = args[1] || null;

		const prefix = `bans$${propertyType}$`;
		const banEntries = [];

		const pageResult = await client.world.metadata.list(prefix, 10, startKey);

		for (const entry of pageResult) {
			if (entry.value !== null) { // Only include non-null values (active bans)
				banEntries.push({
					hashedValue: entry.key.substring(prefix.length), // Extract the hash value part
					timestamp: entry.value.timestamp,
					comment: entry.value.comment,
					date: entry.value.date
				});
			}
		}

		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				action: 'wbanlist',
				kind: propertyType,
				startKey,
				result: banEntries,
				message: "World banlist data"
			}
		});
	}
}
