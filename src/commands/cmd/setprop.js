import { RANK } from "../../util/util.js";
import { DEFAULT_PROPS } from "../../util/util.js";
import { validateQuotaString } from "../../util/util.js";
import { parseColor } from "../../util/util.js";
import { formatPropValue } from "../../util/util.js";

export default {
	data: {
		name: 'setprop',
		description: 'sets worldprop',
		usage: 'setprop <prop> <value>',
		aliases: [],
		minRank: RANK.ADMIN,
	}, async execute(client, args) {
		if (!args.length) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: `Usage: /${this.data.usage}`
			},
		});
		for (let prop in DEFAULT_PROPS) {
			if (prop.toLowerCase() === args[0].toLowerCase()) {
				let valueToSet;
				switch (prop.toLowerCase()) {
					case "restricted":
						valueToSet = args[1] === "true";
						break;
					case "pass":
						valueToSet = args[1];
						break;
					case "modpass":
						valueToSet = args[1];
						break;
					case "pquota":
						if (!validateQuotaString(args[1])) return client.sendMessage({
							sender: 'server',
							type: 'error',
							data: {
								message: `Invalid value. Usage: /${this.data.usage}`
							},
						});
						valueToSet = args[1];
						break;
					case "motd":
						valueToSet = args.splice(1).join(" ");
						break;
					case "bgcolor":
						valueToSet = parseColor(args[1]);
						if (valueToSet === false) return client.sendMessage({
							sender: 'server',
							type: 'error',
							data: {
								message: `Invalid value. Must be a hex color.`
							},
						});
						break;
					case "doublemodpquota":
						valueToSet = args[1] == "true";
						break;
					case "pastingallowed":
						valueToSet = args[1] == "true";
						break;
					case "maxplayers":
						valueToSet = parseInt(args[1]);
						if (!(valueToSet > 0)) return client.sendMessage({
							sender: 'server',
							type: 'error',
							data: {
								message: `Invalid value. Must be greater than 0.`
							},
						});
					case "maxtpdistance":
						valueToSet = parseInt(args[1]);
						if (!(valueToSet >= -1 && valueToSet <= 134217728)) return client.sendMessage({
							sender: 'server',
							type: 'error',
							data: {
								message: `Invalid value. Must be between -1 and 134217728.`
							},
						});
					case "modprefix":
						valueToSet = args.slice(1).join(" ");
						break;
					case "simplemods":
						valueToSet = args[1] == "true";
						break;
					case "allowglobalmods":
						valueToSet = args[1] == "true";
						break;
					case "stickyimage":
						valueToSet = args.slice(1).join(" ");
						break;
					case "stickyimagesize":
						valueToSet = args[1];
						let sizeCheck = valueToSet.split("x").map(value => parseInt(value));
						if (!(sizeCheck[0] > 0 && sizeCheck[1] > 0)) return client.sendMessage({
							sender: 'server',
							type: 'error',
							data: {
								message: `Invalid value. Must be formatted as WIDTHxHEIGHT, and be greater than 0.`
							},
						});
					default:
						valueToSet = args[1];
						break;
				}
				client.world.setProp(prop, valueToSet);
				let formatted = formatPropValue(prop, valueToSet);
				return client.sendMessage({
					sender: 'server',
					type: 'info',
					data: {
						message: `Set ${prop} to ${formatted}.`
					},
				});
			}
		}
		return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: `Invalid prop. Usage: /${this.data.usage}`
			},
		});
	}
}