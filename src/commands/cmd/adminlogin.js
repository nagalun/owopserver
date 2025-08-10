import { RANK } from "../../util/util.js"

export default {
	data: {
		name: "adminlogin",
		minRank: RANK.NONE,
		usage: 'adminlogin <password>',
		hidden: true,
		nolog: true,
	},
	async execute(client, args){
		if(client.rank >= RANK.ADMIN) return;
		if(!args.length) return;
		let password = args.join(" ");
		if(password !== process.env.ADMINPASS) {
			return client.sendMessage({
				sender: 'server',
				data: {
					action: 'invalidatePassword',
					passwordType: 'adminlogin'
				}
			});
			// return client.destroy();
		}
		client.setRank(RANK.ADMIN);
		client.sendMessage({
			sender: 'server',
			data: {
				action: 'savePassword',
				passwordType: 'adminlogin'
			}
		});
	}
}
