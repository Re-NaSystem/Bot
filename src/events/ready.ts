import { setTimeout } from 'timers/promises';
import { client } from '..';
import { Event } from '../modules/index';

export default new Event('ready', async () => {
  console.log(`\x1b[36m${client.user?.tag} is now ready!\x1b[0m`);
  console.log(`\x1b[33mInvite link: https://discord.com/api/oauth2/authorize?client_id=${client.user?.id}&permissions=8&scope=applications.commands%20bot\x1b[0m`);
  
  console.log(`\x1b[32mWebSocket Ratency: ${client.ws.ping}\x1b[0m`);

  client.user?.setActivity({
    name: `/help | ${client.guilds.cache.size} servers`
  })
});
