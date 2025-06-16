import { RANK } from "../../util/util.js";
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: 'setbucketspeed',
		description: 'sets a client\'s fill bucket speed.',
		usage: 'setpspeed <id> <speed (up to 65535)>',
		minRank: RANK.ADMIN,
	}, async execute(client, args){
		if(args.length < 2) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data:{
				message: usageString(this)
			}
		});
		let id = parseInt(args[0]);
		let target = client.world.clients.get(id);
		if(!target) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data:{
				message: 'Client not found!'
			}
		});
		let speed = parseInt(args[1]);
		if(!(speed>=0&&speed<=65535)) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data:{
				message: usageString(this)
			}
		});
		target.sendMessage({
			sender: 'server',
			data:{
				action: 'setBucketSpeed',
				speed: speed
			}
		});
	}
}