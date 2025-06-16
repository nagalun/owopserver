import { RANK } from "../../util/util.js"
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: "bans",
		minRank: RANK.ADMIN,
		usage: 'bans <add/remove/check> <ip> <unix_time>',
		description: 'Manage bans saved on the server.',
	}, async execute(client, args){
		if(!args.length) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data:{
				message: usageString(this)
			}
		});
		switch(args[0].toLowerCase()){
			case "add":{
				if(args.length<3) return client.sendMessage({
					sender: 'server',
					type: 'error',
					data:{
						message: usageString(this)
					}
				});
				let timestamp = parseInt(args[2]);
				if(isNaN(timestamp)) return client.sendMessage({
					sender: 'server',
					type: 'error',
					data:{
						message: usageString(this)
					}
				});
				let target = await client.server.ips.fetch(args[1]);
				if(!client.destroyed) return client.sendMessage({
					sender: 'server',
					type: 'info',
					data:{
						message: `Banned ${args[1]} until ${timestamp}`
					}
				});
				return target.ban(timestamp);
			}
			case "remove":{
				if(args.length<2) return client.sendMessage({
					sender: 'server',
					type: 'error',
					data:{
						message: usageString(this)
					}
				});
				let target = await client.server.ips.fetch(args[1]);
				if(!client.destroyed) return client.sendMessage({
					sender: 'server',
					type: 'info',
					data:{
						message: `Unbanned IP: ${args[1]}`
					}
				});
				target.setProp("banExpiration", 0);
				return client.server.adminMessage(`Unbanned IP: ${args[1]}`);
			}
			case "check":{
				if(args.length<2) return client.sendMessage({
					sender: 'server',
					type: 'error',
					data:{
						message: usageString(this)
					}
				});
				let target = await client.server.ips.fetch(args[1]);
				if(client.destroyed) return;
				if(target.banExpiration >= Date.now()){
					return client.sendMessage({
						sender: 'server',
						type: 'info',
						data:{
							message: `IP ${args[1]} is banned until ${target.banExpiration}, for ${Math.floor((target.banExpiration - Date.now()) / 1000)} seconds.`
						}
					});
				}
				if(target.banExpiration === -1){
					return client.sendMessage({
						sender: 'server',
						type: 'info',
						data:{
							message: `IP ${args[1]} is forever.`
						}
					});
				}
				return client.sendMessage({
					sender: 'server',
					type: 'info',
					data:{
						message: `IP ${args[1]} is not banned.`
					}
				});
			}
			default: {
				return client.sendMessage({
					sender: 'server',
					type: 'error',
					data:{
						message: usageString(this)
					}
				});
			}
		}
	}
}