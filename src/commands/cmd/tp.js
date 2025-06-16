import { RANK } from "../../util/util.js";

export default {
	data: {
		name: "tp",
		minRank: RANK.MODERATOR,
		usage: 'tp <id> | tp <x> <y> | tp <id> <x> <y>',
		description: 'Teleport you or another user to a given location, or you to another user.',
		hidden: false,
	}, async execute(client, args){
		if(args.length < 1 || args.length > 3 || args.some(string => !string.match(/^-?\d+$/))) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: usageString(this)
			}
		});
		let argsNumbers = args.map(value => parseInt(value));
		switch(args.length){
			case 1: {
				let id = argsNumbers[0];
				let target = client.world.clients.get(id);
				if(!target) return client.sendMessage({
					sender: 'server',
					type: 'error',
					data: {
						message: `No player with ID ${id}.`
					}
				});
				return client.teleport(target.x, target.y);
			}
			case 2: {
				let x = argsNumbers[0];
				let y = argsNumbers[1];
				if(client.rank < RANK.ADMIN){
					if(Math.abs(x)>client.world.maxTpDistance.value || Math.abs(y) > client.world.maxTpDistance.value) return client.sendMessage({
						sender: 'server',
						type: 'error',
						data: {
							message: 'Out of range!'
						}
					});
				}
				client.sendMessage({
					sender: 'server',
					type: 'info',
					data: {
						message: `[Server]: Teleported to X: ${x}, Y: ${y}`
					}
				});
				return client.teleport(x<<4,y<<4);
			}
			case 3: {
				let id = argsNumbers[0];
				let x = argsNumbers[1];
				let y = argsNumbers[2];
				if(client.rank < RANK.ADMIN){
					if(Math.abs(x)>client.world.maxTpDistance.value || Math.abs(y) > client.world.maxTpDistance.value) return client.sendMessage({
						sender: 'server',
						type: 'error',
						data: {
							message: 'Out of range!'
						}
					});
				}
				let target = client.world.clients.get(id);
				if(!target) return client.sendMessage({
					sender: 'server',
					type: 'error',
					data: {
						message: `No player with ID ${id}.`
					}
				});
				let oldX = target.x>>4;
				let oldY = target.y>>4;
				target.teleport(x<<4,y<<4);
				client.sendMessage({
					sender: 'server',
					type: 'info',
					data: {
						message: `[Server]: Teleported ${id} from ${oldX}, ${oldY} to ${x}, ${y}`
					}
				});
			}
		}
	}
}