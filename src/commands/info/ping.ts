import { Colors, EmbedBuilder } from 'discord.js';
import { Command } from '../../modules';

export default new Command({
  name: 'ping',
  description: 'Measure the response speed of the bot.',
  run: async ({ client, interaction }) => {
    await interaction.deferReply();

    await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setTitle(client.i18n.__("command.ping.title"))
          .setDescription(client.i18n.__("command.ping.description").replace('{ping}', `${client.ws.ping}`))
          .setColor(Colors.Aqua)
          .setFooter({
            text: client.getUserData().footer,
            iconURL: client.getUserData().icon,
          }),
      ],
    });
  },
});
