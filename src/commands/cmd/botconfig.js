import { RANK } from '../../util/util.js'
import { usageString } from '../commandHandler.js'

function no(cmd,client){
	return client.sendMessage({
			sender:'server',
			type:'error',
			data:{
				message: usageString(cmd)
			}
		});
}

export default {
	data:{
		name:'botconfig',
		description:'configure bot stuff for world',
		minRank: RANK.MODERATOR,
		aliases:['botcfg'],
		usage:'botconfig <(set <identifier> <secret>|rm <identifier>|ls)>'
	}, async execute(client,args){
		const bots = client.world.allowedBots;
		if(!args.length) return no(this,client);
		if(args[0]==='ls') return client.sendMessage({
			sender:'server',
			type:'info',
			data:{
				message:`Allowed bots:\n${bots && bots.size ? Array.from(bots,([k,v])=>`${k}: ${v},`).join('\n'):'[N/A]'}`,
			}
		});
		if(args[0]==='set'){
			if(args.length!==3) return no(this,client);
			bots.set(args[1],args[2]);
			client.world.dataModified=true;
			return client.sendMessage({
				sender:'server',
				type:'info',
				data:{
					message: `set bot ${args[1]} with secret ${args[2]}`,
				}
			});
		}
		if(args[0]==='rm'){
			if(args.length!==2) return no(this,client);
			bots.delete(args[1]);
			client.world.dataModified=true;
			return client.sendMessage({
				sender:'server',
				type:'info',
				data:{
					message: `removed bot ${args[1]}`,
				}
			});
		}
	}
}