import { RANK } from "../../util/util.js";
import { DEFAULT_PROPS } from "../../util/util.js";
import { formatPropValue } from "../../util/util.js";

export default {
	data: {
		name: 'getprop',
		description: 'gets worldprop',
		usage: 'getprop <prop>',
		aliases: [],
		minRank: RANK.ADMIN,
	}, async execute(client, args){
		if(!args.length) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data:{
				message: `Usage: /${this.data.usage}`
			},
		});
		for(let prop in DEFAULT_PROPS){
			if(prop.toLowerCase()===args[0].toLowerCase()){
				let value = client.world[prop].value;
				console.log(!value);
				if(!value) return client.sendMessage({
					sender: 'server',
					type: 'info',
					data:{
						message: `${prop}: <no value>`
					},
				});
				let formatted = formatPropValue(prop, value);
				return client.sendMessage({
					sender: 'server',
					type: 'info',
					data:{
						message: `${prop}: ${formatted}`
					},
				});
			}
		}
		client.sendMessage({
			sender: 'server',
			type: 'error',
			data:{
				message: `Invalid prop. Usage: /${this.data.usage}`
			},
		});
	}
}