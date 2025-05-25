import { RANK } from "../../util/util.js"
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: "pass",
		minRank: RANK.NONE,
		usage: 'pass <password>',
		description: 'Unlocks drawing on a protected world.',
	}, async execute(client, args){
		if(!args.length) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data:{
				message: usageString(this)
			}
		});
		if(client.rank >= 2) return;
		if(args===client.world.modpass.value){
			client.server.adminMessage(`DEV${client.uid} (${client.world.name}, ${client.ip.ip}) Got local mod`);
			client.sendMessage({
				sender: 'server',
				data:{
					action: 'savePassword',
					passwordType: 'worldpass'
				}
			});
			client.setRank(2);
			return;
		}
		if(client.rank < 1 && args===client.world.pass.value){
			if(client.world.restricted.value){
				client.sendMessage({
					sender: 'server',
					type: 'error',
					data:{
						message: 'Can\'t unlock drawing, this world is restricted!'
					}
				});
				return;
			}
			client.sendMessage({
				sender: 'server',
				data:{
					action: 'savePassword',
					passwordType: 'worldpass'
				}
			});
			client.setRank(1);
			return;
		}
		client.sendMessage({
			sender: 'server',
			data:{
				action: 'invalidatePassword',
				passwordType: 'worldpass'
			}
		});
		// client.destroy();
	}
}