import { RANK } from "../../util/util.js"
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: "restrict",
		minRank: 2,
		usage: 'restrict (true/false)',
		description: 'Restricts drawing for all new users in this world.',
		hidden: false,
	}, async execute(client, args) {
		if (client.rank < RANK.ADMIN && client.world.simpleMods.value) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: 'No restrict for you.'
			}
		});
		if (!args) {
			client.sendMessage({
				sender: 'server',
				type: 'error',
				data: {
					message: "Restricts drawing to all NEW users in this world. (manually grant with /setrank <id> 1)"
				}
			});
			return client.sendMessage({
				sender: 'server',
				type: 'error',
				data: {
					message: usageString(this)
				}
			});
		}
		let newState = args[0] === "true";
		client.world.restricted.value = newState;
		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				message: `Draw restriction is ${newState ? "ON" : "OFF"}`
			}
		});
	}
}