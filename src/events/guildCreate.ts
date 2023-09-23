import { client } from '..';
import { Event } from '../modules/index';

export default new Event('guildCreate', async (guild) => {
  client.user?.setActivity({
    name: `/help | ${client.guilds.cache.size} servers`
  })
});
