import { RANK } from "../../util/util.js"
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: "setworldpass",
		minRank: RANK.MODERATOR,
		usage: 'setworldpass <(password | remove)>',
		description: 'Sets the password for this world.',
		hidden: false,
	}, async execute(client, args) {
		if (client.rank < RANK.ADMIN && client.world.simpleMods.value) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: 'No setworldpass for you.'
			}
		});
		if (!args) {
			client.sendMessage({
				sender: 'server',
				type: 'error',
				data: {
					message: "Use to set the password on this world."
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
		let value = args.join(" ").trim();
		if (value === "remove") {
			client.sendMessage({
				sender: 'server',
				type: 'info',
				data: {
					message: "World password removed!"
				}
			});
			return client.world.setProp("pass", null);
		}
		if (!value) {
			client.sendMessage({
				sender: 'server',
				type: 'error',
				data: {
					message: "Use to set the password on this world."
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
		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				message: `[Server]: World password set to: '${value}'`
			}
		});
		client.world.setProp("pass", value);
		client.world.demoteAllNormalUsers();
	}
}