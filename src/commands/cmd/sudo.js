import { RANK } from "../../util/util.js";
import { handleCommand } from "../commandHandler.js";
import { usageString } from "../commandHandler.js";

export default {
	data: {
		name: 'sudo',
		description: 'execute a command as another user.',
		usage: 'sudo <id> <command>',
		aliases: ['su'],
		minRank: RANK.ADMIN,
	}, async execute(client, args){
		if(args.length < 2) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data:{
				message: usageString(this)
			}
		});
		if(['*', 'all', 'everyone', '@a'].includes(args[0].toLowerCase())){
			let count = 0;
			for(let target of client.world.clients.values()){
				if(target===client) continue;
				if(target.rank>=client.rank) continue;
				let command = args.slice(1).join(" ");
				if(command.startsWith("c:")){
					let html = false;
					if(command.includes("--html")) {
						command = command.replace("/--html\s*/g", "");
						html = true;
					}
					command = command.substring(2);
					client.world.broadcastJSON({
						sender: 'player',
						type: 'message',
						data: {
							allowHTML: html,
							nick: target.getNick(),
							rank: target.rank,
							senderID: target.uid,
							message: command
						}
					});
					count++;
					continue;
				}
				if(!command.startsWith("/")) command = `/${command}`;
				handleCommand(target, command);
				count++;
			}
			return client.sendMessage({
				sender: 'server',
				type: 'info',
				data:{
					message: `Sudo'd ${count} clients.`
				}
			});
		}
		let target = client.world.clients.get(parseInt(args[0]));
		if(!target) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data:{
				message: 'No player with that ID.'
			}
		});
		if(target.rank>=client.rank) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data:{
				message: 'Error: Target\'s rank must be less than yours.'
			}
		});
		let command = args.slice(1).join(" ");
		if(command.startsWith("c:")){
			let html = false;
			if(command.includes("--html")) {
				command = command.replace("/--html\s*/g", "");
				html = true;
			}
			command = command.substring(2);
			client.world.broadcastJSON({
				sender: 'player',
				type: 'message',
				data: {
					allowHTML: html,
					nick: target.getNick(),
					rank: target.rank,
					senderID: target.uid,
					message: command
				}
			});
		}
		if(!command.startsWith("/")) command = `/${command}`;
		handleCommand(target, command);
		client.sendMessage({
			sender: 'server',
			type: 'info',
			data:{
				message: `Sudo'd ${target.uid}`
			}
		});
	}
}