import { RANK } from "../../util/util.js"

export default {
	data: {
		name: "nick",
		minRank: RANK.NONE,
		usage: 'nick [nickname]',
		hidden: false,
		description: 'Sets your nickname in chat.',
		aliases: ["n"],
	},
	async execute(client, args){
		if(!args.length){
			client.nick = null;
			return client.sendMessage({
				sender: 'server',
				type: 'info',
				data: {
					action: 'updateNick',
					nick: null,
					message: '[Server]: Nickname cleared.'
				},
			});
		}
		let nick = args.join(" ").trim();
		let maxLength = [16, 16, 40, Infinity][client.rank];
		if(client.isBot) maxLength+=4;
		if(nick.length > maxLength) return client.sendMessage({
			sender: 'server',
			type: 'error',
			data: {
				message: `[Server]: Nickname too long. Maximum length is ${maxLength}.`
			}
		});
		client.nick = nick;
		client.sendMessage({
			sender: 'server',
			type: 'info',
			data: {
				action: 'updateNick',
				nick: nick,
				message: `[Server]: Nickname set to '${nick}'.`
			}
		});
	}
}