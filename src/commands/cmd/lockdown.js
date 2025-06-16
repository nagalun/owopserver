import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'lockdown',
		description: 'puts the server on lockdown. only admin or higher will be able to join, as well as people on the whitelist. if all whitelisted admins disconnect, this is disabled automatically.',
		usage: 'lockdown <true/false>',
		aliases: [],
		minRank: RANK.ADMIN,
	}, async execute(client, args){
		if(client.localStaff) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Only global admins have access to this command.`
		});
		if(!args.length) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `${this.data.description}\nUsage: /${this.data.usage}`
		});
		let newstate = args[0]==="true";
		client.server.lockdown = newstate;
		client.sendMessage({
			sender: 'server',
			data:{
				type: 'info',
			},
			text: `${newstate?"Enabled":"Disabled"} lockdown.`
		});
	}
}