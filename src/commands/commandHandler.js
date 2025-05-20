import { validateQuotaString, parseColor } from "../util/util.js"
import path from "path"
import { fileURLToPath } from "url"
import { RANK } from "../util/util.js"

export function handleCommand(client, message){
	message = message.substring(1);
	let args = message.split(" ");
	let cmdName = args.shift().toLowerCase();
	let cmd = commands.get(cmdName);
	if (!cmd){
		for(let command of commands.values()){
			if(!command.data.aliases) continue;
			if(command.data.aliases.includes(cmdName)){
				cmd = command;
				break;
			}
		}
		if(!cmd) return;
	}
	if(client.rank < (!!cmd.data.minRank?cmd.data.minRank:RANK.NONE)) return;
	if(cmd.data.disabled) return;
	cmd.execute(client,args);
}

export const commands = new Map();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadCommands(){
	commands.clear();
	const commandFiles = await readdir(path.join(__dirname,"cmd"));
	for(const file of commandFiles){
		if(file.endsWith(".js")){
			try {
				const fullPath = path.join(__dirname,"cmd",file);
				const fileUrl = `file://${fullPath}?u=${Date.now()}`;
				
				const commandModule = await import(fileUrl);
				const command = commandModule.default;

				if(command?.data?.name){
					commands.set(command.data.name.toLowerCase(),command);
					console.log(`Loaded command: ${command.data.name}`);
				}
			} catch(e){
				console.error(`Failed to load command: ${file}: `, e);
			}
		}
	}
}

export function usageString(command){
	return `Usage: /${command.data.usage}`;
}

commands.set("pass", {
  minRank: 0,
  hidden: false,
  eval: function (client, args, argsSplit) {
    if (!args) {
      client.sendString("Use to unlock drawing on a protected world.")
      client.sendString("Usage: /pass WORLDPASSWORD")
      return
    }
    if (client.rank >= 2) return
    if (args === client.world.modpass) {
      client.server.adminMessage(`DEV${client.uid} (${client.world.name}, ${client.ip.ip}) Got local mod`)
      client.setRank(2)
      return
    } else if (client.rank < 1 && args === client.world.pass) {
      if (client.world.restricted) {
        client.sendString("Can't unlock drawing, this world is restricted!")
        return
      }
      client.setRank(1)
      return
    } else {
      client.destroy()
      return
    }
  }
})

commands.set("lockdown", {
  minRank: 3,
  hidden: false,
  eval: function (client, args, argsSplit) {
    if (!args) {
      client.sendString("Only allows players with whitelisted IPs to connect.")
      client.sendString("Admin IPs are automatically added to the whitelist (careful, don't change your ip while this is on).")
      client.sendString("If all whitelisted admins disconnect, this is automatically disabled.")
      client.sendString("Usage: /lockdown true/false")
      return
    }
    let newState = args === "true"
    client.server.setLockdown(newState)
    client.sendString(`Lockdown mode ${newState ? "enabled" : "disabled"}.`)
  }
})
commands.set("worlds", {
  minRank: 3,
  hidden: false,
  eval: function (client, args, argsSplit) {
    client.sendString("Currently loaded worlds:")
    for (let world of client.server.worlds.map.values()) {
      client.sendString(`-> ${world.name} [${world.clients.size}]`)
    }
  }
})


commands.set("broadcast", {
  minRank: 3,
  hidden: false,
  eval: function (client, args, argsSplit) {
    if (!args) {
      client.sendString("Broadcasts a message to all connections.")
      return
    }
    client.server.broadcastString(args)
  }
})
commands.set("totalonline", {
  minRank: 3,
  hidden: false,
  eval: function (client, args, argsSplit) {
    client.sendString(`Total connections to the server: ${client.server.clients.map.size}`)
  }
})
commands.set("tellraw", {
  minRank: 3,
  hidden: false,
  eval: function (client, args, argsSplit) {
    if (argsSplit.length < 2) {
      client.sendString("Displays a message to a user as raw text.")
      client.sendString("Usage: /tellraw (id) (message)")
      return
    }
    let id = parseInt(argsSplit[0])
    let target = client.world.clients.get(id)
    if (!target) {
      client.sendString("User not found!")
      return
    }
    client.sendString("Message sent.")
    target.sendString(args.substring(args.indexOf(" ") + 1))
  }
})
commands.set("sayraw", {
  minRank: 3,
  hidden: false,
  eval: function (client, args, argsSplit) {
    if (!args) {
      client.sendString("Send a message as raw text.")
      client.sendString("Usage: /sayraw (message)")
      return
    }
    client.world.broadcastString(args)
  }
})
commands.set("endprocess", {
  minRank: 3,
  hidden: false,
  eval: async function (client, args, argsSplit) {
    client.sendString("Gracefully shutting down server")
    await client.server.destroy()
    process.exit()
  }
})