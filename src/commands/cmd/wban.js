import { RANK, parseDuration, formatDuration } from "../../util/util.js"
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: "wban",
		minRank: RANK.MOD,
		usage: 'wban <property> <value> [time] [reason]',
		description: 'Bans a user by property (ip, continent, country, asn) in the current world. Property can be ip, continent, country, or asn. Time can be specified with units (e.g. 15m, 4d, 2w) or as minutes without units.'
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

		// Parse time (default to infinite)
		let time = -1;
		if (args[2] !== undefined && args[2] !== '-1') {
			try {
				time = parseDuration(args[2]);
			} catch (error) {
				return client.sendMessage({
					sender: 'server',
					type: 'error',
					data: {
						message: `Invalid time format. Use -1 for infinite, a number of minutes, or a duration string like "15m", "4d", "2w".`
					}
				});
			}
		}

		// Get ban comment
		let comment = args.slice(3).join(' ') || '';

		// Calculate expiration timestamp
		let expirationTime = time === -1 ? -1 : Math.floor((Date.now() + time * 60000));

		let log = `Banned by ${client.getNick()} (${client.uid})`;
		client.world.banByProperty(propertyType, value, expirationTime, comment, log);

		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				message: `Banned ${propertyType} ${value} in this world for ${time === -1 ? 'ever' : formatDuration(time * 60000)}`
			}
		});

		client.server.adminMessage(`DEVWban ${propertyType} ${value} in ${client.world.name} by ${client.getNick()} (${client.uid}) for ${time === -1 ? 'ever' : formatDuration(time * 60000)}`);
	}
}
