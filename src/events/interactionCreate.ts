import {
  ChatInputCommandInteraction,
  CommandInteractionOptionResolver,
} from 'discord.js';
import { client } from '../index';
import { Event } from '../modules/index';

export default new Event('interactionCreate', async (interaction) => {
  
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);

    await command?.run({
      args: interaction.options as CommandInteractionOptionResolver,
      client,
      interaction: interaction as ChatInputCommandInteraction,
    });
  }
});
