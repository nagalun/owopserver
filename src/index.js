import "dotenv/config"
import { Server } from "./server/Server.js"
import readline from "readline"
import { stdin, stdout } from "process"
import fs from "fs/promises"

const gracefulShutdown = async () => {
  console.log("Attempting graceful shutdown")
  //this saves chunks, worlds, ip data, and cleans everything up in a neat-ish way
  await server.destroy()
  rl.close()
  process.exit()
};

//console input stuff
let rl = readline.createInterface({ input: stdin, output: stdout })
rl.on("line", async d => {
  let msg = d.toString().trim()
  try {
    console.log(eval(msg))
  } catch (e) {
    console.log(e.name + ": " + e.message + "\n" + e.stack)
  }
})

rl.on("SIGINT", gracefulShutdown)
process.on("SIGTERM", gracefulShutdown)

let config = JSON.parse(await fs.readFile("./config.json"))

let server = new Server(config)
