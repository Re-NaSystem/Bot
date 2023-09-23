import { Colors, EmbedBuilder } from 'discord.js';
import { Command } from '../../modules';

export default new Command({
  name: 'ping',
  description: 'Test the bot response time',
  run: async ({ client, interaction }) => {
    interaction.deferReply();

    const embed = new EmbedBuilder()
      .setTitle('🏓 Pong!')
      .setDescription(`WebSocket Ratency: ${client.ws.ping}`)
      .setColor(Colors.Aqua)
      .setFooter({
        text: client.getUserData().footer,
        iconURL: client.getUserData().icon,
      });

    interaction.followUp({
      embeds: [embed],
    });
  },
});
