import { client } from ".."
import { Event } from "../modules/index"

export default new Event("ready", async () => {
  console.log(`\x1b[36m${client.user?.tag} is now ready!\x1b[0m`);
  console.log(`\x1b[32mWebSocket Ratency: ${client.ws.ping}\x1b[0m`);
})