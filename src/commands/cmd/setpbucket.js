import { RANK } from "../../util/util.js";
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: 'setpbucket',
		description: 'sets a client\'s drawing limit.',
		usage: 'setpbucket <id> <rate (up to 65535)> <per (up to 65535)>',
		minRank: RANK.ADMIN,
	}, async execute(client, args){
		if(args.length < 3) return client.sendMessage({
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
		let amount = parseInt(args[1]);
		if(!(amount>=0&&amount<=65535)) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data:{
				message: usageString(this)
			}
		});
		let seconds = parseInt(args[2]);
		if(!(seconds>=0&&seconds<=65535)) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data:{
				message: usageString(this)
			}
		});
		target.setPquota(amount, seconds);
		client.sendMessage({
			sender: 'server',
			type: 'info',
			data:{
				message: `Set client's place bucket: (${amount}, ${seconds})`
			}
		});
	}
}