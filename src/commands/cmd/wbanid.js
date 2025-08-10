import { RANK, parseDuration, formatDuration } from "../../util/util.js"
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: "wbanid",
		minRank: RANK.MOD,
		usage: 'wbanid [property] <id> [time] [reason]',
		description: 'Bans a user by ID in the current world. Property can be ip, continent, country, or asn (defaults to ip). Time can be specified with units (e.g. 15m, 4d, 2w) or as minutes without units.'
	}, async execute(client, args){
		if(args.length < 1) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: usageString(this)
			}
		});

		// Check if first argument is a number. if it is, auto add the default property type.
		if (!isNaN(args[0])) {
			args.unshift('ip');
		}

		// validate ID being a number
		if(isNaN(args[1])) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: 'Invalid player ID. Must be a number.'
			}
		});

		const propertyType = args[0];
		const id = parseInt(args[1]);

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

		let target = client.world.clients.get(id);
		if(!target) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: 'No player with that ID.'
			}
		});

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

		let comment = args.slice(3).join(' ') || '';
		let expirationTime = time === -1 ? -1 : Math.floor((Date.now() + time * 60000));
		let value = null;

		switch(propertyType) {
			case 'ip':
				value = target.ip.ip;
				break;
			case 'continent':
				value = target.geoData?.continentCode;
				break;
			case 'country':
				value = target.geoData?.countryCode;
				break;
			case 'asn':
				value = target.geoData?.asn;
				break;
		}

		if (!value) {
			return client.sendMessage({
				sender: 'server',
				type: 'error',
				data: {
					message: `Cannot ban by ${propertyType} because the player does not have this information.`
				}
			});
		}

		let log = `Banned by ${client.getNick()} (${client.uid})`;
		const concealedValue = client.server.conceal(value).short;
		client.world.banByProperty(propertyType, concealedValue, expirationTime, comment, log);

		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				message: `Banned player ${id} by ${propertyType} in this world for ${time === -1 ? 'ever' : formatDuration(time * 60000)}`
			}
		});

		client.server.adminMessage(`DEVWban ID ${id} by ${propertyType} in ${client.world.name} by ${client.getNick()} (${client.uid}) for ${time === -1 ? 'ever' : formatDuration(time * 60000)}`);
	}
}
