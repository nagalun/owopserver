import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'endprocess',
		description: 'gracefully shuts down the server.',
		usage: 'endprocess',
		aliases: [],
		minRank: RANK.ADMIN,
	}, async execute(client, args){
		client.sendMessage({
			sender: 'server',
			type: 'info',
			data:{
				message: "Gracefully shutting down server"
			}
		});
		await client.server.destroy();
		process.exit();
	}
}