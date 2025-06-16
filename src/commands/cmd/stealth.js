import { RANK } from "../../util/util.js"
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: "stealth",
		minRank: RANK.ADMIN,
		usage: 'stealth <true/false>',
		hidden: false,
		description: 'Stops broadcasting movement updates.'
	}, async execute(client, args) {
		if(!args.length) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: usageString(this)
			}
		});
		let newState = args[0] === "true";
		client.stealth = newState;
		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				message: `Stealth mode ${newState ? "enabled" : "disabled"}.`
			}
		});
	}
}