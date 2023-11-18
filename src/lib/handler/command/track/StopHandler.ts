import { client } from '@/index';
import { GuildQueue } from 'discord-player';
import { ChatInputCommandInteraction, Colors, EmbedBuilder } from 'discord.js';

const StopHandler = async (
  interaction: ChatInputCommandInteraction,
  queue: GuildQueue<unknown> | null
) => {
  if (queue?.isEmpty() || !queue) {
    return interaction.followUp({
      embeds: [
        {
          title: client.i18n.__('command.track.error.not_played'),
          color: Colors.Red,
          footer: client.footer(),
        },
      ],
    });
  }

  queue.delete();

  await interaction.followUp({
    embeds: [
      {
        title: client.i18n.__('command.track.stop'),
        color: Colors.Aqua,
        footer: client.footer(),
      },
    ],
  });
};

export default StopHandler;
