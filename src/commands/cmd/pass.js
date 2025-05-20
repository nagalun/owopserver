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
		if(args===client.world.modpass){
			client.server.adminMessage(`DEV${client.uid} (${client.world.name}, ${client.ip.ip}) Got local mod`);
			client.sendMessage({
				sender: 'server',
				data:{
					action: 'savePassword',
					passwordType: client.world.name
				}
			});
			client.setRank(2);
			return;
		}
		if(client.rank < 1 && args===client.world.pass){
			if(client.world.restricted){
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
					passwordType: client.world.name
				}
			});
			client.setRank(1);
			return;
		}
		client.sendMessage({
			sender: 'server',
			data:{
				action: 'invalidatePassword',
				passwordType: client.world.name
			}
		});
		client.destroy();
	}
}

commands.set("pass", {
	minRank: 0,
	hidden: false,
	eval: function (client, args, argsSplit) {
	  if (!args) {
		client.sendString("Use to unlock drawing on a protected world.")
		client.sendString("Usage: /pass WORLDPASSWORD")
		return
	  }
	  if (client.rank >= 2) return
	  if (args === client.world.modpass) {
		client.server.adminMessage(`DEV${client.uid} (${client.world.name}, ${client.ip.ip}) Got local mod`)
		client.setRank(2)
		return
	  } else if (client.rank < 1 && args === client.world.pass) {
		if (client.world.restricted) {
		  client.sendString("Can't unlock drawing, this world is restricted!")
		  return
		}
		client.setRank(1)
		return
	  } else {
		client.destroy()
		return
	  }
	}
  })