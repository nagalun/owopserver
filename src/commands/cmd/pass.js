import { RANK } from "../../util/util.js"
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: "pass",
		minRank: RANK.NONE,
		usage: 'pass &lt;password&gt;',
		description: 'Unlocks drawing on a protected world.',
		nolog: true,
	}, async execute(client, args){
		if(!args.length) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data:{
				message: usageString(this)
			}
		});
		if(client.rank >= 2) return;
		let pass = args.join(' ');
		if(pass===client.world.modpass.value){
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
		if(pass===client.world.pass.value){
			if (client.rank > 0) {
				return;
			}
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
