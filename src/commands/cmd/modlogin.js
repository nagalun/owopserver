import { RANK } from "../../util/util.js"

export default {
	data: {
		name: "modlogin",
		minRank: RANK.NONE,
		usage: 'modlogin <password>',
		hidden: true,
		disabled: true,
	},
	async execute(client, args){
		if(client.rank >= RANK.MODERATOR) return;
		if(!args.length) return;
		let password = args.join(" ");
		if(password !== process.env.MODPASS) {
			return client.sendMessage({
				sender: 'server',
				data: {
					action: 'invalidatePassword',
					passwordType: 'modlogin'
				}
			});
			// return client.destroy();
		}
		if(!client.world.allowGlobalMods.value){
			return client.sendMessage({
				sender: 'server',
				type: 'error',
				data: {
					message: '[Server]: Sorry, but global moderators are disabled on this world.'
				}
			}); 
		}
		client.server.adminMessage(`DEV${client.uid} (${client.world.name}, ${client.ip.ip}) Got mod`);
		client.setRank(RANK.MODERATOR);
		client.sendMessage({
			sender: 'server',
			data: {
				action: 'savePassword',
				passwordType: 'modlogin'
			}
		});
	}
}