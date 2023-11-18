import { client } from '@/index';
import { GuildQueue } from 'discord-player';
import { ChatInputCommandInteraction, Colors, EmbedBuilder } from 'discord.js';

const SkipHandler = async (
  interaction: ChatInputCommandInteraction,
  queue: GuildQueue<unknown> | null
) => {
  if (queue?.isEmpty() || !queue) {
    return interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setTitle(client.i18n.__('command.track.error.not_played'))
          .setColor(Colors.Red)
          .setFooter({
            text: client.getUserData().footer,
            iconURL: client.getUserData().icon,
          }),
      ],
    });
  }

  queue.node.skip();

  await interaction.followUp({
    embeds: [
      new EmbedBuilder()
        .setTitle(client.i18n.__('command.track.skip'))
        .setColor(Colors.Aqua)
        .setFooter({
          text: client.getUserData().footer,
          iconURL: client.getUserData().icon,
        }),
    ],
  });
};

export default SkipHandler;
