import { RANK } from "../../util/util.js";
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: "whois",
		minRank: RANK.USER,
		usage: 'whois <id>',
		description: 'Gets information about a user.',
		hidden: false,
	}, async execute(client, args){
		if(!args.length) return client.sendMessage({
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
		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				message: `Client information for: ${target.uid}`
			}
		});
		if(client.rank >= RANK.ADMIN) client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				classNameOverride: 'whisper',
				message: `-> IP: ${target.ip.ip}`
			}
		});
		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				classNameOverride: 'whisper',
				message: `-> Connections by this IP: ${target.ip.clients.size}`
			}
		});
		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				classNameOverride: 'whisper',
				message: `-> Origin header: ${target.ws.origin}`
			}
		});
		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				classNameOverride: 'whisper',
				message: `-> Rank: ${target.rank}`
			}
		});
		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				classNameOverride: 'whisper',
				message: `-> Nick: ${target.getNick()}`
			}
		});

		const formatForRank = texts => client.rank >= RANK.ADMIN
				? `${texts.join(', ')} (${client.server.conceal(texts[0])?.short})`
				: client.server.conceal(texts[0])?.short;

		const geoProps = [
			{ name: 'Continent', get(obj) { return [obj.continentCode] }, show(obj) { return !!obj.continentCode } },
			{ name: 'Country', get(obj) { return [obj.countryCode, obj.countryName, obj.cityName] }, show(obj) { return !!obj.countryCode } },
			{ name: 'ASN', get(obj) { return [obj.asn, obj.asnName] }, show(obj) { return !!obj.asn } },
		];

		if (client.rank >= RANK.MODERATOR) {
			const geoData = target.geoData || {};

			client.sendMessage({
				sender: 'server',
				type: 'info',
				data: {
					classNameOverride: 'whisper',
					message: `-> IP Hash: ${client.server.conceal(target.ip.ip)}`
				}
			});

			for (const pr of geoProps) {
				if (!pr.show(geoData)) continue;

				client.sendMessage({
					sender: 'server',
					type: 'info',
					data: {
						classNameOverride: 'whisper',
						message: `-> ${pr.name}: ${formatForRank(pr.get(geoData))}`
					}
				});
			}
		}
	}
}
