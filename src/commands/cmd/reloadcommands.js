import { RANK } from "../../util/util.js";
import { loadCommands } from "../commandHandler.js";

export default {
	data: {
		name: 'reloadcommands',
		description: 'Reloads all commands.',
		usage: 'reloadcommands',
		aliases: ['rc'],
		disabled:true,
		minRank: RANK.ADMIN,
	}, async execute(client, args){
		await loadCommands(client.server,client);
	}
}