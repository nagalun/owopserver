import { RANK } from "../../util/util.js"

export default {
	data: {
		name: "kickall",
		minRank: RANK.ADMIN,
		usage: 'kickall (world/all)',
		description: 'Kicks everyone from the world or the server, except admins.',
	}, async execute(client, args){
		if(!args.length) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data:{
				message: usageString(this)
			}
		});
		if(args[0]==="world"){
			let count = client.world.kickNonAdmins();
			client.sendMessage({
				sender: 'server',
				type: 'info',
				data:{
					message: `Kicked ${count} clients from the world.`
				}
			});
			return client.server.adminMessage(`DEVKicked all non-admins from ${client.world.name}`);
		}
		if(args[0]==="all"){
			let count = client.server.kickNonAdmins();
			client.sendMessage({
				sender: 'server',
				type: 'info',
				data:{
					message: `Kicked ${count} clients from the server.`
				}
			});
			return client.server.adminMessage("DEVKicked all non-admins from the server");
		}
	}
}