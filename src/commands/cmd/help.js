import { RANK } from "../../util/util.js";
import { commands } from "../commandHandler.js";

export default {
	data: {
		name: 'help',
		description: 'Lists all available commands',
		usage: 'help [command]',
		aliases: ['h','?'],
		minRank: RANK.NONE,
		hidden: false,
	},
	async execute(client, args){
		if(!args.length){
			let commandsList = [];
			for(const [name, command] of commands){
				if(command.data.hidden) continue;
				if(command.data.disabled) continue;
				if(command.data.minRank>client.rank) continue;
				commandsList.push(name);
			}
			commandsList = commandsList.sort();
			client.sendMessage({
				sender: 'server',
				type: 'info',
				data: {
					message: `[Server]: Available commands: ${commandsList.join(', ')}.\n\nType /help [command] for more info about a command.`
				}
			});
			return;
		}
		let cmd = commands.get(args[0].toLowerCase());
		if(!cmd||cmd.data.hidden||cmd.data.minRank>client.rank){
			client.sendMessage({
				sender: 'server',
				type: 'error',
				data: {
					message: `[Server]: Unknown command: ${args[0]}.`
				}
			});
			return;
		}
		let aliases = '[None]';
		if(cmd.data.aliases) if(cmd.data.aliases.length) aliases = cmd.data.aliases.join(', ');
		else aliases = '[None]';
		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				message: `[Server]: ${cmd.data.name} - ${cmd.data.description}\nUsage: /${cmd.data.usage}\nAliases: ${aliases}`
			}
		});
	}
}