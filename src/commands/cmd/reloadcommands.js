import { RANK } from "../../util/util.js";
import { loadCommands } from "../commandHandler.js";

export default {
	data: {
		name: 'reloadcommands',
		description: 'Reloads all commands.',
		usage: 'reloadcommands',
		aliases: ['rc'],
		minRank: RANK.DEVELOPER,
	}, async execute(client, args){
		await loadCommands();
		client.sendMessage({
			sender: 'server',
			data:{
				type: 'info',
			},
			text: `[All commands reloaded]`
		});
	}
}